---
icon: network-wired
title: GKE Network Topology for Spring Cloud Microservices
date: 2026-06-28
category:
  - Technical
tags: ["Kubernetes", "GKE", "Spring Cloud", "Cloud Native", "Networking"]
---

# GKE Network Topology for Spring Cloud Microservices

Designing a robust and secure network topology is one of the most critical aspects of running Spring Cloud microservices on Google Kubernetes Engine (GKE). A production-ready architecture must clearly segregate the public ingress layer, the API gateways, internal backend services, the data storage layer, and observability components.

The following architecture diagram details how external traffic flows into GKE, how Spring Cloud Gateway routes requests to downstream microservices, how services connect to databases and message brokers privately, and how telemetry data is collected. This blueprint is highly useful for system design interviews, architecture reviews, or production planning.

## Typical Topology

![GKE Network Topology](/assets/images/gke-cloud-microservices-architecture.svg)

## End-to-End Request Flow

Here is the path an external request takes from the user's browser to the database:

```text
User Request
  ├──> Cloud DNS
  ├──> Google Cloud HTTP(S) Load Balancer
  ├──> Cloud Armor (WAF / DDoS Protection)
  ├──> GKE Ingress / Gateway API
  ├──> Spring Cloud Gateway Service (ClusterIP)
  ├──> Spring Cloud Gateway Pods
  ├──> Downstream Kubernetes Service (ClusterIP)
  ├──> Target Microservice Pods
  └──> Private Cloud SQL / Memorystore Redis / Pub/Sub
```

### Detailed Breakdown

* **Cloud DNS**: Resolves the domain name (e.g., `api.example.com`) to the public IP of the external load balancer.
* **External HTTPS Load Balancer (GCLB)**: Serves as the single public entry point, terminating TLS and distributing traffic across cluster nodes.
* **Cloud Armor**: Integrates directly with the GCLB to provide Web Application Firewall (WAF) capabilities, DDoS mitigation, and IP rate limiting or access lists.
* **GKE Ingress / Gateway API**: Translates external routing configurations into Kubernetes resources and directs the traffic from the load balancer into the GKE cluster.
* **Spring Cloud Gateway**: Serves as the application-level gateway, managing microservice concerns like authentication, dynamic routing, request translation, rate limiting, and canary releases.
* **Kubernetes Service (DNS-based Discovery)**: Internal microservices resolve and communicate with one another using CoreDNS (e.g., `http://order-service:8080`), bypassing the public gateway.
* **VPC Private Data Layer**: Services like Cloud SQL and Memorystore Redis are accessed via Private IP over VPC Network Peering or Private Service Connect (PSC), ensuring database traffic never traverses the public internet.

## Internal Service Discovery: Moving Away from Eureka

When migrating Spring Cloud applications to GKE, you can simplify your stack by eliminating traditional registry servers like Netflix Eureka or Consul. Kubernetes provides native service discovery and DNS resolution out of the box via **CoreDNS**.

Every Kubernetes Service acts as a stable DNS name mapping to a set of pods. For example:
* `http://user-service:8080`
* `http://order-service:8080`
* `http://payment-service:8080`

### Spring Cloud Gateway Route Configuration

Instead of using Eureka instances (`lb://order-service`), you can configure the routing using Kubernetes DNS names:

```yaml
spring:
  cloud:
    gateway:
      routes:
        - id: order-service
          uri: http://order-service:8080
          predicates:
            - Path=/orders/**
```

### Spring Cloud OpenFeign Integration

If you use Spring Cloud OpenFeign for service-to-service calls, configure clients to target the stable Kubernetes service URL instead of relying on Eureka lookup:

```java
@FeignClient(name = "orderClient", url = "${services.order.url}")
public interface OrderClient {
    @GetMapping("/orders/{id}")
    OrderDTO getOrder(@PathVariable Long id);
}
```

And in your `application.yml` or `application-prod.yml`:

```yaml
services:
  order:
    url: http://order-service:8080
```

## Layer-by-Layer Architectural Separation

To keep the platform secure, robust, and highly scalable, we separate our network architecture into distinct layers:

| Layer | Component | Primary Responsibility |
|---|---|---|
| **Public Entry** | Cloud DNS, External HTTPS Load Balancer, Cloud Armor | Global DNS resolution, TLS termination, WAF protection, and DDoS mitigation. |
| **Cluster Ingress** | GKE Ingress / Gateway API Controller | Routing traffic from external load balancers to internal cluster services. |
| **API Gateway** | Spring Cloud Gateway | Cross-cutting business concerns: authentication, authorization, business-level rate limiting, and canary routing. |
| **Service Discovery** | Kubernetes Service & CoreDNS | Dynamic, DNS-based internal routing between services. |
| **Workloads** | Spring Boot Deployment Pods | Executing business logic in scalable, containerized microservices. |
| **Data Storage** | Cloud SQL, Memorystore (Redis), Cloud Pub/Sub | Database persistence, caching, and asynchronous event messaging over private IP. |
| **Observability** | Cloud Logging, Cloud Monitoring, Cloud Trace | Infrastructure and application telemetry collection and alerting. |

## Why Keep Spring Cloud Gateway in a Kubernetes Environment?

A common question when migrating to GKE is: *"If we have GKE Ingress or the Gateway API, do we still need Spring Cloud Gateway?"*

The answer is yes. Ingress and Spring Cloud Gateway operate at different logical layers:

* **GKE Ingress (Platform Ingress)**: Manages platform-level traffic. It focuses on routing public traffic to private services, TLS termination, integration with GCP resources (like Cloud Armor and CDN), and host/path routing.
* **Spring Cloud Gateway (Application Ingress)**: Handles application-level business routing. It is close to the developer, written in Java/Kotlin, and can run custom filters, authentication/authorization (validating JWT tokens, session checks), rate-limiting based on tenant IDs or user IDs, request header manipulation, and canary testing based on business flags (e.g., custom HTTP headers or user properties).

By pairing them together:

```text
Google Cloud Load Balancer (GCLB)
   └──> GKE Ingress / Gateway API
         └──> Spring Cloud Gateway
               ├──> user-service
               ├──> order-service
               └──> payment-service
```

You separate infrastructure configuration (Ingress) from application logic (Spring Cloud Gateway), avoiding complex routing rules or authentication plugins in your platform layers.

## Securing the GKE Cluster

Deploying microservices on GKE requires a multi-layered security approach:

1. **Restricted Service Access**: All application microservices should be configured as `ClusterIP` services. Only the API Gateway (`api-gateway`) should have a route exposed to the ingress layer.
2. **Private Data Communication**: Avoid exposing databases (Cloud SQL) or cache stores (Memorystore Redis) to the public internet. Use GCP Private Services Access (PSA) to keep traffic local to the VPC network.
3. **Secure Secret Management**: Do not hardcode credentials in application properties. Instead, use Google Secret Manager integrated with GKE via the **External Secrets Operator** or use GKE **Workload Identity** to access cloud resources without static service account keys.
4. **Kubernetes Network Policies**: Implement a zero-trust network model within the cluster using `NetworkPolicy` resources. 
   * *Example flow constraint*:
     * Only `api-gateway` pods are allowed to initiate traffic to `user-service`, `order-service`, and `payment-service`.
     * Direct pod-to-pod communication between application services is blocked unless explicitly authorized (e.g., `order-service` calling `payment-service` to process a payment).
     * Only authorized database-accessing pods (e.g., `user-service` and `order-service`) can establish outbound connections to the Cloud SQL range.
5. **TLS Offloading**: Terminate TLS/SSL at the Google Cloud HTTPS Load Balancer or Ingress layer to reduce compute overhead on the Spring Boot pods. For strict internal requirements, deploy a Service Mesh (like Istio/ASM) to enforce mutual TLS (mTLS) between services.

## Observability & Key Monitoring Metrics

To ensure high availability and ease troubleshooting, monitor the following metrics categorized by architecture layer:

* **Load Balancer**: Total requests, HTTP 4xx/5xx error rates, frontend/backend latency, and active backend instances.
* **GKE Ingress**: Routing failures, TLS handshake exceptions, and target connection errors.
* **Spring Cloud Gateway**: Authentication check failures, dynamic routing latency, route-specific HTTP errors, and rate-limiting rejections.
* **Spring Boot Microservices**: Spring Boot Actuator metrics (JVM heap utilization, active threads, GC pauses, database pool usage) and application-level p95/p99 latency.
* **Kubernetes Node & Pod Health**: CPU/Memory utilization, pod restart counters, Horizontal Pod Autoscaler (HPA) triggers, and node scheduling pressure.
* **Database & Cache (Cloud SQL / Redis)**: Concurrent connections, slow queries, write/read IOPs, CPU load, Redis memory usage, and key eviction counts.
* **Messaging (Cloud Pub/Sub)**: Backlog size, oldest unacknowledged message age, publish/subscribe latency, and message error rates.

Always base your dashboards and alerts on the **Four Golden Signals**:
1. **Latency**: The time it takes to service a request.
2. **Traffic**: A measure of how much demand is being placed on your system (e.g., requests per second).
3. **Errors**: The rate of requests that fail.
4. **Saturation**: How "full" your service is (e.g., CPU, memory, thread pool exhaustion).

## Common Pitfalls in GKE Spring Cloud Deployments

1. **Exposing downstream services publicly**: Creating a Kubernetes `LoadBalancer` for internal services instead of utilizing internal `ClusterIP` and routing through the gateway.
2. **Overloading the Ingress Controller**: Trying to implement complex user authorization, response filtering, or path rewriting inside GKE Ingress yaml configs instead of delegating to Spring Cloud Gateway.
3. **Registry Redundancy**: Keeping Eureka running alongside Kubernetes CoreDNS, leading to split-brain situations, configuration overhead, and unnecessary resource usage.
4. **Addressing Pod IPs directly**: Relying on ephemeral pod IPs for inter-service communication instead of standard Kubernetes Service DNS names.
5. **No Network Isolation**: Leaving the GKE cluster open (flat network), allowing a compromised microservice to query databases or access other unrelated pods.
6. **Incomplete Kubernetes Probes**: Omitting `readinessProbe` and `livenessProbe` definitions in Deployment manifests, which can result in routing live traffic to starting or unhealthy pods.
7. **Ignoring Resource Requests and Limits**: Failing to configure `resources.requests` and `resources.limits` for JVM workloads, leading to unstable pod scheduling, out-of-memory (OOM) kills, and broken autoscaling.
8. **Broken Distributed Tracing**: Failing to propagate trace context (like W3C Trace Context or B3 headers) from Spring Cloud Gateway down to downstream microservices, rendering Cloud Trace useless.
9. **File-based Logging**: Writing log files into the container file system instead of outputting JSON-structured logs directly to `stdout`/`stderr` for Google Cloud Logging to ingest.

## Conclusion & Takeaways

An effective GKE network topology for Spring Cloud microservices successfully separates infrastructure concerns from application-level requirements. By following a structured traffic path (Cloud Load Balancer -> Ingress -> Spring Cloud Gateway -> Microservices), utilizing Kubernetes-native service discovery, locking down internal communication with Network Policies, and routing database traffic privately, you can achieve a highly secure, scalable, and observable cloud-native application.

## Related Notes

* [[Kubernetes]]
* [[cloud-native/Public Cloud Application Deployment and Monitoring|Public Cloud Application Deployment and Monitoring]]
* [[java-backend/Spring Cloud to Kubernetes Migration|Spring Cloud to Kubernetes Migration]]
* [[API Gateway]]
* [[Load Balancers]]
* [[Service Discovery]]
* [[observability/Monitor overview|Monitor overview]]
* [[observability/Structured Logging|Structured Logging]]
