import { browser } from '$app/env';
import { writable, type Readable, type Unsubscriber, type Writable } from 'svelte/store';
import type { OfferPreview } from '@types';

export const isLoading = writable(false);
export const isLoadingMore = writable(false);

export const offers = writable<OfferPreview[]>([]);
export const initialOffersGotLoaded = writable(false);
export const offersOffset = writable(0);

export const filterSearchString = writable('');
export const filterCategory = writable(0);

export const itemsPerPage = writable(6);

export const indexScrollTop = writable(0);

export const notification = writable<{ type: 'success' | 'error', message: string, duration?: number, callback?: () => void } | null>(null);

export const TILE_VIEW_STORAGE_KEY = 'tileView';
const localStorageTileView = (browser && localStorage.getItem(TILE_VIEW_STORAGE_KEY)) || false;
export const tileView = writable<boolean>(
  localStorageTileView === null || localStorageTileView === 'true'
);

export const FIRST_TIME_VISITOR_STORAGE_KEY = 'firstTimeVisitor';
const localStorageFirstTimeVisitor = (browser && localStorage.getItem(FIRST_TIME_VISITOR_STORAGE_KEY)) || null;
export const firstTimeVisitor = writable<boolean>(localStorageFirstTimeVisitor === null);

export function subscribeButSkipFirst<T>(
  store: Writable<T> | Readable<T>,
  callback: (value: T) => void
): Unsubscriber {
  let first = true;
  return store.subscribe(function (value) {
    if (!first) callback(value);
    first = false;
  });
}
