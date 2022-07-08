<script>
  import { getJson } from "./utils";

  export let url;

  const promise = getJson(url);
</script>

{#await promise}
  <slot name="loading">loading...</slot>
{:then jsonData}
  <slot name="element" {jsonData} />
{:catch error}
  <span class="error">{error.message}</span>
{/await}

<style>
  .error {
    color: red;
  }
</style>
