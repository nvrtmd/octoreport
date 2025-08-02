import { filterParticipationByUser } from '../filters';

import { Participation } from '@/types';

export function getFirstParticipationTime(
  participation: Participation[],
  username: string,
): string | null {
  if (!participation || participation.length === 0) {
    return null;
  }
  const filteredParticipationByUser = filterParticipationByUser(participation, username);
  const timestamps = filteredParticipationByUser
    .filter((item): item is NonNullable<typeof item> => item !== null)
    .map((item) => ('submittedAt' in item ? item.submittedAt : item.createdAt))
    .filter((timestamp): timestamp is string => timestamp !== 'Invalid Date' && timestamp !== null);
  return timestamps.sort((a, b) => new Date(a).getTime() - new Date(b).getTime())[0] ?? null;
}
