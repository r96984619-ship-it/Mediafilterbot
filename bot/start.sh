#!/usr/bin/env bash
set -e

cd "$(dirname "$0")"

# Load .env if present (development convenience)
if [ -f ../.env ]; then
  export $(grep -v '^#' ../.env | xargs -d '\n')
fi

# Install dependencies if needed
pip install -q -r requirements.txt

exec python3 bot.py
