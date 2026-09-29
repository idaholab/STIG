import { Router, Request, Response } from 'express';
import { Neo4jDB, DBProfile, StixObject, StixRelationshipObject } from './neo4j.js';

export const apiRouter = Router();

// One DB instance per server (single-tenant). For multi-tenant, use a map keyed by session.
export const db = new Neo4jDB();

// Whether the current connection was established by the server's own
// NEO4J_AUTOCONNECT startup logic, as opposed to a manual /connect call
// (from this browser tab or another one -- the DB instance above is shared
// across all clients). Any manual connect/disconnect clears it, since the
// connection is no longer purely the env-driven one.
let autoConnected = false;
export function setAutoConnected(value: boolean): void {
  autoConnected = value;
}

// Stencil type lookup — the client sends this with updateDB requests
// since StencilItems is a UI concern. We accept it as part of the payload.

// --- Health check ---
apiRouter.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    dbConnected: !db.isClosed(),
    autoConnected: !db.isClosed() && autoConnected,
    databaseName: db.getDatabaseName(),
  });
});

// --- Connect to Neo4j ---
apiRouter.post('/connect', async (req: Request, res: Response) => {
  try {
    const config: DBProfile = req.body;
    console.log('Connect request:', JSON.stringify(config, null, 2));
    // Ensure Host has a scheme
    if (config.Host && !config.Host.includes('://')) {
      config.Host = `bolt://${config.Host}`;
    }
    await db.connect(config);
    setAutoConnected(false);
    res.json({ success: true });
  } catch (error: any) {
    console.error('Connect error:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// --- Disconnect ---
apiRouter.post('/disconnect', async (_req: Request, res: Response) => {
  try {
    await db.close();
    setAutoConnected(false);
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// --- Execute Cypher query ---
apiRouter.post('/query', async (req: Request, res: Response) => {
  try {
    const { query } = req.body as { query: string };
    if (!query || typeof query !== 'string') {
      res.status(400).json({ error: 'query is required' });
      return;
    }
    const results = await db.executeQuery(query);
    res.json({ results });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// --- Commit (update nodes and edges) ---
apiRouter.put('/nodes', async (req: Request, res: Response) => {
  try {
    const { nodes, edges, stencilTypes } = req.body as {
      nodes: StixObject[];
      edges: StixRelationshipObject[];
      stencilTypes: Record<string, string>; // type -> "sdo" | "sco" | "sro"
    };
    const lookup = (type: string) => stencilTypes?.[type];
    const result = await db.updateDB(nodes || [], edges || [], lookup);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// --- Delete nodes/edges ---
apiRouter.post('/delete', async (req: Request, res: Response) => {
  try {
    const { stix } = req.body as { stix: StixObject[] };
    const result = await db.delete(stix || []);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// --- Traverse incoming ---
apiRouter.get('/nodes/:id/in', async (req: Request, res: Response) => {
  try {
    const results = await db.traverseNodeIn(req.params.id);
    res.json({ results });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// --- Traverse outgoing ---
apiRouter.get('/nodes/:id/out', async (req: Request, res: Response) => {
  try {
    const results = await db.traverseNodeOut(req.params.id);
    res.json({ results });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// --- Get diff ---
apiRouter.post('/diff', async (req: Request, res: Response) => {
  try {
    const { nodes, edges } = req.body as {
      nodes: StixObject[];
      edges: StixRelationshipObject[];
    };
    const results = await db.getDiff(nodes || [], edges || []);
    res.json({ results });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});
