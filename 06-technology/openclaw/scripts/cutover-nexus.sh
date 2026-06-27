#!/bin/bash
# Cuts Nexus (main) over to "broad assistant + lead-gen COO":
# keeps its entire self/assistant/SnapFund/backup layer, and replaces the embedded
# lead-gen EXECUTION programs with the orchestration (delegate-to-specialists) program.
# Only touches main's AGENTS.md. Fully reversible via the timestamped backup.
set -euo pipefail

SRC="$(cd "$(dirname "$0")" && pwd)"
WS="$HOME/.openclaw/workspace"
AGENTS="$WS/AGENTS.md"
ORCH="$SRC/Nexus_Orchestration.md"
TS="$(date +%Y%m%d-%H%M%S)"

[ -f "$AGENTS" ] || { echo "ERROR: $AGENTS not found"; exit 1; }
[ -f "$ORCH" ]   || { echo "ERROR: $ORCH not found (transfer the whole folder)"; exit 1; }

# Safety: confirm the markers we rely on actually exist before editing.
grep -q '^## Program: HubSpot Lead-Gen' "$AGENTS" \
  || { echo "ERROR: '## Program: HubSpot Lead-Gen' not found in AGENTS.md — aborting (no change made)"; exit 1; }
grep -q '^## Program: Daily Workspace Backup' "$AGENTS" \
  || { echo "ERROR: '## Program: Daily Workspace Backup' not found in AGENTS.md — aborting (no change made)"; exit 1; }

# Back up the current (god-agent) brain.
cp "$AGENTS" "$AGENTS.godagent-bak-$TS"
echo "Backed up god-agent brain -> AGENTS.md.godagent-bak-$TS"

# Rebuild AGENTS.md: everything as-is, EXCEPT replace the block from the
# 'HubSpot Lead-Gen' program through (but not including) the 'Daily Workspace Backup'
# program with the orchestration program.
awk -v orchfile="$ORCH" '
  BEGIN { orch=""; while ((getline l < orchfile) > 0) orch = orch l "\n" }
  /^## Program: HubSpot Lead-Gen/ { printf "%s\n", orch; skip=1; next }
  /^## Program: Daily Workspace Backup/ { skip=0 }
  skip != 1 { print }
' "$AGENTS.godagent-bak-$TS" > "$AGENTS"

echo "Done. Nexus is now broad-assistant + lead-gen COO."
echo "  - kept: self/assistant layer, SnapFund, memory, heartbeats, backups, SOUL/IDENTITY/MEMORY/USER"
echo "  - swapped: lead-gen execution  ->  lead-gen orchestration (delegates to the team)"
echo "Next: openclaw gateway restart"
