<script lang="ts">
  import { derived } from 'svelte/store';
  import { fade } from 'svelte/transition';
  import { filterCategory, filterOrder, filterSearchString } from './store';

  let showCategorySelect = false;
  let showOrderSelect = false;

  const categoryOptions = [
    {
      value: 0,
      label: 'Alles'
    },
    {
      value: 1,
      label: 'Nur Gleitschirme'
    },
    {
      value: 11,
      label: 'Nur Gurtzeuge'
    },
    {
      value: 4,
      label: 'Nur Retter'
    },
    {
      value: 5,
      label: 'Nur Zubehör'
    },
    {
      value: 13,
      label: 'Nur Sonstiges'
    }
  ];

  const orderOptions = [
    {
      value: 1,
      label: 'Datum: Neuestes zuerst'
    },
    {
      value: 2,
      label: 'Preis: Niedrigster zuerst'
    },
    {
      value: 3,
      label: 'Preis: Höchster zuerst'
    }
  ];

  const allFiltersInDefault = derived([filterCategory, filterOrder, filterSearchString], ([category, order, searchString]) => {
    return category === categoryOptions[0].value && order === orderOptions[0].value && searchString === '';
  });

  function onCategoryClicked(category: number) {
    $filterCategory = category;
    showCategorySelect = false;
  }

  function onOrderClicked(order: number) {
    $filterOrder = order;
    showOrderSelect = false;
  }

  function onResetClicked() {
    $filterSearchString = '';
    $filterCategory = 0;
    $filterOrder = 1;
  }
</script>

<nav class="is-flex is-justify-content-space-between has-background-light m-0 px-2 py-2 category-select">
  <div class="control has-icons-left is-flex-grow-1">
    <input class="input" type="search" placeholder="Suche..." bind:value={$filterSearchString} />
    <span class="icon is-small is-left">
      <i class="fas fa-search" />
    </span>
  </div>

  <div class="buttons has-addons mb-0">
    <button class="button mb-0" class:is-info={$filterCategory !== 0} on:click={() => (showCategorySelect = true)}>
      <span class="icon"><i class="fa-solid fa-chart-pie" /></span>
    </button>

    <button class="button mb-0" class:is-info={$filterOrder !== 1} on:click={() => (showOrderSelect = true)}>
      <span class="icon"><i class="fa-solid fa-arrow-down-up-across-line" /></span>
    </button>
  </div>

  <button class="button is-warning" disabled={$allFiltersInDefault} on:click={() => onResetClicked()}>
    <span class="icon"><i class="fa-sharp fa-solid fa-xmark" /></span>
  </button>
</nav>

{#if showCategorySelect}
  <div class="modal is-active" transition:fade={{ duration: 100 }}>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div class="modal-background" on:click={() => (showCategorySelect = false)} />
    <div class="modal-content">
      <div class="box">
        {#each categoryOptions as category}
          <button
            class="button mb-1 is-fullwidth"
            class:is-info={$filterCategory === category.value}
            on:click={() => onCategoryClicked(category.value)}
            >{category.label}
          </button>
        {/each}
      </div>
    </div>
    <button class="modal-close is-large" aria-label="close" on:click={() => (showCategorySelect = false)} />
  </div>
{/if}

{#if showOrderSelect}
  <div class="modal is-active" transition:fade={{ duration: 100 }}>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div class="modal-background" on:click={() => (showOrderSelect = false)} />
    <div class="modal-content">
      <div class="box">
        {#each orderOptions as sortingOption}
          <button
            class="button mb-1 is-fullwidth"
            class:is-info={$filterOrder === sortingOption.value}
            on:click={() => onOrderClicked(sortingOption.value)}
            >{sortingOption.label}
          </button>
        {/each}
      </div>
    </div>
    <button class="modal-close is-large" aria-label="close" on:click={() => (showOrderSelect = false)} />
  </div>
{/if}

<style>
  .category-select {
    position: fixed;
    bottom: 0;
    width: 100%;
    gap: 0.3rem;
    max-width: 800px;
  }
</style>
