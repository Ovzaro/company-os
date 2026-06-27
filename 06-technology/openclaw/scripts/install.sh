#!/bin/bash
# Installs the four specialist agents' brains + personas + identities into their
# OpenClaw workspaces. Leaves the live Nexus (main) agent UNTOUCHED.
# Run this ON THE MAC MINI from the folder that holds all the *_AGENTS.md files.
set -euo pipefail

SRC="$(cd "$(dirname "$0")" && pwd)"
OPENCLAW="$HOME/.openclaw"
WS="$OPENCLAW/workspace"
TS="$(date +%Y%m%d-%H%M%S)"

echo "Source folder: $SRC"
echo "OpenClaw dir:  $OPENCLAW"
echo

# Sanity check: required files present
for f in BASE_AGENTS.md \
         Ekko_AGENTS.md Ekko_SOUL.md Ekko_IDENTITY.md \
         Jayce_AGENTS.md Jayce_SOUL.md Jayce_IDENTITY.md \
         Viktor_AGENTS.md Viktor_SOUL.md Viktor_IDENTITY.md \
         Heimerdinger_AGENTS.md Heimerdinger_SOUL.md Heimerdinger_IDENTITY.md \
         Camille_AGENTS.md Camille_SOUL.md Camille_IDENTITY.md; do
  if [ ! -f "$SRC/$f" ]; then
    echo "ERROR: missing $SRC/$f — make sure ALL files were transferred into this folder."
    exit 1
  fi
done

# Shared base (single source of truth) at ~/.openclaw/BASE_AGENTS.md
cp "$SRC/BASE_AGENTS.md" "$OPENCLAW/BASE_AGENTS.md"
echo "Wrote $OPENCLAW/BASE_AGENTS.md"

install_agent() {
  local id="$1" Cap="$2"
  # Each agent gets its OWN top-level workspace (isolated, like nasus) so it never
  # inherits Nexus's files on restart.
  local dir="$OPENCLAW/workspace-$id"
  mkdir -p "$dir"
  # Back up any existing files first
  for f in AGENTS.md SOUL.md IDENTITY.md; do
    [ -f "$dir/$f" ] && cp "$dir/$f" "$dir/$f.bak-$TS" && echo "  backed up $dir/$f -> $f.bak-$TS"
  done
  # AGENTS.md = shared base + the role brain
  { cat "$SRC/BASE_AGENTS.md"; printf '\n\n---\n\n'; cat "$SRC/${Cap}_AGENTS.md"; } > "$dir/AGENTS.md"
  cp "$SRC/${Cap}_SOUL.md"     "$dir/SOUL.md"
  cp "$SRC/${Cap}_IDENTITY.md" "$dir/IDENTITY.md"
  # Remove the OpenClaw first-run bootstrap so the agent never re-derives its
  # identity on restart (this is what made agents bleed into the god-agent).
  [ -f "$dir/BOOTSTRAP.md" ] && rm -f "$dir/BOOTSTRAP.md" && echo "  removed stray BOOTSTRAP.md"
  # Skills: copy this agent's skill folders (skills/<id>/<skill>/SKILL.md) into the
  # workspace so OpenClaw auto-loads them on restart. Back up the old skills dir first.
  local skills_extra=""
  if [ -d "$SRC/skills/$id" ]; then
    [ -d "$dir/skills" ] && cp -R "$dir/skills" "$dir/skills.bak-$TS" && echo "  backed up $dir/skills -> skills.bak-$TS"
    mkdir -p "$dir/skills"
    cp -R "$SRC/skills/$id/." "$dir/skills/"
    local n; n="$(find "$SRC/skills/$id" -name SKILL.md | wc -l | tr -d ' ')"
    echo "  installed $n skill(s) -> $dir/skills/"
    skills_extra=", skills"
  fi
  echo "Installed $Cap -> $dir (AGENTS.md, SOUL.md, IDENTITY.md$skills_extra)"
}

install_agent ekko          Ekko
install_agent jayce         Jayce
install_agent viktor        Viktor
install_agent heimerdinger  Heimerdinger
install_agent camille       Camille

echo
echo "Done. Nexus (main) was left untouched."
echo "Next: openclaw gateway restart"
