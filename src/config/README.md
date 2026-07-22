# Config

## Why this directory exists

`config/` provides a single validated representation of runtime configuration and feature composition.

## What belongs here

Configuration schemas, parsing, validation, defaults, and typed configuration contracts belong here.

## What does not belong here

Secrets, scattered environment-variable reads, business policy, mutable runtime state, and vendor clients do not belong here.
