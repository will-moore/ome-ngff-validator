<script>
  import JsonLoader from "./JsonLoader.svelte";
  import ZarrArray from "./ZarrArray.svelte";

  export let source;
  export let rootAttrs;
</script>

{#each rootAttrs.multiscales as multiscale, idx}
  <article>
    <h2>Dataset {idx}</h2>
    {#each multiscale.datasets as dataset}
      <JsonLoader let:jsonData url={source + dataset.path + "/.zarray"}>
        <ZarrArray slot="element" {jsonData} {source} path={dataset.path} />
      </JsonLoader>
    {/each}
  </article>
{/each}

<style>
  h2 {
    font-weight: 300;
  }
  article {
    text-align: left;
  }
</style>
