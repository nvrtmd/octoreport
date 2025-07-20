import { DateTime } from 'luxon';

export function uniqueArray<T>(array: T[]): T[] {
  return Array.from(new Set(array));
}

export function convertUTCISOToLocal(date: string): string {
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const local = DateTime.fromISO(date, { zone: 'utc' }).setZone(timeZone);
  return local.toFormat('yyyy-MM-dd HH:mm:ss');
}
