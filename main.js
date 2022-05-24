import "./style.css";

import Ajv from "ajv";

const ajv = new Ajv({ strict: false }); // options can be passed, e.g. {allErrors: true}

const sample_images_url =
  "https://raw.githubusercontent.com/ome/blog/master/_data/zarr_data_2020-11-04.json";

async function getJson(url) {
  return fetch(url).then((rsp) => rsp.json());
}

function log(text) {
  const el = document.createElement("pre");
  el.innerHTML = text;
  document.getElementById("app").appendChild(el);
}

function logJson(data) {
  log(JSON.stringify(data, null, 2));
}

let schemas = {};

async function getSchema(version) {
  if (!schemas[version]) {
    const schema_url = `https://raw.githubusercontent.com/ome/ngff/main/${version}/schemas/image.schema`;
    log("Loading schema... " + schema_url);
    const schema = await getJson(schema_url);
    // delete to avoid invalid: $schema: "https://json-schema.org/draft/2020-12/schema" not found
    delete schema["$schema"];
    schemas[version] = schema;
  }
  return schemas[version];
}


(async function () {
  // Run this on page load...
  const searchParams = new URLSearchParams(window.location.search);
  let source = searchParams.get("source");
  if (!source) {
    alert(
      "Use e.g. ?source=https://uk1s3.embassy.ebi.ac.uk/idr/zarr/v0.3/9836842.zarr to load OME-NGFF"
    );
  }
  if (!source.endsWith("/")) {
    source = source + "/";
  }

  // load JSON to be validated...
  log("Loading JSON... " + source + ".zattrs");
  const data = await getJson(source + ".zattrs");
  console.log("data", data);
  if (!data.multiscales) {
    log("No 'multiscales' found")
  }
  const version = data.multiscales[0].version;
  if (!version) {
    log("No 'multiscales[0].version' found")
  }
  log("OME-NGFF multiscales version: " + version);

  // load Schema - correct version
  const schema = await getSchema(version);
  console.log(schema);
  const validate = ajv.compile(schema);

  // Validate...
  log("Validating " + source);
  const valid = validate(data);
  console.log("valid", valid);
  if (valid) {
    log("Valid!")
  } else {
    log("NOT VALID!")
    validate.errors.forEach(error => logJson(error))
  }

})();