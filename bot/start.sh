#!/usr/bin/env bash
set -e

cd "$(dirname "$0")"

# Load .env if present (development convenience — POSIX-safe)
if [ -f ../.env ]; then
  while IFS= read -r line || [ -n "$line" ]; do
    case "$line" in
      ''|\#*) continue ;;
    esac
    export "$line"
  done < ../.env
fi

# Install dependencies
pip install -q -r requirements.txt

# Validate environment variables before launching
python3 validate_env.py

exec python3 bot.py
