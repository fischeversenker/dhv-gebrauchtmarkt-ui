<script lang="ts">
  import { filterCategory, filterSearchString } from "../store";

  let categories = [
    {
      value: 0,
      label: 'Alle',
    },
    {
      value: 1,
      label: 'Gleitschirme',
    },
    {
      value: 11,
      label: 'Gurtzeuge',
    },
    {
      value: 4,
      label: 'Retter',
    }
  ];
</script>


<main>
  <nav class="level is-mobile has-background-light m-0 px-5 py-4 category-select">
    <div class="level-item">
      <p class="control has-icons-left">
        <input class="input" type="search" placeholder="Search..." bind:value={$filterSearchString} />
        <span class="icon is-small is-left">
          <i class="fas fa-search"></i>
        </span>
      </p>
    </div>
    <div class="level-item">
      <div class="select">
        <select on:change={(event) => $filterCategory = Number(event.currentTarget.value)}>
          {#each categories as category}
            <option value={category.value}>{category.label}</option>
          {/each}
        </select>
      </div>
  </nav>
</main>


<style>
  .category-select {
    position: fixed;
    bottom: 0;
    width: 100%;
  }
</style>
