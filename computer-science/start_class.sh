#!/usr/bin/env bash
# Serve the Class XII Computer Science presentation decks for use in class.
# Usage: ./start_class.sh

set -euo pipefail

PORT=8113
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

cd "$DIR"

# Only guard interactively. Under a process manager (pm2, systemd) stdout is not a
# TTY, and exiting non-zero here would cause an endless restart loop.
if [ -t 1 ] && lsof -i :"$PORT" >/dev/null 2>&1; then
  echo "Port $PORT is already in use. Stop the existing server first:"
  echo "  lsof -ti :$PORT | xargs kill"
  echo "Or, if it is running under pm2:  pm2 stop cs-deck"
  exit 1
fi

echo "Serving $DIR"
echo
echo "  Course home   →  http://localhost:$PORT/"
echo
echo "In class:  →/Space next   ← back   m menu   f fullscreen"
echo "Press Ctrl+C to stop."
echo

exec python3 -m http.server "$PORT" --bind 0.0.0.0
