/**
 * Universal date formatter utility
 * Returns ISO 8601 format with milliseconds: YYYY-MM-DDTHH:mm:ss.sssZ
 */

export const formatDate = (date: Date | string | number): string => {
  const dateObj = new Date(date);
  
  if (isNaN(dateObj.getTime())) {
    throw new Error('Invalid date provided');
  }
  
  return dateObj.toISOString();
};

export const formatDateFromTimestamp = (timestamp: number): string => {
  return formatDate(new Date(timestamp));
};

export const formatCurrentDate = (): string => {
  return formatDate(new Date());
};

export const parseISODate = (isoString: string): Date => {
  const date = new Date(isoString);
  
  if (isNaN(date.getTime())) {
    throw new Error('Invalid ISO date string provided');
  }
  
  return date;
};

export const formatDateForDisplay = (date: Date | string | number): string => {
  const dateObj = new Date(date);
  
  if (isNaN(dateObj.getTime())) {
    throw new Error('Invalid date provided');
  }
  
  return dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatDateTimeForDisplay = (date: Date | string | number): string => {
  const dateObj = new Date(date);
  
  if (isNaN(dateObj.getTime())) {
    throw new Error('Invalid date provided');
  }
  
  return dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
};
