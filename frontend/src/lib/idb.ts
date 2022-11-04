  import { browser } from '$app/env';
// save each offer in indexedDB

let db: IDBDatabase | null = null;

export function connect() {
  if (!browser) {
    return;
  }

  const request = indexedDB.open('offersDatabase');

  request.onsuccess = function(event: Event) {
    db = request.result;
  };
  request.onerror = function() {
    console.warn(`couldn't connect to IndexedDB`, request.error);
  };
  request.onupgradeneeded = function(event) {
    db = (event as any).target.result;
    db?.createObjectStore('seenOfferPreviews', { keyPath: 'id' })
  };
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
