<script lang="ts">
  import { browser } from '$app/environment';
  import { afterNavigate, beforeNavigate } from '$app/navigation';
  import FilterBar from '$lib/FilterBar.svelte';
  import InfinityLoadingFooter from '$lib/InfinityLoadingFooter.svelte';
  import OfferList from '$lib/OfferList.svelte';
  import { getOffers } from '$lib/offers';
  import {
    REACTED_TO_NOTIFICATION_REQUEST_KEY,
    filterCategory,
    filterSearchString,
    filterOrder,
    homeOffersGotLoaded,
    indexScrollTop,
    notification,
    offers,
    offersOffset,
    reactedToNotificationRequest,
    shouldInfinityScroll,
    subscribeButSkipFirst
  } from '$lib/store';
  import { Client } from '@pusher/push-notifications-web';
  import { debounce } from 'lodash-es';
  import { onDestroy, onMount } from 'svelte';
  import type { Unsubscriber } from 'svelte/store';

  let unsubscribeSelectedCategory: Unsubscriber;
  let unsubscribeFilterSearchString: Unsubscriber;
  let unsubscribeFilterSorting: Unsubscriber;

  unsubscribeSelectedCategory = subscribeButSkipFirst(filterCategory, async () => {
    if (browser) window.scrollTo({ top: 0, behavior: 'smooth' });
    $offersOffset = 0;
    $offers = await getOffers($offersOffset);
  });

  unsubscribeFilterSorting = subscribeButSkipFirst(filterOrder, async () => {
    if (browser) window.scrollTo({ top: 0, behavior: 'smooth' });
    $offersOffset = 0;
    $offers = await getOffers($offersOffset);
  });

  unsubscribeFilterSearchString = subscribeButSkipFirst(
    filterSearchString,
    debounce(async () => {
      if (browser) window.scrollTo({ top: 0, behavior: 'smooth' });
      $offersOffset = 0;
      $offers = await getOffers($offersOffset);
    }, 500)
  );

  beforeNavigate(() => {
    $indexScrollTop = window.scrollY;
  });

  afterNavigate(() => {
    window.scrollTo({ top: $indexScrollTop });
  });

  function requestNotificationPermissionIfNecessary() {
    return new Promise(function (resolve, reject) {
      const permissionResult = Notification.requestPermission(function (result) {
        resolve(result);
      });

      if (permissionResult) {
        permissionResult.then(resolve, reject);
      }
    }).then(function (permissionResult) {
      if (permissionResult !== 'granted') {
        throw new Error("We weren't granted permission.");
      }
    });
  }

  async function subscribeToNewOffers() {
    reactedToNotificationRequest.update(() => {
      if (browser) localStorage.setItem(REACTED_TO_NOTIFICATION_REQUEST_KEY, 'true');
      return true;
    });

    try {
      await requestNotificationPermissionIfNecessary();
    } catch (e) {
      $notification = {
        message: 'Bitte erlaube Benachrichtigungen für diese Seite wenn du über neue Angebote informiert werden willst.',
        type: 'warning'
      };
      return;
    }

    const beamsClient = new Client({
      instanceId: import.meta.env.VITE_PUSHER_INSTANCE_ID
    });

    beamsClient
      .start()
      .then(() => beamsClient.addDeviceInterest('newOffers'))
      .then(() => {
        $notification = {
          message: 'Du wirst ab jetzt über neue Angebote benachrichtigt',
          type: 'success'
        };
      })
      .catch(console.error);
  }

  onMount(async () => {
    if ($homeOffersGotLoaded) return;

    $offers = await getOffers($offersOffset);
    $homeOffersGotLoaded = true;

    if (!$reactedToNotificationRequest) {
      // TODO: re-activate notifications
      // currently they are switched off because they are annoying
      // and there is no way to stop getting them (except for manually navigating to /stop)
      //   $notification = {
      //     message: 'Erhalte Benachrichtigungen wenn es neue Angebote gibt 🔔<br>Tippe hier!',
      //     type: 'info',
      //     callback: () => subscribeToNewOffers()
      //   };
    }
  });

  onDestroy(() => {
    unsubscribeSelectedCategory?.();
    unsubscribeFilterSearchString?.();
    unsubscribeFilterSorting?.();
  });
</script>

<svelte:head>
  <title>DHV Gebrauchtmarkt 2.0</title>
</svelte:head>

<div>
  <section class="section">
    <OfferList offers={$offers} />
  </section>

  <InfinityLoadingFooter />

  <FilterBar />
</div>

<style>
  .section {
    padding-inline: 0.7rem;
    padding-top: 1.5rem;
  }
</style>
