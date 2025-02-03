# Structured Threat Intelligence Graph (STIG)

Structured Threat Intelligence Graph (STIG) is a tool for creating, editing, querying, analyzing and visualizing threat intelligence. It uses STIX version 2 as its data format. STIG uses a graph database (Neo4j) to store the data.


For more information on STIX, see the **[STIX 2.1 specification](https://oasis-open.github.io/cti-documentation/resources)**, the **[introduction](https://oasis-open.github.io/cti-documentation/stix/intro.html)**, and the **[walkthrough](https://oasis-open.github.io/cti-documentation/stix/walkthrough.html)**.

**For installation and usage instructions, see our [documentation](https://stig.readthedocs.io/en/latest/).**

## Quickstart:
STIG can be run from a docker container and built from source using npm.

1) Clone this repository
2) `cd` into this repository

**Using Docker:**

3) Install Docker and docker-compose
4) Run `docker-compose up -d`

**Or Using NPM:**

3) Ensure you have Node.js and npm installed: https://nodejs.org/en/download/package-manager
4) Run `npm i && npm run dev`

**Finally:**

5) Open http://localhost:5173/ in a web browser
