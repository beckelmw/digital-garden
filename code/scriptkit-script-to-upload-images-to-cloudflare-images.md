---
title: ScriptKit script to upload images to Cloudflare Images
created: 2022-01-20
status: budding
code: /code/scriptkit-script-to-upload-images-to-cloudflare-images
---

```
import "@johnlindquist/kit";

const CLOUDFLARE_ACCOUNT_ID = await env("CLOUDFLARE_ACCOUNT_ID");
const CLOUDFLARE_IMAGES_TOKEN = await env("CLOUDFLARE_IMAGES_TOKEN");
const CLOUDFLARE_API_URL = `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}`;
const formData = await npm("form-data");

// Get the selected images
const files = await getSelectedFile();
const images = files.split("\n").map((filePath) => {
  let extension = path.extname(filePath);
  let originalFileName = path.basename(filePath);
  return {
    name: originalFileName,
    path: filePath,
    type: extension.replace(/^\./, ""),
  };
});

// Get the variants created for your cloudflare images
const variantsResponse = await fetch(
  `${CLOUDFLARE_API_URL}/images/v1/variants`,
  {
    method: "GET",
    headers: {
      Authorization: `Bearer ${CLOUDFLARE_IMAGES_TOKEN}`,
    },
  }
);
const { result } = await variantsResponse.json();
const choices = Object.keys(result.variants).sort((a, b) => (a > b ? 1 : -1));
const variant = await arg("Which variant", choices);

const uploads = [];
for (const { name, path, type } of images) {
  if (["jpeg", "jpg", "png", "webp", "gif"].indexOf(type) === -1) {
    console.warn(`Invalid file. Should be an image file (jpg, png, webp, gif)`);
    continue;
  }

  const file = await readFile(path);
  const form = formData();
  form.append("requireSignedURLs", "false");
  form.append("file", file);

  // Post the image to cloudflare
  const res = await fetch(`${CLOUDFLARE_API_URL}/images/v1`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${CLOUDFLARE_IMAGES_TOKEN}`,
    },
    body: form,
  });
  const { result } = await res.json();
  uploads.push({ result, name });
}

if (!uploads.length) {
  exit(0);
}

// Get markdown for uploaded images
const markdown = uploads
  .map(({ name, result }) => {
    return `![${name}](${result.variants.find((x) =>
      new RegExp(`${variant}$`).test(x)
    )})`;
  });

await copy(markdown.join('\n'));
setHint(`Markdown copied to clipboard!`);
show(
  `<main style="padding:8px">
    <h1>Markdown copied to clipboard!</h1>
    ${markdown.map((i) => "<div>" + i + "</div>").join("\n")}
  </main>`
);
```
