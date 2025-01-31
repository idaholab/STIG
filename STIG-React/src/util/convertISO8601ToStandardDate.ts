function isValidISODate(dateString: string): boolean {
  // Regular expression to check for valid ISO 8601 format
  const iso8601Regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?Z$/;

  // Check if the string matches the regex
  if (!iso8601Regex.test(dateString)) {
    return false;
  }

  // Further validation using the Date constructor
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date.getTime());
}

export function convertISOToStandardDateFormat(isoDateString: string): string | null {
  if (!isValidISODate(isoDateString)) {
    console.error('Invalid ISO date format');
    return null;
  }

  const date = new Date(isoDateString);

  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false, // Use 24-hour format
    timeZone: 'UTC', // Ensure consistent timezone
  };

  // Use Intl.DateTimeFormat to format the date
  const formattedParts = new Intl.DateTimeFormat('en-US', options).formatToParts(date);

  // Create a custom format based on the parts
  const formattedDate = `${formattedParts[0].value}/${formattedParts[2].value}/${formattedParts[4].value} ${formattedParts[6].value}:${formattedParts[8].value}:${formattedParts[10].value}`;

  return formattedDate;
}
