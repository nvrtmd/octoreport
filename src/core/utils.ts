import { DateTime } from 'luxon';

export function uniqueArray<T>(array: T[] | null): T[] | null {
  return array ? Array.from(new Set(array)) : null;
}

export function convertUTCISOToLocal(date: string): string {
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const local = DateTime.fromISO(date, { zone: 'utc' }).setZone(timeZone);
  return local.toFormat('yyyy-MM-dd HH:mm:ss');
}
