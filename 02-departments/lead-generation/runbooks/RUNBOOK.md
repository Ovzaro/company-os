# TRNDY Lead-Gen Multi-Agent System — Runbook

The operating manual for the OpenClaw agent team running on the Mac mini. Read the **Gotchas**
section before adding or changing any agent — it's the hard-won stuff that's expensive to relearn.

---

## 1. The team

| Agent | Emoji | Role | Workspace |
|---|---|---|---|
| **Nexus** | 🐘 | Broad everyday assistant **+ Lead Generation Division COO**: coordinates the lead-gen team, removes bottlenecks, protects quality, and reports to you. Also handles general tasks + SnapFund. | `~/.openclaw/workspace` (this is `main`) |
| **Ekko** | ⏪ | Director of Opportunity Discovery: finds legitimate DTC businesses with real potential, decides the category mix, and picks the celeb. | `~/.openclaw/workspace-ekko` |
| **Jayce** | 🔨 | Director of Contact Intelligence: identifies the true decision maker/economic buyer and best verified contact path via RocketReach. | `~/.openclaw/workspace-jayce` |
| **Viktor** | ⚙️ | Director of CRM Integrity: early de-dupe, final validation, and HubSpot creation. **Only agent that writes HubSpot.** | `~/.openclaw/workspace-viktor` |
| **Heimerdinger** | 🔬 | Intelligence Department: transforms recent activity, pipeline movement, and company history into recommendations; keeps the Excel ledger. | `~/.openclaw/workspace-heimerdinger` |
| **Camille** | 🛡️ | Chief AI Security Officer: watches for injection, exfiltration, unsafe outbound behavior, unauthorized tool use, role drift, and corruption; warns Nexus, quarantines, and escalates with evidence. | `~/.openclaw/workspace-camille` |
| *nasus* | 🐶 | Separate, unrelated agent — leave alone. | `~/.openclaw/workspace-nasus` |

Each agent has three files in its workspace: **`AGENTS.md`** (its job), **`SOUL.md`** (its persona),
**`IDENTITY.md`** (its name/emoji). All inherit **`~/.openclaw/BASE_AGENTS.md`** (shared rules).

---

## 2. How it works

You talk to **Nexus**. Nexus is the **Lead Generation Division COO**: he keeps the lead-gen operating
system moving, optimizes for sales-ready opportunities, anticipates bottlenecks, and uses
Heimerdinger's intelligence to improve future batches. He runs the team by spawning specialists as
**sub-agents** (`sessions_spawn` → `agentId`), waiting for each to **announce** its result back
(`sessions_yield`), verifying, and moving to the next step. Specialists hand data through a **shared
run sheet** file, not through chat. Nexus synthesizes the results into one update to you; the
specialists never message you directly during a run.

**Pipeline (batch-staged, writes drip-fed last):**
1. You give Nexus a batch goal (size + any one-off note).
2. **Heimerdinger** produces Operational Intelligence from last-24h activity → tells **Nexus** and
   **Ekko** what's entering the system and what current signals matter.
3. **Ekko** discovers N qualified opportunities (website, category, celeb, source channel) that
   deserve Sales' time.
4. **Viktor** runs early HubSpot de-dupe; drops matches before enrichment.
5. **Jayce** enriches the survivors (primary decision maker/economic buyer, secondary contacts, and verified contact paths).
6. **Nexus assembles the batch and shows you for approval — nothing is written until you say yes.**
7. On approval, **Viktor** runs final validation + de-dupe, then writes the approved leads one at a
   time at **random 5–15 min intervals**, re-running the full de-dupe right before each create.
8. **Heimerdinger** logs each created lead to the Excel ledger and converts results into Operational,
   Performance, and Strategic Intelligence.
9. **Camille** watches throughout; on a security issue she acts proportionally — observe, log, warn
   Nexus, quarantine suspect records/evidence, recommend temporary restriction, or alert you. She
   never deletes agents, destroys data, writes HubSpot, or permanently changes another agent without
   your approval.
10. **Nexus** completes a Daily Operations Review: what moved forward, what slowed down, what was
    learned, tomorrow's highest-impact improvement, and whether Sales will have what it needs.

To run a batch, message Nexus something like: *"Run a batch of 15 — Health & Wellness focus."*
For a no-risk dry run: *"…stop at the approval gate, no HubSpot writes."*

---

## 3. Key constants (don't lose these)

- **Deal owner:** always Jacob Stefanescu, owner ID **`76430723`** (never Mike `79740258`).
- **Stage:** all new leads → **💚RTG `1048885325`** in "Sales Pipeline."
- **Primary contact email field:** `n3___dm_email` (NOT `dm_1_second_email`, NOT `email_2`).
- **Celeb value quirk:** Brooke Burke is stored as `celeb_name = "Joe Theismann"`.
- **Celebs:** Howie Mandel and Brooke Burke (Dr. Phil parked — not in current rotation). Honor the per-celeb No-Go lists in Ekko's brain.
- **De-dupe = 3 checks** (Master Lead Check by website, by company name, global email search) —
  Viktor's job, run early *and* immediately before writing.
- **Your Telegram user ID:** `8763722003` (used for bot allowlists).
- **Model:** all agents on `openai-codex/gpt-5.5` (OAuth via `openclaw configure`).
- **Access is browser-based** (Chrome), no API keys: the shared `openclaw` Chrome profile is logged
  into HubSpot + RocketReach. Read/write separation (only Viktor writes) is enforced by instructions.

---

## 4. ⚠️ Gotchas — read before touching any agent

These are the bugs that cost a full day. Every one is now baked into `install.sh` and the checklist
below, but know *why*:

1. **Bindings are mandatory.** A bot with no routing binding falls through to the **default agent
   (`main`/Nexus)** — so messages to it get answered by Nexus, looking like an "identity bleed." Every
   agent needs `openclaw agents bind --agent <id> --bind telegram:<id>`. Symptom: an agent answers as
   Nexus / another agent. Check `openclaw agents list --bindings`.
2. **Isolated workspaces, never nested.** A workspace *inside* `~/.openclaw/workspace/<id>` inherits
   Nexus's files on restart. Always use a **top-level** `~/.openclaw/workspace-<id>`. (At
   `openclaw agents add`, change the default workspace path to `workspace-<id>`.)
3. **Delete `BOOTSTRAP.md`.** OpenClaw drops a "figure out who you are" bootstrap into new workspaces;
   if it isn't removed, the agent re-derives (and loses) its identity on every restart. `install.sh`
   now removes it automatically.
4. **Set an explicit identity.** `openclaw agents set-identity --agent <id> --name "<Name>"` writes a
   config identity block so the agent can't drift.
5. **Auth is global OAuth.** New agents get "Missing API key for provider openai-codex" until the
   provider is signed in via `openclaw configure` (Model → OpenAI Codex → Browser Login). That's a
   one-time global setup — already done.
6. **Persona files can get corrupted.** If an agent's `SOUL.md`/`USER.md`/`MEMORY.md` get rewritten
   (e.g. a bootstrap conversation), restore from the daily backup (Section 6).

---

## 5. Adding a new agent — checklist

1. Create its BotFather bot, copy the token.
2. `openclaw agents add <id>` — **set workspace to `~/.openclaw/workspace-<id>`** (not nested);
   No to copy-auth; No to model/auth; Yes to channels → Telegram → add account `<id>` + token;
   No to DM policy; **Yes to bindings**.
3. Add the agent's `<Name>_AGENTS.md` / `_SOUL.md` / `_IDENTITY.md` to the OpenClaw Agents folder and
   add `install_agent <id> <Name>` + its files to `install.sh`.
4. Transfer the folder to the mini, run `bash install.sh` (it concatenates BASE+role, removes
   BOOTSTRAP.md).
5. `openclaw agents set-identity --agent <id> --name "<Name>" --theme "<role>"`
6. Lock the bot to you:
   `openclaw config set channels.telegram.accounts.<id>.dmPolicy allowlist`
   `openclaw config set channels.telegram.accounts.<id>.allowFrom '["8763722003"]'`
7. If Nexus should delegate to it: add `<id>` to `agents.list.0.subagents.allowAgents`.
8. `openclaw gateway restart`, then DM the agent "who are you?" to confirm.

---

## 6. Maintenance

- **Backups:** daily `tar.gz` of `~/.openclaw` in iCloud → `NexusBackups/` (keeps ~30; runs ~3 AM).
  Manual: `bash ~/.openclaw/backup-openclaw.sh`.
- **Restore a file from backup** (example — Nexus's persona):
  ```
  tar -xzf ~/Library/Mobile\ Documents/com~apple~CloudDocs/NexusBackups/openclaw-backup-<date>.tar.gz \
    -C ~ .openclaw/workspace/SOUL.md .openclaw/workspace/MEMORY.md
  ```
- **Session cleanup:** `openclaw sessions cleanup` (prunes stale/corrupted sessions).
- **Health / quick fixes:** `openclaw doctor` / `openclaw doctor --fix`.
- **Logs:** `tail -f "$(ls -t /tmp/openclaw/*.log | head -1)"` — session keys like
  `agent:<id>:telegram:...` tell you *which* agent actually handled a message (how we found the
  routing bug).
- **Restart after any config change:** `openclaw gateway restart`.

---

## 7. Delegation config (already applied to `main`/Nexus)

- `agents.list.0.subagents.allowAgents = ["ekko","jayce","viktor","heimerdinger","camille"]` (lets
  Nexus spawn Camille for security audits).
- `agents.list.0.tools.alsoAllow = ["sessions_spawn","sessions_yield","subagents"]`.
- Nexus's `AGENTS.md` has the **TRNDY Lead-Gen Orchestration v2** program (Lead Generation COO; it
  delegates, verifies, improves, and reports; it does not execute specialist work). Its lead-gen
  *execution* programs were removed; everything else (assistant, SnapFund,
  memory, heartbeats, backups) was kept.

---

## 7b. Browser & tool access per agent (applied)

All agents drive the **same shared `openclaw` Chrome profile** (the orange one), logged into Google,
HubSpot, and RocketReach. **One login serves every agent** — you don't log in per agent. Read/write
separation (only Viktor *writes* HubSpot) is enforced by instructions, not by separate accounts. The
browser can't be driven by two agents at the *exact* same instant, but the pipeline runs sequentially
so that's a non-issue (true parallel browsing would need a separate Chrome profile per agent).

Per-agent grants in `openclaw.json` (`agents.list[<i>].tools`):

| Agent | Index | `alsoAllow` | `deny` | Why |
|---|---|---|---|---|
| Nexus (main) | 0 | `sessions_spawn`, `sessions_yield`, `subagents` | — | Delegation tools |
| Ekko | 2 | `browser`, `web_fetch` | `web_search` | Forces discovery through **live Google in Chrome**, not search APIs or memory |
| Jayce | 3 | `browser`, `web_fetch` | — | RocketReach / LinkedIn / brand sites |
| Viktor | 4 | `browser`, `web_fetch` | — | Drives HubSpot |
| Heimerdinger | 5 | `browser`, `web_fetch` | — | Reads HubSpot (the 24h study) |
| Camille | 6 | `browser`, `web_fetch` | — | Security sweeps, evidence review, audits |

To change: `openclaw config set agents.list.<i>.tools.alsoAllow '["browser","web_fetch"]'`, then
`openclaw gateway restart`. **Gotcha:** zsh does *not* treat `#` as a comment interactively — never
paste a `config set` line with a trailing `# label`, or it errors with "too many arguments."

---

## 8. Quick troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| Agent answers as Nexus / wrong name | missing binding | `openclaw agents bind --agent <id> --bind telegram:<id>` |
| All agents bleed into one after restart | nested workspace and/or stray `BOOTSTRAP.md` | move to `workspace-<id>`; delete `BOOTSTRAP.md`; restart |
| "Missing API key for provider openai-codex" | agent has no model auth | `openclaw configure` → Model → OpenAI Codex → Browser Login |
| Agent persona reads wrong (e.g. "Viktor") | corrupted `SOUL/USER/MEMORY.md` | restore those files from a pre-corruption backup |
| Bot answers strangers | no DM allowlist | set `dmPolicy: allowlist` + `allowFrom: ["8763722003"]` |
| Nexus does the work itself instead of delegating | god-agent brain still installed | confirm Nexus's `AGENTS.md` has the Orchestration program (`grep "Orchestration" ~/.openclaw/workspace/AGENTS.md`) |
