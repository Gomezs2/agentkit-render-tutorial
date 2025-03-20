```mermaid
sequenceDiagram
    participant Inngest Cloud
    participant API Route (/api/inngest)
    participant HackerNews Agent

    Inngest Cloud->>API Route (/api/inngest): Sends event (POST/GET/PUT)
    API Route (/api/inngest)->>HackerNews Agent: Triggers appropriate function
    HackerNews Agent->>API Route (/api/inngest): Returns result
    API Route (/api/inngest)->>Inngest Cloud: Responds with result
```