import { describe, expect, it } from 'vitest';

import { convertUTCISOToLocal } from '../../src/core/utils';

describe('convertUTCISOToLocal with KST timezone', () => {
  it('converts UTC ISO string to KST timezone in test environment', () => {
    const result = convertUTCISOToLocal('2024-01-15T10:30:00Z');
    // KST timezone is UTC+9, so 10:30 UTC = 19:30 KST
    expect(result).toBe('2024-01-15 19:30:00');
  });

  it('converts another UTC ISO string to KST timezone', () => {
    const result = convertUTCISOToLocal('2024-01-15T00:00:00Z');
    // 00:00 UTC = 09:00 KST timezone
    expect(result).toBe('2024-01-15 09:00:00');
  });

  it('handles date change when converting to KST', () => {
    const result = convertUTCISOToLocal('2024-01-15T23:30:00Z');
    // 23:30 UTC = 08:30 KST timezone (next day)
    expect(result).toBe('2024-01-16 08:30:00');
  });
});
