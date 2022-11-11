export default class SeenOffersStore {
  private dbConn: null | IDBDatabase = null;

  get isConnected() {
    return this.dbConn !== null;
  }

  connect() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('offersDatabase');

      request.onsuccess = () => {
        const db = request.result;
        this.dbConn = db;
        resolve(null);
      };

      request.onupgradeneeded = () => {
        const db = request.result;
        db.createObjectStore('seenOfferPreviews', {
          keyPath: 'id',
        });
        db.createObjectStore('pendingNotifications', {
          keyPath: 'id'
        });
      };

      request.onerror = () => {
        const error = new Error(`Database error: ${request.error}`);
        reject(error);
      };
    });
  }

   private getOffer(offerId: number) {
    return new Promise((resolve, reject) => {
      if (!this.dbConn) {
        reject('No IDB connection!');
        return;
      }

      const request = this.dbConn
        .transaction('seenOfferPreviews')
        .objectStore('seenOfferPreviews')
        .get(offerId);

      request.onsuccess = () => {
        const state = request.result;
        resolve(state);
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  }

  async hasSeenOffer(offerId: number) {
    const offer = await this.getOffer(offerId);
    if (!offer) {
      return false;
    }
    return true;
  }

  async addPendingNotification(offerId: number) {
    const transaction = this.dbConn?.transaction('pendingNotifications', 'readwrite');

    if (!transaction) {
      throw new Error('No IDB connection!');
    }

    const store = transaction.objectStore('pendingNotifications');
    const request = store.put({ id: offerId });
    request.onerror = e => console.warn('could not add pending notifications', offerId, e);
  }

  async hasPendingNotification(offerId: number) {
    return new Promise((resolve, reject) => {
      if (!this.dbConn) {
        reject('No IDB connection!');
        return;
      }

      const request = this.dbConn
        .transaction('pendingNotifications')
        .objectStore('pendingNotifications')
        .get(offerId);

      request.onsuccess = () => {
        const state = request.result;
        resolve(state);
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  }
}
