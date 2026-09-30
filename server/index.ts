import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { apiRouter, db, setAutoConnected } from './routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);

app.use(express.json({ limit: '10mb' }));

// API routes
app.use('/api', apiRouter);

// Serve the built React SPA in production only
if (process.env.NODE_ENV === 'production') {
  const staticDir = path.resolve(__dirname, '../dist');
  app.use('/stig', express.static(staticDir));
  app.get('/stig/*', (_req, res) => {
    res.sendFile(path.join(staticDir, 'index.html'));
  });
  app.get('/', (_req, res) => {
    res.redirect('/stig');
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`STIG API server listening on port ${PORT}`);

  // Auto-connect to Neo4j only if explicitly opted into via NEO4J_AUTOCONNECT.
  // Deployments that set NEO4J_HOST/USER/PASSWORD for other reasons but still
  // want users to connect manually through the UI should leave this unset.
  const autoConnectEnabled = process.env.NEO4J_AUTOCONNECT === 'true';
  const neo4jHost = process.env.NEO4J_HOST;
  const neo4jUser = process.env.NEO4J_USER;
  const neo4jPassword = process.env.NEO4J_PASSWORD;

  if (autoConnectEnabled && neo4jHost && neo4jUser && neo4jPassword) {
    const config = {
      Id: 'auto',
      ProfileName: 'Azure Neo4j',
      DatabaseType: 'Neo4j',
      Host: neo4jHost,
      DatabaseName: process.env.NEO4J_DATABASE || 'neo4j',
      Username: neo4jUser,
      Password: neo4jPassword,
      LastDBOperationSuccessful: false,
    };

    const tryConnect = async (retries = 10, delay = 5000) => {
      for (let i = 0; i < retries; i++) {
        try {
          await db.connect(config);
          setAutoConnected(true);
          console.log('Auto-connected to Neo4j');
          return;
        } catch (err: any) {
          console.log(`Neo4j attempt ${i + 1}/${retries} failed: ${err.message}`);
          if (i < retries - 1) await new Promise(r => setTimeout(r, delay));
        }
      }
      console.error('Failed to auto-connect to Neo4j after all retries');
    };

    tryConnect();
  }
});
