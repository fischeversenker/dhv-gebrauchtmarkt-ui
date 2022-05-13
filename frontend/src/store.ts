import { writable } from 'svelte/store';

export const isLoading = writable(false);
export const isLoadingMore = writable(false);

export const offers = writable([]);
export const initialOffersGotLoaded = writable(false);
export const offersOffset = writable(0);

export const filterSearchString = writable('');
export const filterCategory = writable(0);

export const itemsPerPage = writable(6);

export const TILE_VIEW_STORAGE_KEY = 'tileView';
const localStorageTileView = localStorage.getItem(TILE_VIEW_STORAGE_KEY);
export const tileView = writable<boolean>(localStorageTileView === null || localStorageTileView === 'true');
