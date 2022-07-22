<script>
  import { getJson, validate } from "./utils";

  export let url;

  let validationErrors;

  async function loadAndValidate(url) {
    const jsonData = await getJson(url);
    // if jsonData doesn't match any schema, errs will be []
    validationErrors = await validate(jsonData);
    return jsonData;
  }

  let promise = loadAndValidate(url);

</script>

{#await promise}
  <slot name="loading">loading...</slot>
{:then jsonData}
  <slot name="element" {jsonData} {validationErrors} />
{:catch error}
  <span class="error">{error.message}</span>
{/await}

<style>
  .error {
    color: red;
  }
</style>
