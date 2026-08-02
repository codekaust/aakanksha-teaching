#!/usr/bin/env bash
# Serve the Class XII Economics presentation decks for use in class.
# Usage: ./start_class.sh

set -euo pipefail

PORT=8111
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

cd "$DIR"

# Only guard interactively. Under a process manager (pm2, systemd) stdout is not a
# TTY, and exiting non-zero here would cause an endless restart loop.
if [ -t 1 ] && lsof -i :"$PORT" >/dev/null 2>&1; then
  echo "Port $PORT is already in use. Stop the existing server first:"
  echo "  lsof -ti :$PORT | xargs kill"
  echo "Or, if it is running under pm2:  pm2 stop economics-deck (the pm2 process name is unchanged)"
  exit 1
fi

echo "Serving $DIR"
echo
echo "  Course home   →  http://localhost:$PORT/"
echo "  Chapter 1     →  http://localhost:$PORT/chapter-1-introduction.html"
echo "  Chapter 2     →  http://localhost:$PORT/chapter-2-consumer-behaviour.html"
echo "  Chapter 3     →  http://localhost:$PORT/chapter-3-production-and-costs.html"
echo "  Chapter 4     →  http://localhost:$PORT/chapter-4-firm-perfect-competition.html"
echo "  Chapter 5     →  http://localhost:$PORT/chapter-5-market-equilibrium.html"
echo
echo "In class:  →/Space next   ← back   m menu   f fullscreen"
echo "Press Ctrl+C to stop."
echo

exec python3 -m http.server "$PORT" --bind 0.0.0.0
