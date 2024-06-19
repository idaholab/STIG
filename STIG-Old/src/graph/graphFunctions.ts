/*
Copyright 2018 Southern California Edison Company

ALL RIGHTS RESERVED
 */

import {
  Relationship, Sighting, Core, CreatedByRelationshipFactory,
  ObjectMarkingRelationship, Id, StixRelationshipData,
  StixRelationship, DataSourceType, StixNode,
} from '../stix';
import moment from 'moment';
import { layouts, LayoutsType } from './graphOptions';
import cytoscape from 'cytoscape';
import { isSRO } from '../stix/stix2';

export class GraphUtils {
  public cy: cytoscape.Core;
  public skipLayout: boolean = false;

  constructor (cy: cytoscape.Core) {
    this.cy = cy;
  }

  private _addVertices (sdos: Core[], data_source: DataSourceType): [cytoscape.CollectionReturnValue, Relationship[], Sighting[]] {
    const in_graph = new Set<Id>();
    const to_add: cytoscape.ElementDefinition[] = [];
    const relationships: Relationship[] = [];
    const sightings: Sighting[] = [];
    sdos = sdos.sort((a, b) => {
      const momentA = moment(a.modified).unix();
      const momentB = moment(b.modified).unix();
      return momentB - momentA;
    });

    try {
      for (const sdo of sdos) {
        if (sdo.id === undefined || sdo.type === undefined) {
          continue;
        }
        if (this.cy.getElementById(sdo.id).length > 0) { continue; }

        if (!isSRO(sdo)) {
          const st_node = new StixNode(sdo, sdo.type, data_source);
          if (!in_graph.has(st_node.data.id)) {
            to_add.push(JSON.parse(JSON.stringify(st_node)) as cytoscape.ElementDefinition);
            in_graph.add(st_node.data.id);
          }
          if (sdo.created_by_ref !== null && sdo.created_by_ref !== undefined) {
            if (!in_graph.has(sdo.id)) {
              const cb_sro = CreatedByRelationshipFactory(sdo.id, sdo.created_by_ref, sdo.created, sdo.modified!);
              relationships.push(cb_sro as Relationship);
              in_graph.add(sdo.id);
            }
          } else if ('object_marking_refs' in sdo && sdo.object_marking_refs !== undefined) {
            // add object marking references 'applies-to'
            sdo.object_marking_refs.forEach((markingID: any) => {
              if (!in_graph.has(sdo.id)) {
                relationships.push(new ObjectMarkingRelationship(markingID, sdo.id, sdo.created, sdo.modified!));
                in_graph.add(sdo.id);
              }
            });
          }
        } else if (sdo.type.toLowerCase() === 'relationship') {
          if (!in_graph.has(sdo.id)) {
            relationships.push(sdo as Relationship);
            in_graph.add(sdo.id);
          }
        } else if (sdo.type.toLowerCase() === 'sighting') {
          if (!in_graph.has(sdo.id)) {
            sightings.push(sdo as Sighting);
            in_graph.add(sdo.id);
          }
        }
      }
      const nodes_added = this.cy.add(to_add);

      return [nodes_added, relationships, sightings];
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Exception adding nodes to graph:', e);
      throw e;
    }
  }

  public buildNodes (objects: Core[], data_source: DataSourceType): cytoscape.CollectionReturnValue {
    const [nodes_added, relationships, sightings] = this._addVertices(objects, data_source);
    const to_add: cytoscape.ElementDefinition[] = [];
    // Add relationships to graph
    for (const r of relationships) {
      const to_node: cytoscape.CollectionReturnValue | undefined = this.cy.getElementById(r.target_ref!);
      const from_node: cytoscape.CollectionReturnValue | undefined = this.cy.getElementById(r.source_ref!);
      if (from_node.length === 0 || to_node.length === 0) {
        continue;
      }

      const edge_data: StixRelationshipData = {
        target: to_node.id(),
        source: from_node.id(),
        id: r.id,
        label: r.relationship_type!,
        raw_data: r
      };
      const relationship = new StixRelationship(edge_data, data_source);
      if (!this.cy.getElementById(r.id).length) {
        to_add.push(JSON.parse(JSON.stringify(relationship)) as cytoscape.ElementDefinition);
      }
    }
    for (const r of sightings) {
      const from_node = this.cy.getElementById(r.sighting_of_ref!);
      // first create any observed data refs
      if (r.observed_data_refs) {
        for (const t_n of r.observed_data_refs) {
          const to_node = this.cy.getElementById(t_n);
          const edge_data: StixRelationshipData = {
            target: to_node.id(),
            source: from_node.id(),
            id: r.id,
            label: 'observed data sighting',
            raw_data: r,
            data_source: 'IGNORE' as DataSourceType
          };
          const relationship = new StixRelationship(edge_data, 'IGNORE');
          if (!this.cy.getElementById(r.id).length) {
            to_add.push(JSON.parse(JSON.stringify(relationship)) as cytoscape.ElementDefinition);
          }
        }
      }
      if (r.object_marking_refs) {
        for (const t_n of r.object_marking_refs) {
          const to_node = this.cy.getElementById(t_n);
          const edge_data: StixRelationshipData = {
            target: to_node.id(),
            source: from_node.id(),
            id: r.id,
            label: 'object marking',
            raw_data: r,
            data_source: 'IGNORE' as DataSourceType
          };
          const relationship = new StixRelationship(edge_data, 'IGNORE');
          if (!this.cy.getElementById(r.id).length) {
            to_add.push(JSON.parse(JSON.stringify(relationship)) as cytoscape.ElementDefinition);
          }
        }
      }
      if (r.where_sighted_refs) {
        for (const t_n of r.where_sighted_refs) {
          const to_node = this.cy.getElementById(t_n);
          const edge_data: StixRelationshipData = {
            target: to_node.id(),
            source: from_node.id(),
            id: r.id,
            label: 'where sighted',
            raw_data: r
          };
          const relationship = new StixRelationship(edge_data, 'IGNORE');
          if (!this.cy.getElementById(r.id).length) {
            to_add.push(JSON.parse(JSON.stringify(relationship)) as cytoscape.ElementDefinition);
          }
        }
      }
      if (r.sighting_of_ref) {
        const to_node = this.cy.getElementById(r.sighting_of_ref);
        const edge_data: StixRelationshipData = {
          target: to_node.id(),
          source: from_node.id(),
          id: r.id,
          label: 'where sighted',
          raw_data: r,
          data_source: 'IGNORE' as DataSourceType
        };
        const relationship = new StixRelationship(edge_data, 'IGNORE');
        if (!this.cy.getElementById(r.id).length) {
          to_add.push(JSON.parse(JSON.stringify(relationship)) as cytoscape.ElementDefinition);
        }
      }
    }
    const edges_added = this.cy.add(to_add);
    return nodes_added.union(edges_added);
  }

  /**
   *
   * @description Lays out and renders the graph.
   * @param {keyof LayoutsType} layout_type
   * @memberof GraphUtils
   */
  public myLayout (layout_type: keyof LayoutsType): void {
    if (this.skipLayout) {
      this.skipLayout = !this.skipLayout;
      return;
    }

    // Select all nodes with no parents or children
    const orphans = this.cy.$(':orphan').filter(':childless');
    const layout = orphans.layout(layouts[layout_type]);
    layout.run();
  }
}
