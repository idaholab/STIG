// Sanitize input to prevent XSS
export const sanitizeInput = (input: string): string => {
  const element = document.createElement('div');
  element.innerText = input;
  return element.innerHTML;
};
