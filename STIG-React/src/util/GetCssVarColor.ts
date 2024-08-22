export const getCssVarColor = (cssColor: string) => {
    return getComputedStyle(document.documentElement).getPropertyValue(cssColor);
}