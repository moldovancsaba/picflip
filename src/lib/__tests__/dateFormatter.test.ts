import {
  formatDate,
  formatDateFromTimestamp,
  formatCurrentDate,
  parseISODate,
  formatDateForDisplay,
  formatDateTimeForDisplay,
} from '../dateFormatter';

describe('dateFormatter', () => {
  const testDate = new Date('2025-04-13T12:34:56.789Z');
  const testTimestamp = testDate.getTime();
  const expectedISO = '2025-04-13T12:34:56.789Z';

  describe('formatDate', () => {
    it('should format Date object to ISO 8601 string with milliseconds', () => {
      expect(formatDate(testDate)).toBe(expectedISO);
    });

    it('should format date string to ISO 8601 string with milliseconds', () => {
      expect(formatDate('2025-04-13T12:34:56.789Z')).toBe(expectedISO);
    });

    it('should format timestamp to ISO 8601 string with milliseconds', () => {
      expect(formatDate(testTimestamp)).toBe(expectedISO);
    });

    it('should throw error for invalid date', () => {
      expect(() => formatDate('invalid-date')).toThrow('Invalid date provided');
    });

    it('should throw error for NaN', () => {
      expect(() => formatDate(NaN)).toThrow('Invalid date provided');
    });
  });

  describe('formatDateFromTimestamp', () => {
    it('should format timestamp to ISO 8601 string', () => {
      expect(formatDateFromTimestamp(testTimestamp)).toBe(expectedISO);
    });

    it('should throw error for invalid timestamp', () => {
      expect(() => formatDateFromTimestamp(NaN)).toThrow('Invalid date provided');
    });
  });

  describe('formatCurrentDate', () => {
    it('should return current date in ISO 8601 format', () => {
      const result = formatCurrentDate();
      // Check that it's a valid ISO string
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
      // Check that it's a recent date (within 1 second)
      const now = new Date();
      const resultDate = new Date(result);
      expect(Math.abs(now.getTime() - resultDate.getTime())).toBeLessThan(1000);
    });
  });

  describe('parseISODate', () => {
    it('should parse valid ISO date string', () => {
      const result = parseISODate(expectedISO);
      expect(result).toEqual(testDate);
    });

    it('should throw error for invalid ISO string', () => {
      expect(() => parseISODate('invalid-iso')).toThrow('Invalid ISO date string provided');
    });

    it('should throw error for empty string', () => {
      expect(() => parseISODate('')).toThrow('Invalid ISO date string provided');
    });
  });

  describe('formatDateForDisplay', () => {
    it('should format Date object for display', () => {
      const result = formatDateForDisplay(testDate);
      expect(result).toMatch(/^Apr 13, 2025/); // Check basic format
    });

    it('should format timestamp for display', () => {
      const result = formatDateForDisplay(testTimestamp);
      expect(result).toMatch(/^Apr 13, 2025/);
    });

    it('should throw error for invalid date', () => {
      expect(() => formatDateForDisplay('invalid')).toThrow('Invalid date provided');
    });
  });

  describe('formatDateTimeForDisplay', () => {
    it('should format Date object for display with time', () => {
      const result = formatDateTimeForDisplay(testDate);
      expect(result).toMatch(/^Apr 13, 2025/);
      expect(result).toMatch(/\d{2}:\d{2}:\d{2}/); // Should include seconds
    });

    it('should format timestamp for display with time', () => {
      const result = formatDateTimeForDisplay(testTimestamp);
      expect(result).toMatch(/^Apr 13, 2025/);
      expect(result).toMatch(/\d{2}:\d{2}:\d{2}/);
    });

    it('should throw error for invalid date', () => {
      expect(() => formatDateTimeForDisplay('invalid')).toThrow('Invalid date provided');
    });
  });

  describe('ISO 8601 format compliance', () => {
    it('should always return ISO 8601 format with milliseconds', () => {
      const testCases = [
        new Date('2025-01-01'),
        new Date('2025-12-31T23:59:59.999Z'),
        new Date('2025-06-15T00:00:00.000Z'),
      ];

      testCases.forEach(date => {
        const result = formatDate(date);
        // Check ISO 8601 format with milliseconds
        expect(result).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
        // Verify it's a valid date
        expect(new Date(result).toISOString()).toBe(result);
      });
    });
  });
});
