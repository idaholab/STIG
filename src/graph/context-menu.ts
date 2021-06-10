/*
Copyright 2018 Southern California Edison Company

ALL RIGHTS RESERVED
*/

import * as cytoscape from 'cytoscape';
import { StigDB } from "../db/db";
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
export function setup_ctx_menu(cy: cytoscape.Core, db: StigDB, view_util: any) {
    const graph_utils = new GraphUtils(cy, db);
    cy.cxtmenu({
        selector: 'node',
        commands: [
        {
            content: '<span class="fa fa-trash-o fa-2x"></span>',
            select: async (ele: cytoscape.CollectionElements) => {
                cy.remove(ele);
                try {
                    const resp = await db.sdoDestroyedUI(ele.data("raw_data"));

                } catch (e) {
                    // probably want to indicate that it wasnt deleted from db
                }
            },
        },
        {
            content: 'Query Incoming',
            select: async (ele: cytoscape.CollectionElements) => {
                // query the DB here
                const children = await db.traverseNodeIn(ele.data("raw_data").id);
                const bundle = await db.handleResponse(children);
                await graph_utils.buildNodes(bundle, true);
                graph_utils.myLayout(StigSettings.Instance.layout.toLowerCase());
            },
        },
        {
            content: 'select in',
            select(ele: cytoscape.CollectionElements) {
                ele.incomers().select();
            },
        },
        {
            content: 'select out',
            select(ele: cytoscape.CollectionElements) {
                ele.outgoers().select();
            },
        },
        {
            content: 'Query Out',
            async select(ele: cytoscape.CollectionElements) {
                // query the DB here
                const children = await db.traverseNodeOut(ele.data("raw_data").id);
                const bundle = await db.handleResponse(children);
                graph_utils.buildNodes(bundle, true);
                graph_utils.myLayout(StigSettings.Instance.layout.toLowerCase());
            },
        },
        {
            content: 'select neighbors',
            select(ele: cytoscape.CollectionElements) {
                ele.select();
                ele.closedNeighborhood().select();
                // view_util.highlightNeighbors(ele);
            },
        },
        ],
    });

    cy.cxtmenu({
        selector: 'edge',
        commands: [{
            content: 'remove',
            select(ele: cytoscape.CollectionElements) {
                cy.remove(ele);
            },
        },
        {
            content: 'select source',
            select(ele: cytoscape.CollectionElements) {
                ele.source().select();
            },
        },
        {
            content: 'select target',
            select(ele: cytoscape.CollectionElements) {
                ele.target().select();
            },
        }],
    });

    cy.cxtmenu({
        selector: 'core',
        commands: [
            {
                content: 'layout',
                select: () => {
                    graph_utils.myLayout(StigSettings.Instance.layout.toLowerCase());
                },
            },
            {
                content: 'hide selected',
                select: () => {
                    view_util.hide(cy.$(":selected"));
                },
            },
            {
                content: 'hide not selected',
                select: () => {
                    view_util.hide(cy.$(":unselected"));
                },
            },
            {
                content: 'show all',
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
                content: 'copy selected',
                select: () => graph_copy(),
            },
            {
                content: 'remove selected',
                select: () => {
                    cy.remove(":selected");
                },
            },
        ],
    });
}
