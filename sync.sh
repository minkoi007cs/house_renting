#!/usr/bin/env bash
# sync.sh — pre-flight manifest sync cho HouseRenting AgentUI.
#   bash sync.sh <AGENT_ID>         # copy producer/outputs → <AGENT_ID>/inputs/<PRODUCER>.md
#   bash sync.sh check <AGENT_ID>   # so version pin
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

producers_for() {
  case "$1" in
    BACKEND_AGENT)   echo "BOSS" ;;
    FRONTEND_AGENT)  echo "BOSS" ;;
    *) echo "" ;;
  esac
}
read_version() { awk '/^## Version/ { in_v=1; next } in_v && NF { print; exit }' "$1" 2>/dev/null || echo "MISSING"; }

cmd="${1:-}"
if [ "$cmd" = "check" ]; then
  shift; agent="${1:-}"; [ -n "$agent" ] || { echo "Usage: bash sync.sh check <AGENT_ID>"; exit 2; }
  echo "## Manifest drift — $agent  (valid: BOSS, BACKEND_AGENT, FRONTEND_AGENT)"
  for p in $(producers_for "$agent"); do
    pv=$(read_version "$ROOT/$p/outputs/manifest.md")
    cv=$(awk -v tag="- $p:" '$0 ~ "^" tag { print; exit }' "$ROOT/$agent/inputs/manifest.md" 2>/dev/null || echo "")
    echo "  producer $p: $pv  |  consumer pin: ${cv:-<unset>}"
  done
  exit 0
fi
agent="${1:-}"; [ -n "$agent" ] || { echo "Usage: bash sync.sh <AGENT_ID> | check <AGENT_ID>"; exit 2; }
producers=$(producers_for "$agent")
mkdir -p "$ROOT/$agent/inputs"; summary="$ROOT/$agent/inputs/manifest.md"; date_iso=$(date -u +%Y-%m-%d)
{
  echo "# Manifest — input for $agent"; echo
  echo "Auto-synced by \`bash sync.sh $agent\` on $date_iso (UTC)."; echo
  echo "## Pinned versions"
  if [ -z "$producers" ]; then echo "- (none — root/orchestrator agent)";
  else for p in $producers; do
      src="$ROOT/$p/outputs/manifest.md"; dst="$ROOT/$agent/inputs/$p.md"
      if [ -f "$src" ]; then cp "$src" "$dst"; echo "- $p: $(read_version "$src")  (copied → inputs/$p.md)";
      else echo "- $p: MISSING ($src not found)"; fi
    done; fi
  echo; echo "## Last sync"; echo "$date_iso by sync.sh"
} > "$summary"
echo "[sync] wrote $summary"
