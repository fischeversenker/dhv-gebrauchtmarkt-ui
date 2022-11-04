import doRequest from './do-request';
import DeviceStateStore from './device-state-store';
import SeenOffersStore from './seen-offers-store';

self.PusherPushNotifications = {
  endpointOverride: null,
  onNotificationReceived: null,

  _endpoint: instanceId =>
    self.PusherPushNotifications.endpointOverride
      ? self.PusherPushNotifications.endpointOverride
      : `https://${instanceId}.pushnotifications.pusher.com`,

  _getVisibleClient: () =>
    self.clients
      .matchAll({
        type: 'window',
        includeUncontrolled: true,
      })
      .then(clients => clients.find(c => c.visibilityState === 'visible')),

  _hasVisibleClient: () =>
    self.PusherPushNotifications._getVisibleClient().then(
      client => client !== undefined
    ),

  _getFocusedClient: () =>
    self.clients
      .matchAll({
        type: 'window',
        includeUncontrolled: true,
      })
      .then(clients => clients.find(c => c.focused === true)),

  _hasFocusedClient: () =>
    self.PusherPushNotifications._getFocusedClient().then(
      client => client !== undefined
    ),

  _getState: async pusherMetadata => {
    const {
      instanceId,
      publishId,
      hasDisplayableContent,
      hasData,
    } = pusherMetadata;
    if (!instanceId || !publishId) {
      // Can't report this notification, fail silently.
      return;
    }

    const deviceStateStore = new DeviceStateStore(instanceId);
    await deviceStateStore.connect();

    const deviceId = await deviceStateStore.getDeviceId();
    const userId = (await deviceStateStore.getUserId()) || null;

    const appInBackground = !(await self.PusherPushNotifications._hasVisibleClient());

    return {
      instanceId,
      publishId,
      deviceId,
      userId,
      appInBackground,
      hasDisplayableContent,
      hasData,
    };
  },

  reportEvent: async ({ eventType, state }) => {
    const path = `${self.PusherPushNotifications._endpoint(
      state.instanceId
    )}/reporting_api/v2/instances/${state.instanceId}/events`;

    const options = {
      method: 'POST',
      path,
      body: {
        publishId: state.publishId,
        event: eventType,
        deviceId: state.deviceId,
        userId: state.userId,
        timestampSecs: Math.floor(Date.now() / 1000),
        appInBackground: state.appInBackground,
        hasDisplayableContent: state.hasDisplayableContent,
        hasData: state.hasData,
      },
    };

    try {
      await doRequest(options);
    } catch (_) {
      // Reporting is best effort, so we do nothing.
    }
  },
};

self.addEventListener('push', e => {
  let payload;
  try {
    payload = e.data.json();
  } catch (_) {
    return; // Not a pusher notification
  }

  if (!payload.data || !payload.data.pusher) {
    return; // Not a pusher notification
  }

  const statePromise = self.PusherPushNotifications._getState(
    payload.data.pusher
  );

  statePromise.then(state => {
    // Report analytics event, best effort
    self.PusherPushNotifications.reportEvent({
      eventType: 'delivery',
      state,
    });
  });

  const customerPayload = { ...payload };
  const customerData = {};
  Object.keys(customerPayload.data || {}).forEach(key => {
    if (key !== 'pusher') {
      customerData[key] = customerPayload.data[key];
    }
  });
  customerPayload.data = customerData;

  const pusherMetadata = payload.data.pusher;

  const handleNotification = async payloadFromCallback => {
    const hideNotificationIfSiteHasFocus =
      payloadFromCallback.notification.hide_notification_if_site_has_focus ===
      true;
    if (
      hideNotificationIfSiteHasFocus &&
      (await self.PusherPushNotifications._hasFocusedClient())
    ) {
      return;
    }

    // if new offers have not yet been seen, show notification
    const offerStore = new SeenOffersStore();
    await offerStore.connect();

    const newOffers = [];
    for (const offerId of payloadFromCallback.data.offers) {
      const hasSeenOffer = await offerStore.hasSeenOffer(offerId);
      if (!hasSeenOffer) {
        newOffers.push(offerId);
      }
    }

    if (newOffers.length === 0) {
      return;
    }

    const title = 'DHV Gebrauchtmarkt';
    const body = `Es gibt ${
      newOffers.length === 1 ? '1 neues Angebot' : `${newOffers.length} neue Angebote`
    } im DHV Gebrauchtmarkt`;
    const icon = 'https://www.dhv.de/dbresources/dhv/images/dhvheader2011/dhv_logo.png';
    const deepLink = `https://dhv-gebrauchtmarkt-ui.netlify.app/${
      newOffers.length === 1 ? `offers/${newOffers[0]}` : ''
    }`;

    const options = {
      body,
      icon,
      data: {
        pusher: {
          customerPayload: payloadFromCallback,
          deepLink,
          pusherMetadata,
        },
      },
    };

    return self.registration.showNotification(title, options);
  };

  e.waitUntil(handleNotification(customerPayload));
});

self.addEventListener('notificationclick', e => {
  const { pusher } = e.notification.data;

  const isPusherNotification = pusher !== undefined;
  if (isPusherNotification) {
    const statePromise = self.PusherPushNotifications._getState(
      pusher.pusherMetadata
    );

    // Report analytics event, best effort
    statePromise.then(state => {
      self.PusherPushNotifications.reportEvent({
        eventType: 'open',
        state,
      });
    });

    const deepLink = pusher.deepLink;
    if (deepLink) {
      // if the deep link is already opened, focus the existing window, else open a new window
      const promise = clients
        .matchAll({ includeUncontrolled: true })
        .then(windowClients => {
          const existingWindow = windowClients.find(
            windowClient => windowClient.url === deepLink
          );
          if (existingWindow) {
            return existingWindow.focus();
          } else {
            return clients.openWindow(deepLink);
          }
        });
      e.waitUntil(promise);
    }
    e.notification.close();
  }
});
