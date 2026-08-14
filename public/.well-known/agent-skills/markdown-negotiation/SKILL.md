---
name: markdown-negotiation
description: Request clean, formatting-stripped markdown representations of the public pages instead of dense HTML.
---

# Markdown Negotiation

VIBHA School of Psychology serves clean markdown when a client requests it
via content negotiation. This makes the public pages directly readable by
AI agents.

## How to use

Send a GET request to the landing page with an Accept header that includes
`text/markdown`:

```
GET / HTTP/1.1
Host: vibhapsychology.com
Accept: text/markdown
```

The response is a markdown document summarising the school, the programme,
and the machine-readable endpoints. Browsers (which prefer HTML) are
unaffected.

## Other machine-readable endpoints

- `/.well-known/api-catalog` — RFC 9727 API catalog
- `/openapi.json` — OpenAPI 3.0 description
- `/.well-known/agent-card.json` — A2A agent card
- `/auth.md` — agent registration/auth document
