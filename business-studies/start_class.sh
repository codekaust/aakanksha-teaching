#!/usr/bin/env bash
# Serve the Class XII Business Studies presentation decks for use in class.
# Usage: ./start_class.sh

set -euo pipefail

PORT=8114
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

cd "$DIR"

# Only guard interactively. Under a process manager (pm2, systemd) stdout is not a
# TTY, and exiting non-zero here would cause an endless restart loop.
if [ -t 1 ] && lsof -i :"$PORT" >/dev/null 2>&1; then
  echo "Port $PORT is already in use. Stop the existing server first:"
  echo "  lsof -ti :$PORT | xargs kill"
  echo "Or, if it is running under pm2:  pm2 stop bst-deck"
  exit 1
fi

echo "Serving $DIR"
echo
echo "  Course home    →  http://localhost:$PORT/"
echo "  Part 1 (A)     →  http://localhost:$PORT/part-1.html"
echo "  Part 2 (B)     →  http://localhost:$PORT/part-2.html"
echo
echo "  Part A · Principles and Functions of Management — 50 marks"
echo "    Chapter 1   →  http://localhost:$PORT/chapter-1-nature-of-management.html"
echo "    Chapter 2   →  http://localhost:$PORT/chapter-2-principles-of-management.html"
echo "    Chapter 3   →  http://localhost:$PORT/chapter-3-business-environment.html"
echo "    Chapter 4   →  http://localhost:$PORT/chapter-4-planning.html"
echo "    Chapter 5   →  http://localhost:$PORT/chapter-5-organising.html"
echo "    Chapter 6   →  http://localhost:$PORT/chapter-6-staffing.html"
echo "    Chapter 7   →  http://localhost:$PORT/chapter-7-directing.html"
echo "    Chapter 8   →  http://localhost:$PORT/chapter-8-controlling.html"
echo
echo "  Part B · Business Finance and Marketing — 30 marks"
echo "    Chapter 9   →  http://localhost:$PORT/chapter-9-financial-management.html"
echo "    Chapter 10  →  http://localhost:$PORT/chapter-10-financial-markets.html"
echo "    Chapter 11  →  http://localhost:$PORT/chapter-11-marketing.html"
echo "    Chapter 12  →  http://localhost:$PORT/chapter-12-consumer-protection.html"
echo
echo "In class:  →/Space next   ← back   m menu   f fullscreen"
echo "Press Ctrl+C to stop."
echo

exec python3 -m http.server "$PORT" --bind 0.0.0.0
