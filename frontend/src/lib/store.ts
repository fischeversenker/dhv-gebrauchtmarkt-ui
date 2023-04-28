import { browser } from '$app/environment';
import { writable, type Readable, type Unsubscriber, type Writable } from 'svelte/store';
import type { OfferPreview } from '@types';

export const isLoading = writable(false);
export const isLoadingMore = writable(false);
export const shouldInfinityScroll = writable(true);

export const offers = writable<OfferPreview[]>([]);
export const homeOffersGotLoaded = writable(false);
export const offersOffset = writable(0);

export const filterSearchString = writable('');
export const filterCategory = writable(0);

export const itemsPerPage = writable(6);

export const indexScrollTop = writable(0);

export const user = writable<string | null>(null);

export const myOffers = writable<Set<number>>(new Set());

export const notification = writable<{
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  duration?: number;
  callback?: () => void;
} | null>(null);

export const FIRST_TIME_VISITOR_STORAGE_KEY = 'firstTimeVisitor';
const localStorageFirstTimeVisitor = (browser && localStorage.getItem(FIRST_TIME_VISITOR_STORAGE_KEY)) || null;
export const firstTimeVisitor = writable<boolean>(localStorageFirstTimeVisitor === null);

export const REACTED_TO_NOTIFICATION_REQUEST_KEY = 'reactedToNotificationRequest';
const localStorageReactedToNotificationRequest = (browser && localStorage.getItem(REACTED_TO_NOTIFICATION_REQUEST_KEY)) || null;
export const reactedToNotificationRequest = writable<boolean>(localStorageReactedToNotificationRequest === 'true');

export function subscribeButSkipFirst<T>(store: Writable<T> | Readable<T>, callback: (value: T) => void): Unsubscriber {
  let first = true;
  return store.subscribe(function (value) {
    if (!first) callback(value);
    first = false;
  });
}
