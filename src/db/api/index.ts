import { DBProfile } from '@/types/DBProfile';
import { StigDB } from '../dbi';
import { StixObject } from '@/types/stixTypes/StixObject';
import { StixRelationshipObject } from '@/types/stixTypes/StixRelationshipObject';
import { Delta } from 'diffpatch';
import { stencilItems } from '@/components/elements/StencilItems';

const API_BASE = '/api';

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `API error: ${res.status}`);
  }
  return res.json();
}

export class ApiStigDB implements StigDB {
  public config?: DBProfile;
  private connected = false;

  public getName(): string {
    return 'Neo4j (API)';
  }

  /** Mark as connected without sending a connect request (for server auto-connect). */
  public markConnected(config?: DBProfile): void {
    this.connected = true;
    this.config = config;
  }

  public async configure(config: DBProfile): Promise<void> {
    await this.close();
    this.config = config;
    const result = await apiFetch<{ success: boolean; error?: string }>('/connect', {
      method: 'POST',
      body: JSON.stringify(config),
    });
    if (!result.success) {
      throw new Error(result.error || 'Failed to connect');
    }
    this.connected = true;
  }

  public async delete(stix: StixObject[]): Promise<{ nodes: number; rels: number }> {
    return apiFetch('/delete', {
      method: 'POST',
      body: JSON.stringify({ stix }),
    });
  }

  public async traverseNodeIn(id: string): Promise<StixObject[]> {
    const { results } = await apiFetch<{ results: StixObject[] }>(
      `/nodes/${encodeURIComponent(id)}/in`
    );
    return results;
  }

  public async traverseNodeOut(id: string): Promise<StixObject[]> {
    const { results } = await apiFetch<{ results: StixObject[] }>(
      `/nodes/${encodeURIComponent(id)}/out`
    );
    return results;
  }

  public async getDiff(
    nodes: StixObject[],
    edges: StixRelationshipObject[]
  ): Promise<[StixObject, Delta][]> {
    const { results } = await apiFetch<{ results: [StixObject, Delta][] }>('/diff', {
      method: 'POST',
      body: JSON.stringify({ nodes, edges }),
    });
    return results;
  }

  public async updateDB(
    stix_nodes: StixObject[],
    stix_edges: StixRelationshipObject[]
  ): Promise<{ nodes: number; edges: number; errors: number; invalIds: string[] | undefined }> {
    // Build stencil type map to send to server
    const stencilTypes: Record<string, string> = {};
    for (const item of stencilItems) {
      stencilTypes[item.id] = item.type;
    }
    return apiFetch<{ nodes: number; edges: number; errors: number; invalIds: string[] | undefined }>('/nodes', {
      method: 'PUT',
      body: JSON.stringify({
        nodes: stix_nodes,
        edges: stix_edges,
        stencilTypes,
      }),
    });
  }

  public async executeQuery(query: string): Promise<StixObject[]> {
    const { results } = await apiFetch<{ results: StixObject[] }>('/query', {
      method: 'POST',
      body: JSON.stringify({ query }),
    });
    return results;
  }

  public async close(): Promise<void> {
    if (this.connected) {
      await apiFetch('/disconnect', { method: 'POST' }).catch(() => {});
      this.connected = false;
    }
  }

  public is_closed(): boolean {
    return !this.connected;
  }
}
