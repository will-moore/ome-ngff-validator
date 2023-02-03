<script>
  import { VitessceConfig } from "@vitessce/config";

  import ObsmTable from "./ObsmTable.svelte";
  import ObsTable from "./ObsTable.svelte";
  import XTable from "./XTable.svelte";
  import JsonPanel from "./JsonPanel.svelte";

  export let source;
  export let tableAttrs;

  const tables = ["obsm", "var", "X", "obs"];

  // we have separate tables for X and obs so that each
  // can scroll in x-dimension independently, BUT we want
  // to syncronise the scrolling in y -> need JS solution
  let table1;
  let table2;
  let table3;
  function handleScroll(event) {
    if (event.target.id != "scroll1") {
      table1.scrollTop = event.target.scrollTop;
    }
    if (event.target.id != "scroll2") {
      table2.scrollTop = event.target.scrollTop;
    }
    if (event.target.id != "scroll3") {
      table3.scrollTop = event.target.scrollTop;
    }
  }
  let lastSlashIndex = source.lastIndexOf("/tables");
  let imageUrl = source.substring(0, lastSlashIndex);
  console.log("imageUrl", imageUrl);
  const vc = new VitessceConfig({
    schemaVersion: "1.0.15",
    name: "OME-NGFF test",
    description: "Config from ome-ngff-validator",
  });
  const dataset = vc.addDataset("NGFF table demo").addFile({
    url: source,
    fileType: "anndata.zarr",
    coordinationValues: {
      obsType: "cell",
      featureType: "gene",
      featureValueType: "expression",
    },
    options: {
      obsLocations: {
        path: "obsm/spatial",
      },
      obsSets: [
        {
          name: "Cell Type Annotations",
          path: "obs/Cluster",
        },
      ],
      obsFeatureMatrix: {
        path: "X",
      },
    },
  });
  dataset.addFile({
    url: source,
    fileType: "anndata-cells.zarr",
    coordinationValues: {},
    options: {
      xy: "obsm/spatial",
      mappings: {
        UMAP: {
          key: "obsm/X_umap",
          dims: [0, 1],
        }
      },
    },
  });
  // TypeScript complains of no options:{} but Vitessce fails with empty options:{}
  dataset.addFile({
    url: imageUrl,
    fileType: "raster.ome-zarr",
    coordinationValues: {}
  });
  const [
    embeddingTypeScope,
    obsTypeScope,
    featureTypeScope,
    featureValueTypeScope,
    featureValueColormapRangeScope,
    spatialSegmentationLayerScope
  ] = vc.addCoordination(
    "embeddingType",
    "obsType",
    "obsType",
    "featureValueType",
    "featureValueColormapRange",
    "spatialSegmentationLayer"
  );
  // without this, validation fails with "dataPath": ".coordinationSpace.obsType['A']" is null
  // with this, validation fails with "dataPath": ".coordinationSpace.obsType['B']" is null
  obsTypeScope.setValue("cell");
  const v1 = vc.addView(dataset, "spatial", { w: 3, h: 3 });
  const v2 = vc.addView(dataset, "scatterplot", {
    w: 2,
    h: 2
  });
  vc.addView(dataset, "status", {});
  // We want ALL views to be coordinated with each other as much as possible
  v1.useCoordination(obsTypeScope, featureTypeScope, featureValueTypeScope, spatialSegmentationLayerScope);
  v2.useCoordination(embeddingTypeScope);
  const vitessceJson = vc.toJSON();
  console.log(vitessceJson);
  const paramsObj = {
    edit: "false",
    url: `data:,${JSON.stringify(vitessceJson)}`,
  };
  const searchParams = new URLSearchParams(paramsObj).toString();
</script>

<article>
  <!-- code blocks for JSON for the table itself and the required 'obs' group -->
  <div>
    <a target="_blank" href="http://vitessce.io?{searchParams}">Vitessce</a>
    <div class="zattrs grey">
      <details>
        <summary>table/.zattrs</summary>
        <pre><code>{JSON.stringify(tableAttrs, null, 2)}</code></pre>
      </details>
    </div>

    {#each tables as name}
      <div class="zattrs {name}">
        <JsonPanel title={name + "/.zattrs"} url={source + name + "/.zattrs"} />
      </div>
    {/each}
  </div>

  <div class="tablesContainer">
    <!-- 3 tables side by side -->
    <!-- First: obsData. TODO: does it always exist? -->
    <div
      class="tableScroller sideTable"
      id="scroll3"
      on:scroll={handleScroll}
      bind:this={table3}
    >
      <ObsmTable {source} />
    </div>

    <div
      id="scroll1"
      class="tableScroller"
      on:scroll={handleScroll}
      bind:this={table1}
    >
      <XTable {source} />
    </div>

    <div
      class="tableScroller sideTable"
      id="scroll2"
      on:scroll={handleScroll}
      bind:this={table2}
    >
      <ObsTable {source} />
    </div>
  </div>
</article>

<style>
  article {
    display: flex;
    flex-direction: column;
  }

  article > div {
    flex: 0;
  }

  .tablesContainer {
    flex: 1;
    position: relative;
    width: 100%;
    display: flex;
    flex-direction: row;
    overflow-y: auto;
  }

  .tableScroller {
    overflow: auto;
    flex: 1;
  }
  .sideTable {
    flex: 0.5;
  }

  article {
    text-align: left;
  }

  @media (min-width: 0) {
    article {
      width: 100%;
      height: calc(100% - 100px);
    }
  }

  .zattrs {
    margin: 5px 10px 10px 0;
    width: max-content;
    padding: 10px;
    border-radius: 5px;
    float: left;
  }

  .grey {
    background-color: #ccc;
  }

  .obs {
    background-color: rgb(238, 195, 54);
  }
  .var {
    background-color: rgb(51, 151, 190);
  }

  .obsm {
    background-color: rgb(237, 144, 50);
  }

  .X {
    background-color: rgb(84, 185, 114);
  }

  pre {
    color: #faebd7;
    background-color: #2c3e50;
    padding: 10px;
    font-size: 14px;
  }
</style>
