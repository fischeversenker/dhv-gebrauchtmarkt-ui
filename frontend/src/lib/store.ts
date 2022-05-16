import { browser } from '$app/env';
import { writable } from 'svelte/store';
import type { Offer } from './offers';

export const isLoading = writable(false);
export const isLoadingMore = writable(false);

export const offers = writable<Offer[]>([]);
export const initialOffersGotLoaded = writable(false);
export const offersOffset = writable(0);

export const filterSearchString = writable('');
export const filterCategory = writable(0);

export const itemsPerPage = writable(6);

export const TILE_VIEW_STORAGE_KEY = 'tileView';
const localStorageTileView = (browser && localStorage.getItem(TILE_VIEW_STORAGE_KEY)) || false;
export const tileView = writable<boolean>(
  localStorageTileView === null || localStorageTileView === 'true'
);
