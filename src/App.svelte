<script>
  import Nav from "./Nav.svelte";
  import JsonValidator from "./JsonValidator.svelte";

  import { getJson } from "./utils";

  const searchParams = new URLSearchParams(window.location.search);
  let source = searchParams.get("source");
  if (source && !source.endsWith("/")) {
    source = source + "/";
  }

  // load JSON to be validated...
  console.log("Loading JSON... " + source + ".zattrs");
  const promise = getJson(source + ".zattrs");

  const dirs = source.split("/").filter(Boolean);
  const zarrName = dirs[dirs.length - 1];
</script>

<main>
  <nav>
    <Nav />
  </nav>
  <section>
    <h1>{zarrName}</h1>
    <div>
      {#if source}
        {#await promise}
          <p>loading...</p>
        {:then data}
          <JsonValidator rootAttrs={data} {source} />
        {:catch error}
          <p style="color: red">{error.message}</p>
        {/await}
      {:else}
        Use e.g.
        ?source=https://uk1s3.embassy.ebi.ac.uk/idr/zarr/v0.3/9836842.zarr
      {/if}
    </div>
  </section>
</main>

<style>
  main {
    display: flex;
    flex-direction: column;
    height: 100%;
  }
  nav {
    display: block;
    margin: 0;
    padding: 0;
    flex: 0 0 48px;
    background-color: #343a40;
  }

  h1 {
    font-weight: 300;
    font-size: clamp(2rem, 6vw, 3.5rem);
    text-align: center;
    color: #343a40;
  }

  section {
    overflow: auto;
    width: 100%;
    flex: 1;
    padding: 15px 0;
    background: #ff512f; /* fallback for old browsers */
    background: -webkit-linear-gradient(
      to right,
      #f09819,
      #ff512f
    ); /* Chrome 10-25, Safari 5.1-6 */
    background: linear-gradient(
      to right,
      #f09819,
      #ff512f
    ); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
    /* https://uigradients.com/ */
    /* OME green->blue rgb(61,132,107), rgb(68,139,200) */
  }

  section > div {
    margin: auto;
    width: clamp(300px, 95%, 1200px);
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    gap: 20px;
  }

  @media (min-width: 1000px) {
    section > div {
      flex-direction: row;
    }
  }
</style>
