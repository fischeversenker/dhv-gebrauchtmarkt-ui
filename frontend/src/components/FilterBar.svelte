<script lang="ts">
  import { filterCategory, filterSearchString } from "../store";

  let categories = [
    {
      value: 0,
      label: '🌐 Alles',
    },
    {
      value: 1,
      label: '🪂 Gleitschirme',
    },
    {
      value: 11,
      label: '💺 Gurtzeuge',
    },
    {
      value: 4,
      label: '⛑️ Retter',
    },
    {
      value: 5,
      label: '📳 Zubehör',
    },
    {
      value: 13,
      label: '❔ Sonstiges',
    }
  ];
</script>


<template>
  <nav class="is-flex is-justify-content-space-between has-background-light m-0 px-5 py-4 category-select">
    <div class="control has-icons-left is-flex-grow-1">
      <input class="input" type="search" placeholder="Suche..." bind:value={$filterSearchString} />
      <span class="icon is-small is-left">
        <i class="fas fa-search"></i>
      </span>
    </div>
    <div class="control">
      <div class="select">
        <select on:change={(event) => $filterCategory = Number(event.currentTarget.value)}>
          {#each categories as category}
            <option value={category.value}>{category.label}</option>
          {/each}
        </select>
      </div>
    </div>
  </nav>
</template>


<style>
  .category-select {
    position: fixed;
    bottom: 0;
    width: 100%;
    gap: 1rem;
  }
</style>
