# AI Workforce Engineering Standard

Company OS owns every artificial-intelligence employee. Each employee has one canonical directory
under `03-ai-workforce/`, and every future employee follows this standard.

## Required employee definition

Every employee directory must contain:

- `AGENTS.md` — operating instructions, responsibilities, authority, and safety boundaries.
- `IDENTITY.md` — role, organizational position, mission, and ownership.
- `SOUL.md` — voice, temperament, values, and interaction style.

The employee definition and its software implementation are separate concepts.

## Optional directories

An employee may contain these directories when it has meaningful content for them:

- `knowledge/` — employee-specific approved facts, policies, and operating knowledge.
- `prompts/` — maintained prompt assets that are distinct from the employee definition.
- `skills/` — installable or reusable employee capabilities.
- `memory/` — curated source-controlled memory only; never live runtime state.
- `docs/` — architecture, decisions, runbooks, and historical documentation.
- `implementation/` — executable software and implementation-specific files.

This list defines the maximum standard structure, not a directory-creation checklist. Do not create
empty directories, `.gitkeep` files, or placeholder documents merely to satisfy the template. Create
an optional directory only in the same change that adds meaningful content.

## Implementation boundary

Executable code belongs under `implementation/`, including its source, tests, scripts, package
metadata, build configuration, and implementation documentation. An implementation must not contain
a nested `.git` directory.

Generated dependencies, build output, caches, logs, credentials, secret-bearing environment files,
live sessions, and live memory are not Company OS source content and must not be committed.

## Runtime boundary

OpenClaw runtime state remains outside this repository under `~/.openclaw`. Source-controlled
`memory/` content must be deliberately curated and must never be confused with OpenClaw's live
workspace memory, sessions, logs, credentials, queues, or browser state.

Shared company knowledge belongs in the canonical Company OS knowledge area. Employee directories
contain only knowledge specific to that employee's role and behavior.
