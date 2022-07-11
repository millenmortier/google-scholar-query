import { IArticle } from '@millenmortier/scholarly/dist/lib/interfaces';
export declare class TooManyRequestsError extends Error {
}
/**
 * Keep pulling scholar results until there's nothing left anymore
 *
 * We should be really tentative with sending requests to Google, since they
 * rate limit very heavily, so we wait 2seconds in between each call
 */
export default function query(query: string, limit: number): Promise<IArticle[]>;
