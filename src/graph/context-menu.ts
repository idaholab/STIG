/*
Copyright 2018 Southern California Edison Company
ALL RIGHTS RESERVED
*/

import cytoscape from 'cytoscape';
import { GraphUtils } from './graphFunctions';
import { graph_copy } from '../ui/clipboard';
import { StigSettings } from '../storage/stig-settings-storage';
import { db_delete, query_incoming, query_outgoing } from '../ui/dbFunctions';

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
      },
      {
        content: 'DB Delete',
        select (ele: cytoscape.CollectionElements) {
          const element = ele as unknown as cytoscape.CollectionArgument;

          // TODO: ensure edges delete first.
          try {
            const eleList = element.toArray();
            eleList.forEach((value) => {
              cy.remove(value);
              void db_delete(value.data('raw_data'));
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
            await graph_utils.buildNodes(await query_incoming(data), 'DB');
            graph_utils.myLayout(StigSettings.Instance.layout.toLowerCase());
          }
        }
      },
      {
        content: 'Select Incoming',
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
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        async select (ele: cytoscape.CollectionElements) {
          // query the DB here
          const elements = ele as unknown as cytoscape.CollectionArgument;
          for (const value of elements.toArray()) {
            let data = value.data('raw_data');
            if (typeof data === 'string') {
              data = JSON.stringify(data);
            }
            await graph_utils.buildNodes(await query_outgoing(data), 'DB');
            graph_utils.myLayout(StigSettings.Instance.layout.toLowerCase());
          }
        }
      },
      {
        content: 'Select Neighbors',
        select (ele: cytoscape.CollectionElements) {
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
      select (ele: cytoscape.CollectionElements) {
        cy.remove(ele as unknown as cytoscape.CollectionArgument);
      }
    },
    {
      content: 'DB Delete',
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      select (ele: cytoscape.CollectionElements) {
        const element = ele as unknown as cytoscape.CollectionArgument;

        // TODO: ensure edges delete first.
        try {
          const eleList = element.toArray();
          eleList.forEach((value) => {
            cy.remove(value);
            void db_delete(value.data('raw_data'));
          });
        } catch (e) {
          // probably want to indicate that it wasnt deleted from db
        }
      }
    },
    {
      content: 'Select Source',
      select (ele: cytoscape.CollectionElements) {
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
      select (ele: cytoscape.CollectionElements) {
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
          view_util.show(cy.$('.stix_node'));
        }
      },
      {
        content: 'Copy Selected',
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
