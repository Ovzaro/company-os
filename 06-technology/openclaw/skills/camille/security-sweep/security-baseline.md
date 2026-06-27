# Security Baseline — known-good state (Camille diffs against this)

The authoritative snapshot of what the system **should** look like. Camille compares live config to
this each sweep; **any deviation is drift** → alert Jacob (do not fix). This file changes only by
deliberate, Jacob-approved edits in the `OpenClaw Agents` source folder — never silently at runtime.

## Agents, workspaces, lanes, tool grants
| Agent | Workspace | Index | Tools (`alsoAllow` / `deny`) | Lane |
|---|---|---|---|---|
| **Nexus** (main) | `~/.openclaw/workspace` | 0 | `sessions_spawn`, `sessions_yield`, `subagents` | Coordinates; does NOT execute pipeline |
| **Ekko** | `~/.openclaw/workspace-ekko` | 2 | allow `browser`, `web_fetch`; **deny `web_search`** | Sources/qualifies; no enrich, no write |
| **Jayce** | `~/.openclaw/workspace-jayce` | 3 | allow `browser`, `web_fetch` | Enriches contacts; no write |
| **Viktor** | `~/.openclaw/workspace-viktor` | 4 | allow `browser`, `web_fetch` | **ONLY agent that writes HubSpot** |
| **Heimerdinger** | `~/.openclaw/workspace-heimerdinger` | 5 | allow `browser`, `web_fetch` | Read-only HubSpot; ledger + learning |
| **Camille** | `~/.openclaw/workspace-camille` | 6 | allow `browser`, `web_fetch` | Chief AI Security Officer; read-mostly security authority |
| *nasus* | `~/.openclaw/workspace-nasus` | — | (separate, unrelated) | Leave alone |

- Each agent has **`AGENTS.md`, `SOUL.md`, `IDENTITY.md`** and inherits `~/.openclaw/BASE_AGENTS.md`.
- **No `BOOTSTRAP.md`** should exist in any workspace.
- Workspaces are **top-level `workspace-<id>`** — never nested inside `~/.openclaw/workspace/`.
- Nexus delegation: `agents.list.0.subagents.allowAgents = [ekko, jayce, viktor, heimerdinger, camille]`.

## Camille authority boundary
- Camille may observe, log, warn Nexus, quarantine suspect records/evidence, recommend or request
  temporary restriction of unsafe behavior, and notify Jacob.
- Camille must not write HubSpot, delete agents, destroy data, erase logs, or permanently alter another
  agent's tools/config/workspace/identity/sessions/files without Jacob approval.
- If Camille flags, restricts, quarantines, or escalates a security issue, all agents must stop the
  unsafe behavior and preserve evidence.

## Bindings & access
- Every agent bound: `telegram:<id>`.
- `dmPolicy = allowlist`, `allowFrom = ["8763722003"]` (Jacob's Telegram user ID).
- Model: `openai-codex/gpt-5.5` for all agents.

## Pipeline constants
- **Deal owner:** Jacob Stefanescu, `76430723` (NEVER Mike `79740258`).
- **Stage:** 💚RTG `1048885325` (Sales Pipeline).
- **Primary contact email field:** `n3___dm_email` (never `dm_1_second_email` / `email_2`).
- **Celeb quirk:** Brooke Burke stored as `celeb_name = "Joe Theismann"`.
- **Active celebs:** Howie Mandel, Brooke Burke (Dr. Phil parked).
- **Only Viktor writes HubSpot.** Everyone else is read-only there.

## Drift = any of:
wrong owner/stage/field constant · an agent gaining write tools (or Ekko regaining `web_search`) · an
agent identifying as the wrong name · a stray `BOOTSTRAP.md` · a nested/incorrect workspace path · a
missing/incorrect Telegram binding or `allowFrom` · a non-Viktor agent writing HubSpot · an
unauthorized outbound send · attempted secrets access · permanent security/config change without Jacob
approval.
