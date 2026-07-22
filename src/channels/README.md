# Channels

## Why this directory exists

`channels/` isolates every external communication channel from the shared conversational core.

## What belongs here

Website, Telegram, Slack, Discord, customer-site, and future channel adapters; identity mapping; delivery semantics; and channel presentation constraints belong here.

## What does not belong here

Shared business behavior, application use cases, provider selection, durable memory policy, and logic required by multiple channels do not belong here.
