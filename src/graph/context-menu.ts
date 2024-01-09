/*
Copyright 2018 Southern California Edison Company
ALL RIGHTS RESERVED
*/

import cytoscape from 'cytoscape';
import { GraphUtils } from './graphFunctions';
import { graph_copy } from '../ui/clipboard';
import { StigSettings } from '../storage/stig-settings-storage';
import { db_delete, query_incoming, query_outgoing } from '../db/dbFunctions';
import { BundleType } from '../stix';

/**
 * @description
 * @export
 * @param {cytoscape.Core} cy
 * @param {StigDB} db
 * @param {*} view_util
 */
export function setup_ctx_menu (cy: cytoscape.Core, view_util: any) {
  const graph_utils = new GraphUtils(cy);
  cy.cxtmenu({
    selector: '.stix_node',
    commands: [
      {
        content: 'Graph Remove',
        select: (ele: cytoscape.CollectionElements) => {
          cy.remove(ele as unknown as cytoscape.CollectionArgument);
        }
        // select: async (ele : cytoscape.CollectionElements) => {
        //     cy.remove(ele);
        //     // TODO make a new icon for db_delete from graph right click, Tooltips seem to be hard with cy.ctxmenu
        // },
      },
      {
        content: 'DB Delete',
        select (ele: cytoscape.CollectionElements) {
          const element = ele as unknown as cytoscape.CollectionArgument;

          // TODO: ensure edges delete first.
          try {
            // const resp = await db.sdoDestroyedUI(ele.data("raw_data"));
            const eleList = element.toArray();
            eleList.forEach((value) => {
              cy.remove(value);
              db_delete(value.data('raw_data'));
            });
          } catch (e) {
            // probably want to indicate that it wasnt deleted from db
          }
        }
      },
      {
        content: 'Query Incoming',
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        async select (ele: cytoscape.CollectionElements) {
          // query the DB here
          const elements = ele as unknown as cytoscape.CollectionArgument;
          for (const value of elements.toArray()) {
            let data = value.data('raw_data');
            if (typeof data === 'string') {
              data = JSON.stringify(data);
            }
            // console.log(data)
            const children = await query_incoming(data);
            // console.log(JSON.stringify(children))
            const bundle: BundleType = { type: 'bundle', objects: [] };
            children.forEach((value) => {
              bundle.objects.push(value);
            });
            // console.log(bundle.objects)
            await graph_utils.buildNodes(bundle, true);
            graph_utils.myLayout(StigSettings.Instance.layout.toLowerCase());
          }
        }
      },
      {
        content: 'Select Incoming',
        // select: () => {}
        select (ele: cytoscape.CollectionElements) {
          const elements = ele as unknown as cytoscape.CollectionArgument;
          elements.toArray().forEach((value) => {
            if (value.isNode()) {
              value.incomers().select();
            }
          });
        }
      },
      {
        content: 'Select Out',
        // select: () => {}
        select (ele: cytoscape.CollectionElements) {
          const elements = ele as unknown as cytoscape.CollectionArgument;
          elements.toArray().forEach((value) => {
            if (value.isNode()) {
              value.outgoers().select();
            }
          });
        }
      },
      {
        content: 'Query Out',
        // select: () => {}
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        async select (ele: cytoscape.CollectionElements) {
          // query the DB here
          // const children = await db.traverseNodeOut(ele.data("raw_data").id);
          // const bundle = await db.handleResponse(children);
          // graph_utils.buildNodes(bundle, true);
          // graph_utils.myLayout(StigSettings.Instance.layout.toLowerCase());

          const elements = ele as unknown as cytoscape.CollectionArgument;
          for (const value of elements.toArray()) {
            let data = value.data('raw_data');
            if (typeof data === 'string') {
              data = JSON.stringify(data);
            }
            // console.log(data)
            const children = await query_outgoing(data);
            // console.log(JSON.stringify(children))
            const bundle: BundleType = { type: 'bundle', objects: [] };
            children.forEach((value) => {
              bundle.objects.push(value);
            });
            // console.log(bundle.objects)
            await graph_utils.buildNodes(bundle, true);
            graph_utils.myLayout(StigSettings.Instance.layout.toLowerCase());
          }
        }
      },
      {
        content: 'Select Neighbors',
        // select: () => {}
        select (ele: cytoscape.CollectionElements) {
          // ele.select();
          // ele.closedNeighborhood().select();
          // // view_util.highlightNeighbors(ele);

          const elements = ele as unknown as cytoscape.CollectionArgument;
          elements.toArray().forEach((value) => {
            if (value.isNode()) {
              value.select();
              value.closedNeighborhood().select();
            }
          });
        }
      }
    ]
  });

  cy.cxtmenu({
    selector: 'edge',
    commands: [{
      content: 'Remove from Graph',
      // select: () => {}
      select (ele: cytoscape.CollectionElements) {
        cy.remove(ele as unknown as cytoscape.CollectionArgument);
      }
    },
    {
      content: 'DB Delete',
      // select: () => {}
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      select (ele: cytoscape.CollectionElements) {
        const element = ele as unknown as cytoscape.CollectionArgument;

        // TODO: ensure edges delete first.
        try {
          // const resp = await db.sdoDestroyedUI(ele.data("raw_data"));
          const eleList = element.toArray();
          eleList.forEach((value) => {
            cy.remove(value);
            db_delete(value.data('raw_data'));
          });
        } catch (e) {
          // probably want to indicate that it wasnt deleted from db
        }
      }
    },
    {
      content: 'Select Source',
      // select: () => {}
      select (ele: cytoscape.CollectionElements) {
        // ele.source().select();
        const elements = ele as unknown as cytoscape.CollectionArgument;

        elements.toArray().forEach((value) => {
          if (value.isEdge()) {
            value.source().select();
          }
        });
      }
    },
    {
      content: 'Select Target',
      // select: () => {}
      select (ele: cytoscape.CollectionElements) {
        // ele.source().select();
        const elements = ele as unknown as cytoscape.CollectionArgument;

        elements.toArray().forEach((value) => {
          if (value.isEdge()) {
            value.target().select();
          }
        });
      }
    }]
  });

  cy.cxtmenu({
    selector: 'core',
    commands: [
      {
        content: 'Layout',
        select: () => {
          graph_utils.myLayout(StigSettings.Instance.layout.toLowerCase());
        }
      },
      {
        content: 'Hide Selected',
        select: () => {
          view_util.hide(cy.$(':selected'));
        }
      },
      {
        content: 'Hide Not Selected',
        select: () => {
          view_util.hide(cy.$('.stix_node:unselected'));
        }
      },
      {
        content: 'Show All',
        select: () => {
          view_util.show(cy.$('.stix_node')); // .showEles();
        }
      },
      // {
      //     content: 'remove highlights',
      //     select: () => {
      //         view_util.removeHighlights();
      //     },
      // },
      {
        content: 'Copy Selected',
        // select: () => {}
        select: () => { graph_copy(); }
      },
      {
        content: 'Remove Selected From Graph',
        select: () => {
          cy.remove(':selected');
        }
      }
    ]
  });
}
