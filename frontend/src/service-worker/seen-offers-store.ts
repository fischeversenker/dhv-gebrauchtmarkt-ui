export default class SeenOffersStore {
  constructor() {
    this._dbConn = null;
  }

  get isConnected() {
    return this._dbConn !== null;
  }

  connect() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('offersDatabase');

      request.onsuccess = event => {
        const db = event.target.result;
        this._dbConn = db;
        resolve(null);
      };

      request.onupgradeneeded = event => {
        const db = event.target.result;
        db.createObjectStore('seenOfferPreviews', {
          keyPath: 'id',
        });
      };

      request.onerror = event => {
        const error = new Error(`Database error: ${event.target.error}`);
        reject(error);
      };
    });
  }

  #getOffer(offerId: number) {
    if (!this.isConnected) {
      throw new Error(
        'Cannot read value: SeenOfferStore not connected to IndexedDB'
      );
    }

    return new Promise((resolve, reject) => {
      const request = this._dbConn
        .transaction('seenOfferPreviews')
        .objectStore('seenOfferPreviews')
        .get(offerId);

      request.onsuccess = event => {
        const state = event.target.result;
        resolve(state);
      };

      request.onerror = event => {
        reject(event.target.error);
      };
    });
  }

  async hasSeenOffer(offerId) {
    const offer = await this.#getOffer(offerId);
    if (!offer) {
      return false;
    }
    return true;
  }
}
