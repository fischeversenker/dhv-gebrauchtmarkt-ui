import { browser } from '$app/env';

let db: IDBDatabase | null = null;

export function connectToIndexedDb() {
  if (!browser) {
    return;
  }

  return new Promise<void>((resolve, reject) => {
    const request = indexedDB.open('offersDatabase', 2);

    request.onsuccess = function(event: Event) {
      db = request.result;
      resolve();
    };
    request.onerror = function() {
      console.warn(`couldn't connect to IndexedDB`, request.error);
      reject(request.error);
    };
    request.onupgradeneeded = function(event) {
      db = (event as any).target.result;
      const existingStores = Array.from(db?.objectStoreNames || []);
      if (!existingStores.includes('seenOfferPreviews')) {
        db?.createObjectStore('seenOfferPreviews', { keyPath: 'id' })
      }
      if (!existingStores.includes('pendingNotifications')) {
        db?.createObjectStore('pendingNotifications', { keyPath: 'id' })
      }
      resolve();
    };
  });
}

export function addSeenOffer(offerIds: number[]) {
  if (!db) {
    throw new Error('not connected to indexedDB');
  }

  const transaction = db.transaction('seenOfferPreviews', 'readwrite');

  const store = transaction.objectStore('seenOfferPreviews');
  offerIds.forEach(offerId => {
    const request = store.put({ id: offerId });
    request.onerror = e => console.warn('could not add offer', offerId, e);
  });
}

export function clearPendingNotifications() {
  if (!db) {
    throw new Error('not connected to indexedDB');
  }

  const transaction = db.transaction('pendingNotifications', 'readwrite');

  const request = transaction.objectStore('pendingNotifications').clear();
  request.onerror = e => console.warn('could not clear pendingNotifications', e);
}
