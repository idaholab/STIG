export const getCssVarColor = (cssColor: string) => {
    return getComputedStyle(document.documentElement).getPropertyValue(cssColor).trim();
}

export const getCssRGBVarColor = (cssColor: string): string | undefined => {
    const rootParts = getCssVarColor(cssColor).split(' ');
    if (rootParts.length === 3 || rootParts.length === 4) {
        const colorType = rootParts.length === 3 ? 'rgb' : 'rgba';
        return `${colorType}(${rootParts.join(', ')})`;
    }
    return undefined;
};