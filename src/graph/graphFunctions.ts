/*
Copyright 2018 Southern California Edison Company

ALL RIGHTS RESERVED
 */

import {
  BundleType, Relationship, Sighting, Core, CreatedByRelationshipFactory,
  Identifier, ObjectMarkingRelationship, StixObject, Id, StixRelationshipData,
  StixRelationship, DataSourceType, /* IStixNode, */ StixNode
} from '../stix';
import moment from 'moment';
import { layouts, LayoutsType } from './graphOptions';
import cytoscape from 'cytoscape';

export class GraphUtils {
  public cy: cytoscape.Core;
  public skipLayout: boolean = false;

  constructor (cy: cytoscape.Core) {
    this.cy = cy;
  }

  /**
     *
     *
     * @param {Identifier} id
     * @param {StixObject} [stixobj]
     * @returns {Promise<cytoscape.CollectionReturnValue>}
     * @memberof GraphUtils
     */
  // eslint-disable-next-line @typescript-eslint/require-await
  public async handle_not_in_graph (id: Identifier): Promise<cytoscape.CollectionReturnValue | undefined> {
    return undefined;
    //     let ret;
    //     const the_type = id.split('--')[0].toLowerCase();
    //     const data: GraphQueryResult = { graph: { edges: [], vertices: [] } };
    //     let st_node: IStixNode;
    //     let exists;

    //     try {
    //         exists = await this.db.exists(id);
    //         if (exists) {
    //             if (the_type === 'relationship' || the_type === 'sighting') {
    //                 data.graph.edges = [await this.db.getEdge(id)];
    //             } else {
    //                 data.graph.vertices = [await this.db.getSDO(id)];
    //             }
    //             const bundle = await this.db.handleResponse(data);
    //             const sdo = bundle.objects[0];
    //             st_node = new StixNode(sdo as Core, sdo.type, 'DB');
    //         } else {
    //             // src_node not in graph or db
    //             const create = await confirm("Object with id:" + id + "not found.  Create?");
    //             if (create) {
    //                 const sdo = {
    //                     created: moment().utc().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
    //                     modified: moment().utc().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
    //                     type: the_type,
    //                     id,
    //                     revoked: false,
    //                 };
    //                 st_node = new StixNode(sdo as Core, sdo.type, 'GUI');
    //             } else {
    //                 return undefined;
    //             }
    //         }
    //         if (!this.cy.getElementById(st_node.data.id).length) {
    //             ret = this.cy.add(st_node as cytoscape.ElementDefinition);
    //             this.db.needs_save(id, this.cy).then(() => { return; });
    //         }
    //         return ret;
    //     } catch (e) {
    //         console.error(e);
    //         e.stack += (new Error()).stack;
    //         throw e;
    //     }
  }

  private _addVertices (sdos: StixObject[], from_db: boolean = false): [cytoscape.CollectionReturnValue, Relationship[], Sighting[]] {
    const relationshipsKeyRegex = /((r|R)elationship)|((s|S)ighting)/;
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

        if (!(relationshipsKeyRegex.exec(sdo.type))) {
          const st_node = new StixNode(sdo as Core, sdo.type, from_db ? 'DB' : 'GUI');
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

  /**
     * pkg should be a JSON object complying to the Stix2.1 bundle schema
     *
     * @param {BundleType} pkg
     * @returns {Promise<cytoscape.CollectionElements>}
     * @memberof GraphUtils
     */
  public async buildNodes (pkg: BundleType, from_db: boolean = false): Promise<cytoscape.CollectionReturnValue> {
    // let relationships: Relationship[] = [];
    // let sightings: Sighting[] = [];
    // let in_graph = new Set<Id>()
    const sdos = pkg.objects;

    // let cont = false;
    if (sdos === undefined) {
      return this.cy.elements('#nothing');
    }
    const data_source = from_db ? 'DB' : 'GUI';
    const [nodes_added, relationships, sightings] = this._addVertices(sdos as StixObject[], from_db);
    const to_add: cytoscape.ElementDefinition[] = [];
    // Add relationships to graph
    for (const r of relationships) {
      // console.log(`adding relationship ${r.id}`);
      let to_node: cytoscape.CollectionReturnValue | undefined = this.cy.getElementById(r.target_ref!);
      let from_node: cytoscape.CollectionReturnValue | undefined = this.cy.getElementById(r.source_ref!);
      if (from_node.length === 0) {
        from_node = await this.handle_not_in_graph(r.source_ref!);
      }
      if (to_node.length === 0) {
        to_node = await this.handle_not_in_graph(r.target_ref!);
      }

      if (from_node === undefined || to_node === undefined) {
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
          const edge_data = {
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
          const edge_data = {
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
          const edge_data = {
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
        const edge_data = {
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
    const all_new = nodes_added.union(edges_added);

    // for (let j in all_new){
    all_new.forEach((ele: { data: { (arg0: string): string, (arg0: string): string } }, j: any, _eles: any) => {
      if (ele.data) {
        // console.debug(ele.id(), ele.data('data_source'));
        if (ele.data('data_source') === 'GUI') {
          // this.db.needs_save(ele.data('id'), this.cy).then((saved) => saved);
        }
      }
      return true;
    });
    return all_new;
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
