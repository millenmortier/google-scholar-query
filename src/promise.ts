import { search } from '@millenmortier/scholarly';
import { IArticle } from '@millenmortier/scholarly/dist/lib/interfaces';
import wait from './wait';
import { AxiosError } from 'axios';

export class TooManyRequestsError extends Error {}

/**
 * Keep pulling scholar results until there's nothing left anymore
 *
 * We should be really tentative with sending requests to Google, since they
 * rate limit very heavily, so we wait 2seconds in between each call
 */
export default async function query(query: string, limit: number = Infinity) {
  let allResults: IArticle[] = [];
  let startOffset = 0;
  let pageSize = 10; // Google Scholar page size always seems to be 10. Don't think there's a way to change this
  let foundResults;
  let callCount = 0;

  try {
    while (foundResults !== 0 && allResults.length < limit) {
      if (callCount > 0) {
        await wait(2000);
      }

      const results = await search(query, startOffset);
      allResults = allResults.concat(results);
      startOffset += pageSize;
      foundResults = results.length;
    }

    if (allResults.length > limit) {
      allResults = allResults.slice(0, limit);
    }
  } catch (err) {
    if ((err as AxiosError).response?.status === 429) {
      // Too many requests
      throw new TooManyRequestsError(
        (err as AxiosError).response?.data as string
      );
    } else {
      throw err;
    }
  }
  return allResults;
}
