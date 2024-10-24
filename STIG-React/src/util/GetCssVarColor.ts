export const getCssVarColor = (cssColor: string) => {
    return getComputedStyle(document.documentElement).getPropertyValue(cssColor).trim();
}

// export const getCssRGBVarColor = (cssColor: string): string => {
//     const rootParts = getCssVarColor(cssColor).split(' ');
//     let rgbString = '';

//     if (rootParts.length === 3) {
//         rgbString = `rgb(${rootParts.join(', ')})`;
//     }
//     else if (rootParts.length === 4) {
//         rgbString = `rgba(${rootParts.join(', ')})`;
//     }
//     return rgbString;
// }

export const getCssRGBVarColor = (cssColor: string): string | undefined => {
    const rootParts = getCssVarColor(cssColor).split(' ');
    if (rootParts.length === 3 || rootParts.length === 4) {
        const colorType = rootParts.length === 3 ? 'rgb' : 'rgba';
        return `${colorType}(${rootParts.join(', ')})`;
    }
    return undefined;
};

function rgbToHex(rgb: string): string {
    const componentToHex = (component: number): string => {
        const hex = component.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    };

    const result = rgb.match(/\d+/g);
    if (!result || result.length !== 3) {
        throw new Error('Invalid RGB format');
    }

    const r = parseInt(result[0], 10);
    const g = parseInt(result[1], 10);
    const b = parseInt(result[2], 10);

    return `#${componentToHex(r)}${componentToHex(g)}${componentToHex(b)}`;
}