import { getCssRGBVarColor } from "@/util/GetCssVarColor";
import { Css, StylesheetStyle } from "cytoscape";

const applyStyleToCytoscape = (cy: cytoscape.Core, selector: string, style: Css.Node) => {
    cy.style()
        .selector(selector)
        .style(style)
        .update();
};

export const updateNodeStyle = (cy: cytoscape.Core) => {
    const nodeStyle: StylesheetStyle | undefined = generateNodeStyle().find(style => style.selector === '.stix_node');
    if (nodeStyle && nodeStyle.style) {
        applyStyleToCytoscape(cy, '.stix_node', nodeStyle.style as Css.Node);
    }
};
export const generateNodeStyle = (): StylesheetStyle[] => {
    const nodeTextColor = getCssRGBVarColor('--node-text-color');
    //const nodeBorderColor = getCssRGBVarColor('--node-border-color');
    const style: Css.Node = {
        content: 'data(label)',
        shape: 'roundrectangle',
        width: 77,
        height: 77,
        'color': nodeTextColor,
        'border-opacity': 0,
        'border-width': 0,
        'text-background-opacity': 0,
        //'border-color': nodeBorderColor,
        'font-size': 14,
        'text-margin-y': -8,
        'min-zoomed-font-size': 10,
        'text-wrap': 'wrap',
        'background-fit': 'cover',
        'overlay-opacity': 0,
        'text-max-width': '120',
    };
    return [{
        selector: '.stix_node',
        style: style
    }];
};

export const updateNodeSelectedStyle = (cy: cytoscape.Core) => {
    const selectedStyle: StylesheetStyle | undefined = generateNodeSelectedStyle().find(style => style.selector === '.stix_node:selected');
    if (selectedStyle && selectedStyle.style) {
        applyStyleToCytoscape(cy, '.stix_node:selected', selectedStyle.style as Css.Node);
    }
};
export const generateNodeSelectedStyle = (): StylesheetStyle[] => {
    const selectedColor = getCssRGBVarColor('--selected-node-color');
    const style: Css.Node = {
        'border-color': selectedColor,
        'border-width': 3,
        'border-opacity': 1,
    };
    return [{
        selector: '.stix_node:selected',
        style: style
    }];
};