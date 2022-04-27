import { writable } from 'svelte/store';

export const isLoading = writable(false);
export const isLoadingMore = writable(false);

export const selectedCategory = writable(0);

export const offers = writable([]);
