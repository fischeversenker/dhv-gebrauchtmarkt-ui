<script lang="ts">
  import { onDestroy, onMount } from 'svelte';
  import type { Unsubscriber } from 'svelte/store';
  import { browser } from '$app/env';
  import { beforeNavigate, afterNavigate } from '$app/navigation';
  import { Client } from "@pusher/push-notifications-web";
  import { debounce } from 'lodash-es';
  import {
    offers,
    filterCategory,
    initialOffersGotLoaded,
    offersOffset,
    filterSearchString,
    subscribeButSkipFirst,
    indexScrollTop,
    notification,
    reactedToNotificationRequest,
    REACTED_TO_NOTIFICATION_REQUEST_KEY
  } from '$lib/store';
  import { getOffers } from '$lib/offers';
  import FilterBar from '$lib/FilterBar.svelte';
  import InifinityLoadingFooter from '$lib/InfinityLoadingFooter.svelte';
  import OfferList from '$lib/OfferList.svelte';

  let unsubscribeSelectedCategory: Unsubscriber;
  let unsubscribeFilterSearchString: Unsubscriber;

  unsubscribeSelectedCategory = subscribeButSkipFirst(filterCategory, async () => {
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
        message: 'Bitte erlaube Benachrichtigungen für diese Seite wenn du über neue Angebote informiert werden ',
        type: 'warning'
      };
      return;
    }

    const beamsClient = new Client({
      instanceId: import.meta.env.VITE_PUSHER_INSTANCE_ID,
    });

    beamsClient.start()
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
    if ($initialOffersGotLoaded) return;
    $offers = await getOffers($offersOffset);
    $initialOffersGotLoaded = true;

    if (!$reactedToNotificationRequest && window.location.search.includes('dev')) {
      $notification = {
            message: '<strong>Experimental Feature:</strong><br>Erhalte Benachrichtigungen wenn es neue Angebote gibt 🔔',
            type: 'info',
            callback: () => subscribeToNewOffers(),
            duration: 10000
          };
    }
  });

  onDestroy(() => {
    unsubscribeSelectedCategory?.();
    unsubscribeFilterSearchString?.();
  });
</script>

<svelte:head>
  <title>Home</title>
</svelte:head>

<template>
  <OfferList offers={$offers} />

  <InifinityLoadingFooter />

  <FilterBar />
</template>
