# Real-Time Communication - Intro

## Learning Objectives

- Evaluate the limitations of stateless HTTP for event-driven architectures.
- Implement short polling and calculate its overhead in wasted bandwidth and server load.
- Implement long polling to eliminate empty responses and identify its scaling bottlenecks.
- Establish persistent, unidirectional data streams using Server-Sent Events (SSE).
- Manage connection lifecycles and implement resource cleanup to prevent memory leaks.
- Select the optimal real-time technique based on specific data velocity and infrastructure constraints.

## Overview

The web was initially engineered for document retrieval. A client requests a file, the server returns it, and the connection drops. This stateless, pull-based architecture is the foundation of REST. It scales efficiently because servers do not need to maintain memory of previous interactions; every request contains all the context needed to process it.

This architecture fractures when an application becomes event-driven. If a background worker finishes rendering a video, a payment clears, or a user receives a direct message, the server acts as the source of truth for the new state. Because standard HTTP is strictly pull-based, the server has no mechanism to initiate contact and push this data. It must wait in silence until the client decides to ask again.

Engineering a solution to this limitation requires forcing a fundamentally stateless, client-driven protocol to behave reactively. If the server cannot dial out, the client and server must coordinate to either simulate a push mechanism or manipulate request lifecycles to keep a line of communication open.

This module explores three progressive architectural patterns to bridge this gap. We will start with the most brute-force adaptation of standard HTTP, analyze its severe scaling and latency costs, and iteratively optimize the approach. Finally, we will implement a persistent, unidirectional data stream to handle continuous server updates natively. Analyzing these steps will give you the framework to evaluate latency, server overhead, and implementation complexity when designing real-time features.
