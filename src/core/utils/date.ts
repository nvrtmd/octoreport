import { DateTime } from 'luxon';

export function convertUTCISOToLocal(datetime: string): string {
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const local = DateTime.fromISO(datetime, { zone: 'utc' }).setZone(timeZone);
  return local.toFormat('yyyy-MM-dd HH:mm:ss');
}

export function extractDateFromDateTime(dateTime: string): string {
  return dateTime.split(' ')[0];
}
