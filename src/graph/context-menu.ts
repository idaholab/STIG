/*
Copyright 2018 Southern California Edison Company

ALL RIGHTS RESERVED
*/

import * as cytoscape from 'cytoscape';
// import { StigDB } from "../db/db";
import { GraphUtils } from "./graphFunctions";
import { graph_copy } from '../ui/clipboard';
import { StigSettings } from '../storage/stig-settings-storage';

/**
 * @description
 * @export
 * @param {cytoscape.Core} cy
 * @param {StigDB} db
 * @param {*} view_util
 */
export function setup_ctx_menu(cy: cytoscape.Core, /*db: StigDB,*/ view_util: any) {
    const graph_utils = new GraphUtils(cy);//, db);
    cy.cxtmenu({
        selector: 'node',
        commands: [
        {
            content: 'Graph Remove',
            select: (ele: cytoscape.CollectionElements) => {
                cy.remove(ele as unknown as cytoscape.CollectionArgument)
            }
            // select: () => {}
            // select: async (ele : cytoscape.CollectionElements) => {
            //     cy.remove(ele);
            //     // TODO make a new icon for db_delete from graph right click, Tooltips seem to be hard with cy.ctxmenu
            // },
        },
        {
            content: 'DB Delete',
            select: () => {}
            // select: async (ele: cytoscape.CollectionElements) => {
            //     cy.remove(ele);
            //     //TODO: ensure edges delete first.
            //     try {
            //         const resp = await db.sdoDestroyedUI(ele.data("raw_data"));

            //     } catch (e) {
            //         // probably want to indicate that it wasnt deleted from db
            //     }
            // },
        },
        {
            content: 'Query Incoming',
            select: () => {}
            // select: async (ele: cytoscape.CollectionElements) => {
            //     // query the DB here
            //     const children = await db.traverseNodeIn(ele.data("raw_data").id);
            //     const bundle = await db.handleResponse(children);
            //     await graph_utils.buildNodes(bundle, true);
            //     graph_utils.myLayout(StigSettings.Instance.layout.toLowerCase());
            // },
        },
        {
            content: 'Select Incoming',
            select: () => {}
            // select(ele: cytoscape.CollectionElements) {
            //     ele.incomers().select();
            // },
        },
        {
            content: 'Select Out',
            select: () => {}
            // select(ele: cytoscape.CollectionElements) {
            //     ele.outgoers().select();
            // },
        },
        {
            content: 'Query Out',
            select: () => {}
            // async select(ele: cytoscape.CollectionElements) {
            //     // query the DB here
            //     const children = await db.traverseNodeOut(ele.data("raw_data").id);
            //     const bundle = await db.handleResponse(children);
            //     graph_utils.buildNodes(bundle, true);
            //     graph_utils.myLayout(StigSettings.Instance.layout.toLowerCase());
            // },
        },
        {
            content: 'Select Neighbors',
            select: () => {}
            // select(ele: cytoscape.CollectionElements) {
            
            //     // ele.select();
            //     // ele.closedNeighborhood().select();
            //     // view_util.highlightNeighbors(ele);
                
            // },
        },
        ],
    });

    cy.cxtmenu({
        selector: 'edge',
        commands: [{
            content: 'Remove from Graph',
            select: () => {}
            // select(ele: cytoscape.CollectionElements) {
            //     cy.remove(ele);
            // },
        },
        {
            content: 'DB Delete',
            select: () => {}
            // select: async (ele: cytoscape.CollectionElements) => {
            //     //TODO: ensure edges delete first.
            //     try {
            //         const resp = await db.sroDestroyedUI(ele.data("raw_data"));
            //         console.log('response: ',resp);
            //         cy.remove(ele);

            //     } catch (e) {
            //         // probably want to indicate that it wasnt deleted from db
            //     }
            // },
        },
        {
            content: 'Select Source',
            select: () => {}
            // select(ele: cytoscape.CollectionElements) {
            //     ele.source().select();
            // },
        },
        {
            content: 'Select Target',
            select: () => {}
            // select(ele: cytoscape.CollectionElements) {
            //     ele.target().select();
            // },
        }],
    });

    cy.cxtmenu({
        selector: 'core',
        commands: [
            {
                content: 'Layout',
                select: () => {
                    graph_utils.myLayout(StigSettings.Instance.layout.toLowerCase());
                },
            },
            {
                content: 'Hide Selected',
                select: () => {
                    view_util.hide(cy.$(":selected"));
                },
            },
            {
                content: 'Hide Not Selected',
                select: () => {
                    view_util.hide(cy.$(":unselected"));
                },
            },
            {
                content: 'Show All',
                select: () => {
                    view_util.show(cy.elements()); // .showEles();
                },
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
                select: () => graph_copy(),
            },
            {
                content: 'Remove Selected From Graph',
                select: () => {
                    cy.remove(":selected");
                },
            },
        ],
    });
}
