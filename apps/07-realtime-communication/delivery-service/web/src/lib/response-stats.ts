import type { PollResponse } from '@/lib/types';

export type ResponseKind = 'changed' | 'unchanged' | 'empty';

/**
 * Labels each response in `history`:
 * - `null`                                        → 'empty'     (a 204: no data at all)
 * - same stageIndex as the last *non-null* entry  → 'unchanged' (a wasted request)
 * - anything else, including the very first entry → 'changed'   (real new information)
 */
const classifyResponses = (history: PollResponse[]): ResponseKind[] => {
  let lastKnown: number | null = null;

  return history.map((stageIndex): ResponseKind => {
    if (stageIndex === null) {
      return 'empty';
    }

    const kind = stageIndex === lastKnown ? 'unchanged' : 'changed';
    lastKnown = stageIndex;
    return kind;
  });
};
export { classifyResponses };
