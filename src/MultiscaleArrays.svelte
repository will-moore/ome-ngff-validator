<script>
  import Icon from "svelte-icons-pack/Icon.svelte";
  import BsCaretRightFill from "svelte-icons-pack/bs/BsCaretRightFill";

  import JsonLoader from "./JsonLoader.svelte";
  import ZarrArray from "./ZarrArray.svelte";

  export let source;
  export let rootAttrs;

  let expanded = false;
  function toggle() {
    expanded = !expanded;
  }
</script>

{#each rootAttrs.multiscales as multiscale, idx}
  <article>
    <div class="{expanded ? 'expanded' : ''} caret" on:click={toggle}>
      <Icon className="caret-toggle" src={BsCaretRightFill} />
    </div>
    <h2>Multiscale {idx}</h2>
    {#if expanded}
      {#each multiscale.datasets as dataset}
        <JsonLoader let:jsonData url={source + dataset.path + "/.zarray"}>
          <ZarrArray slot="element" {jsonData} {source} path={dataset.path} />
        </JsonLoader>
      {/each}
    {:else}
      ({multiscale.datasets.length} Datasets)
    {/if}
  </article>
{/each}

<style>
  h2 {
    font-weight: 300;
  }
  article {
    text-align: left;
  }
  .caret {
    float: left;
    margin: 6px 6px 6px 0;
  }
</style>
