<script>
  import { getJson, validate } from "./utils";

  export let source;
  export let path;
  export let wellAttrs;
  export let validationErrors;

  async function loadAndValidate() {
    console.log("wellAttrs", wellAttrs, wellAttrs.well);
    let imgPath = wellAttrs.well.images[0].path;
    let imgAttrs = await getJson(source + path + "/" + imgPath + "/.zattrs");
    let errs = await validate(imgAttrs);
    return errs;
  }

  let imagePromise = loadAndValidate();
</script>

  <td class={validationErrors.length === 0 ? "valid" : "invalid"}>
    <a title="{path}: Open Well" href="{window.origin}?source={source + path}/">
      {#if validationErrors.length > 0}
        <span title={JSON.stringify(validationErrors)}>O</span>
      {/if}
      {#await imagePromise}
        &nbsp
      {:then imgErrors}
        {imgErrors.length === 0 ? "✓" : "⨯"}
      {/await}
    </a>
  </td>

<style>
  td {
    width: 20px;
    height: 20px;
  }
  td.valid {
    background-color: #eeffee;
  }
  td.invalid {
    background-color: #ffeeee;
  }
  a {
    text-decoration: none;
    color: inherit;
  }
</style>
