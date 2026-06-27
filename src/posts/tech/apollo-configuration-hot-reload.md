---
icon: pen-to-square
title: Apollo Configuration Hot Reload
date: 2026-06-27
category:
  - Technical
tags: ["Apollo", "Configuration", "Hot-Reload"]
---

# Apollo Configuration Hot Reload

Apollo configuration hot reload means an application can pick up configuration changes at runtime after a configuration is released in Apollo, without restarting the application.

The core idea is not that the server pushes the full configuration to every client. The real flow is:

```text
client long-polls for change notifications
  -> server returns changed namespace information
  -> client fetches the latest configuration
  -> client updates local caches
  -> client publishes config change events
```

In short, Apollo hot reload is based on **long polling, pulling the latest config, and notifying local listeners**.

### Why It Matters

In microservice systems, many parameters should not require a full redeployment:

* Feature flags.
* Rate limit thresholds.
* Canary release parameters.
* Business rules such as retry count or timeout value.
* Degradation switches during downstream incidents.

Hot reload reduces operational risk because teams can change runtime behavior quickly without rebuilding or restarting services.

### End-to-End Flow

A typical update flow looks like this:

```text
Developer / Operator
  -> releases config in Apollo Portal
  -> Apollo Admin Service stores the release
  -> Apollo Config Service observes the release message
  -> Apollo Client's long-polling request returns
  -> Apollo Client fetches the latest namespace config
  -> memory cache and local file cache are updated
  -> ConfigChangeListener is triggered
  -> application starts using the new value
```

The long-polling response usually tells the client which namespace changed. It does not carry the complete configuration payload. The client performs another request to fetch the latest config.

### Client Startup

When the application starts, Apollo Client loads configuration first:

```text
Remote Apollo Config Service
  -> Apollo Client memory cache
  -> Local file cache
```

If the Config Service is reachable, the client fetches config from the remote service, stores it in memory, and writes a local file cache. If the config center is temporarily unavailable, the local cache helps the application start or continue running with the last known configuration.

### How Long Polling Detects Changes

Apollo Client sends a notification request to Config Service, commonly through:

```text
/notifications/v2
```

The request includes the namespaces the client cares about and the latest notificationId known by the client.

The server-side behavior can be simplified as:

```text
if namespace has newer notificationId:
    return changed namespace immediately
else:
    hold the request for a while
```

If no config changes happen, the server keeps the request pending until timeout. If a config is released during that window, the server returns immediately. The client then starts the next long-polling cycle.

### Why Not WebSocket?

Apollo uses long polling because configuration changes are low-frequency events.

| Approach | Characteristics | Fit |
|---|---|---|
| Long polling | HTTP-friendly, proxy-friendly, simple enough | Good fit for config changes |
| WebSocket | Full-duplex persistent connection | Usually too heavy for config center notifications |
| Short polling | Simple periodic requests | More delay or more wasted requests |

Configuration updates usually do not require millisecond-level push delivery. Long polling is a practical balance between freshness, complexity, and infrastructure compatibility.

### How Local Config Is Refreshed

After the long-polling request returns, the client knows a namespace has changed. It then fetches the latest configuration, for example:

```text
/configs/{appId}/{clusterName}/{namespaceName}
```

After a successful fetch, Apollo Client:

* Compares old and new values.
* Updates the in-memory config object.
* Updates the local file cache.
* Builds a config change event.
* Invokes registered listeners.

Simplified flow:

```text
Notification received
  -> fetch latest config
  -> compare old and new properties
  -> update local repository
  -> publish change event
  -> invoke listeners
```

### Java Example

Application code can register a `ConfigChangeListener`:

```java
Config config = ConfigService.getAppConfig();

config.addChangeListener(changeEvent -> {
    for (String key : changeEvent.changedKeys()) {
        ConfigChange change = changeEvent.getChange(key);
        System.out.printf(
            "key=%s, oldValue=%s, newValue=%s, changeType=%s%n",
            key,
            change.getOldValue(),
            change.getNewValue(),
            change.getChangeType()
        );
    }
});
```

Good listener use cases:

* Updating in-memory feature flags.
* Adjusting rate limit thresholds.
* Refreshing local strategy objects.
* Rebuilding lightweight rule caches.

Avoid doing slow remote calls, heavy database operations, or complex blocking logic directly inside the listener.

### Spring Integration Caveats

In Spring Boot applications, Apollo can integrate with Spring `Environment`, `@Value`, and `@ConfigurationProperties`.

However, hot reload does not mean every already-created object is automatically rebuilt.

| Usage | Hot Reload Behavior |
|---|---|
| Dynamically reading from `ConfigService` or `Environment` | Usually reads the latest value |
| Registering a listener and updating local state manually | Explicit and reliable for important switches |
| Reading once during Bean initialization | May not update afterwards |
| Changing connection pools, thread pools, or complex clients | Needs dedicated rebuild or refresh logic |

> [!NOTE]
> Apollo can notify the application when configuration changes, but whether the application actually uses the new value depends on how the value is read or refreshed. Hot reload does not automatically recreate every initialized object.

### Availability and Failure Handling

Apollo has several resilience mechanisms:

* The client keeps a local file cache.
* Long-polling failures are retried.
* If fetching the latest config fails, the old value is usually kept.
* Config Service can be horizontally scaled.

But there are still boundaries:

* If the config center is unavailable, new releases cannot reach clients in time.
* During network partitions, different instances may temporarily see different values.
* A buggy listener can turn a config change into a runtime incident.
* Dynamic config does not replace version compatibility design for complex changes.

### Common Misunderstandings

#### Apollo pushes the full config from server to client

More precisely, the client long-polls for change notifications and then pulls the latest config.

#### All instances update at exactly the same time

Different instances may receive the notification and fetch config at slightly different times. It is near-real-time, not strictly simultaneous.

#### Every config is suitable for hot reload

Feature flags, thresholds, and strategy parameters are good candidates. Data source configuration, core thread pool settings, serialization protocol, and object structure changes need much more care.

#### `@Value` always changes automatically

If the value was copied into a normal field during Bean initialization, later refresh behavior depends on Apollo's Spring integration and the application's code. Important runtime switches should be handled explicitly.

### Trade-offs

| Benefit | Cost |
|---|---|
| Change config without restarting applications | Application code must handle runtime changes correctly |
| Fast degradation, canary, and feature flag control | Wrong config can affect production quickly |
| Local cache improves availability | Short-term inconsistency is possible |
| Long polling works well with HTTP infrastructure | Not designed for very high-frequency real-time messages |
