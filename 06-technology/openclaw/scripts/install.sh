#!/bin/bash
# Installs the specialist agents' brains + personas + identities into their
# OpenClaw workspaces. Leaves the live Nexus (main) agent UNTOUCHED.
# Supports both the historical flattened transfer folder and the structured
# Company OS repository layout.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../../.." && pwd)"
OPENCLAW="$HOME/.openclaw"
WS="$OPENCLAW/workspace"
TS="$(date +%Y%m%d-%H%M%S)"

if [ -f "$SCRIPT_DIR/BASE_AGENTS.md" ]; then
  # Backward-compatible flattened deployment folder.
  LAYOUT="flattened"
  SRC="$SCRIPT_DIR"
  SHARED_SRC="$SCRIPT_DIR/03-ai-workforce/shared"
  [ -d "$SHARED_SRC" ] || SHARED_SRC="$SCRIPT_DIR/shared"
  SKILLS_SRC="$SCRIPT_DIR/skills"
else
  # Structured repository deployment.
  LAYOUT="structured"
  SRC="$REPO_ROOT/03-ai-workforce"
  SHARED_SRC="$REPO_ROOT/03-ai-workforce/shared"
  SKILLS_SRC="$REPO_ROOT/06-technology/openclaw/skills"
fi

echo "Source folder: $SRC"
echo "Source layout: $LAYOUT"
echo "Shared source: $SHARED_SRC"
echo "Skills source: $SKILLS_SRC"
echo "OpenClaw dir:  $OPENCLAW"
echo

# Sanity check: required files present
if [ "$LAYOUT" = "flattened" ]; then
  for f in BASE_AGENTS.md \
           Ekko_AGENTS.md Ekko_SOUL.md Ekko_IDENTITY.md \
           Jayce_AGENTS.md Jayce_SOUL.md Jayce_IDENTITY.md \
           Viktor_AGENTS.md Viktor_SOUL.md Viktor_IDENTITY.md \
           Heimerdinger_AGENTS.md Heimerdinger_SOUL.md Heimerdinger_IDENTITY.md \
           Camille_AGENTS.md Camille_SOUL.md Camille_IDENTITY.md \
           Shen_AGENTS.md Shen_SOUL.md Shen_IDENTITY.md \
           Azir_AGENTS.md Azir_SOUL.md Azir_IDENTITY.md \
           Twisted_Fate_AGENTS.md Twisted_Fate_SOUL.md Twisted_Fate_IDENTITY.md; do
    if [ ! -f "$SRC/$f" ]; then
      echo "ERROR: missing $SRC/$f — make sure ALL files were transferred into this folder."
      exit 1
    fi
  done
else
  for f in shared/BASE_AGENTS.md \
           ekko/AGENTS.md ekko/SOUL.md ekko/IDENTITY.md \
           jayce/AGENTS.md jayce/SOUL.md jayce/IDENTITY.md \
           viktor/AGENTS.md viktor/SOUL.md viktor/IDENTITY.md \
           heimerdinger/AGENTS.md heimerdinger/SOUL.md heimerdinger/IDENTITY.md \
           camille/AGENTS.md camille/SOUL.md camille/IDENTITY.md \
           shen/AGENTS.md shen/SOUL.md shen/IDENTITY.md \
           azir/AGENTS.md azir/SOUL.md azir/IDENTITY.md \
           twisted-fate/AGENTS.md twisted-fate/SOUL.md twisted-fate/IDENTITY.md; do
    if [ ! -f "$SRC/$f" ]; then
      echo "ERROR: missing $SRC/$f — make sure ALL files were transferred into this folder."
      exit 1
    fi
  done
fi

if [ ! -d "$SHARED_SRC" ]; then
  echo "ERROR: missing shared workforce assets directory: $SHARED_SRC"
  exit 1
fi

if [ ! -d "$SKILLS_SRC" ]; then
  echo "ERROR: missing skills directory: $SKILLS_SRC"
  exit 1
fi

# Shared workforce assets. Preserve the Company OS source hierarchy so agents
# can reference deployed shared assets by the same path under ~/.openclaw.
SHARED_DEST="$OPENCLAW/03-ai-workforce/shared"
if [ -d "$SHARED_DEST" ]; then
  cp -R "$SHARED_DEST" "$SHARED_DEST.bak-$TS"
  echo "Backed up $SHARED_DEST -> shared.bak-$TS"
fi
rm -rf "$SHARED_DEST"
mkdir -p "$(dirname "$SHARED_DEST")"
cp -R "$SHARED_SRC" "$SHARED_DEST"
echo "Installed shared workforce assets -> $SHARED_DEST"

# Shared base (single source of truth) at ~/.openclaw/BASE_AGENTS.md
cp "$SHARED_SRC/BASE_AGENTS.md" "$OPENCLAW/BASE_AGENTS.md"
echo "Wrote $OPENCLAW/BASE_AGENTS.md"

install_agent() {
  local id="$1" Cap="$2"
  local agent_file soul_file identity_file
  if [ "$LAYOUT" = "flattened" ]; then
    agent_file="$SRC/${Cap}_AGENTS.md"
    soul_file="$SRC/${Cap}_SOUL.md"
    identity_file="$SRC/${Cap}_IDENTITY.md"
  else
    agent_file="$SRC/$id/AGENTS.md"
    soul_file="$SRC/$id/SOUL.md"
    identity_file="$SRC/$id/IDENTITY.md"
  fi
  # Each agent gets its OWN top-level workspace (isolated, like nasus) so it never
  # inherits Nexus's files on restart.
  local dir="$OPENCLAW/workspace-$id"
  mkdir -p "$dir"
  # Back up any existing files first
  for f in AGENTS.md SOUL.md IDENTITY.md; do
    [ -f "$dir/$f" ] && cp "$dir/$f" "$dir/$f.bak-$TS" && echo "  backed up $dir/$f -> $f.bak-$TS"
  done
  # AGENTS.md = shared base + the role brain
  { cat "$SHARED_SRC/BASE_AGENTS.md"; printf '\n\n---\n\n'; cat "$agent_file"; } > "$dir/AGENTS.md"
  cp "$soul_file"     "$dir/SOUL.md"
  cp "$identity_file" "$dir/IDENTITY.md"
  # Remove the OpenClaw first-run bootstrap so the agent never re-derives its
  # identity on restart (this is what made agents bleed into the god-agent).
  [ -f "$dir/BOOTSTRAP.md" ] && rm -f "$dir/BOOTSTRAP.md" && echo "  removed stray BOOTSTRAP.md"
  # Skills: copy this agent's skill folders (skills/<id>/<skill>/SKILL.md) into the
  # workspace so OpenClaw auto-loads them on restart. Back up the old skills dir first.
  local skills_extra=""
  if [ -d "$SKILLS_SRC/$id" ]; then
    [ -d "$dir/skills" ] && cp -R "$dir/skills" "$dir/skills.bak-$TS" && echo "  backed up $dir/skills -> skills.bak-$TS"
    mkdir -p "$dir/skills"
    cp -R "$SKILLS_SRC/$id/." "$dir/skills/"
    local n; n="$(find "$SKILLS_SRC/$id" -name SKILL.md | wc -l | tr -d ' ')"
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
install_agent shen          Shen
install_agent azir          Azir
install_agent twisted-fate  Twisted_Fate

echo
echo "Done. Nexus (main) was left untouched."
echo "Next: openclaw gateway restart"
