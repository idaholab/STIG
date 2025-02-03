import { Css, StylesheetStyle } from 'cytoscape';
import { getCssRGBVarColor } from '@/util/GetCssVarColor';

type LineStyle = 'solid' | 'dotted' | 'dashed';

const applyStyleToCytoscapeEdges = (cy: cytoscape.Core, selector: string, style: Css.Edge) => {
    cy.style()
        .selector(selector)
        .style(style)
        .update();
};

const isValidLineStyle = (lineStyle: string): lineStyle is LineStyle => {
    const validLineStyles: LineStyle[] = ['solid', 'dotted', 'dashed'];
    return validLineStyles.includes(lineStyle as LineStyle);
};

const getValidatedLineStyle = (edgeLineStyle?: string): LineStyle => {
    return isValidLineStyle(edgeLineStyle || '') ? edgeLineStyle as LineStyle : 'solid';
};

const createEdgeStyle = (): Css.Edge => {
    const edgeTextColor = getCssRGBVarColor('--edge-text-color');
    const targetArrowColor = getCssRGBVarColor('--edge-target-arrow-color');
    const edgeColor = getCssRGBVarColor('--edge-color');

    return {
        events: 'yes',
        label: 'data(label)',
        width: 2,
        'color': edgeTextColor,
        'text-background-opacity': 0,
        'target-arrow-color': targetArrowColor,
        'line-color': edgeColor,
        'line-style': 'solid', // default, will be overridden
        'target-arrow-shape': 'triangle',
        'target-arrow-fill': 'filled',
        'source-arrow-shape': 'none',
        'source-arrow-fill': 'hollow',
        'text-margin-x': -10,
        'text-margin-y': -10,
        'min-zoomed-font-size': 10,
        'text-rotation': 'autorotate',
        'arrow-scale': 2,
        'target-distance-from-node': 5,
        'source-distance-from-node': 5,
        'curve-style': 'bezier',
        'control-point-distances': '-20 -20',
        'control-point-weights': '0.25 0.75',
    };
};

export const updateEdgeStyle = (cy: cytoscape.Core) => {
    const solidEdgeStyle: StylesheetStyle = generateEdgeStyle();
    const dashedEdgeStyle: StylesheetStyle = generateEdgeStyle('dashed');
    applyStyleToCytoscapeEdges(cy, 'edge', solidEdgeStyle.style as Css.Edge);
    applyStyleToCytoscapeEdges(cy, 'edge[raw_data="visual_edge"]', dashedEdgeStyle.style as Css.Edge);
};

export const generateEdgeStyle = (edgeLineStyle?: string): StylesheetStyle => {
    const validatedLineStyle = getValidatedLineStyle(edgeLineStyle);
    const baseStyle = createEdgeStyle();
    const style: Css.Edge = {
        ...baseStyle,
        'line-style': validatedLineStyle,
        events: validatedLineStyle === 'dashed' ? 'no' : baseStyle.events, // Ensure dashed edges can't be selected
    };
    return {
        selector: 'edge',
        style: style,
    };
};

export const updateEdgeSelectedStyle = (cy: cytoscape.Core) => {
    const selectedStyle: StylesheetStyle | undefined = generateEdgeSelectedStyle();
    if (selectedStyle && selectedStyle.style) {
        applyStyleToCytoscapeEdges(cy, 'edge:selected', selectedStyle.style as Css.Edge);
    }
};
export const generateEdgeSelectedStyle = (): StylesheetStyle => {
    const selectedColor = getCssRGBVarColor('--selected-edge-color');
    const style: Css.Edge = {
        'target-arrow-color': selectedColor,
        'source-arrow-color': selectedColor,
        'line-color': selectedColor,
    };
    return {
        selector: 'edge:selected',
        style: style
    };
};