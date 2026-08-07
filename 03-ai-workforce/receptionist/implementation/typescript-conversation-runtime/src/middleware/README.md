# Middleware

## Why this directory exists

`middleware/` holds composable processing that applies consistently across requests or interaction pipelines.

## What belongs here

Correlation, authentication context, authorization enforcement, rate limits, tracing, and safe error-boundary middleware belong here.

## What does not belong here

Hidden business workflows, channel-specific behavior, provider orchestration, domain models, and persistence logic do not belong here.
