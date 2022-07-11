import { EventEmitter } from 'events';
import { search } from '@millenmortier/scholarly';
import wait from './wait';
import { AxiosError } from 'axios';

export class TooManyRequestsError extends Error {}

/**
 * Keep pulling scholar results until there's nothing left anymore
 *
 * We should be really tentative with sending requests to Google, since they
 * rate limit very heavily, so we wait 2seconds in between each call
 */
export default function query(query: string) {
  const emitter = new EventEmitter();

  (async () => {
    let startOffset = 0;
    let pageSize = 10; // Google Scholar page size always seems to be 10. Don't think there's a way to change this
    let foundResults;
    let callCount = 0;

    try {
      while (foundResults !== 0) {
        if (callCount > 0) {
          await wait(2000);
        }

        const results = await search(query, startOffset);
        startOffset += pageSize;
        foundResults = results.length;

        if (foundResults > 0) {
          emitter.emit('data', results);
        }
      }
    } catch (err) {
      if ((err as AxiosError).response?.status === 429) {
        // Too many requests
        emitter.emit('tooManyRequests', err);
      } else {
        emitter.emit('error', err);
      }
    }

    emitter.emit('end');
  })();

  return emitter;
}
