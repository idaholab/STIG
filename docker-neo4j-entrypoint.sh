#!/bin/bash
set -e

DUMP_FILE="/data/neo4j.dump"
IMPORT_MARKER="/data/.dump-imported"

# If a dump file exists and hasn't been imported yet, load it
if [ -f "$DUMP_FILE" ] && [ ! -f "$IMPORT_MARKER" ]; then
  echo "=== Found $DUMP_FILE — importing into neo4j database ==="

  # neo4j-admin needs the database to not exist or use --overwrite
  # Remove existing database files if any
  rm -rf /data/databases/neo4j /data/transactions/neo4j

  neo4j-admin database load neo4j --from-stdin --overwrite-destination=true < "$DUMP_FILE"

  # Mark as imported so we don't re-import on every restart
  touch "$IMPORT_MARKER"
  echo "=== Dump imported successfully ==="
fi

# Hand off to the official Neo4j entrypoint
exec /startup/docker-entrypoint.sh neo4j
