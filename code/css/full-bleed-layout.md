---
title: Full bleed layout using css grid
category: code
status: seedling
url: /code/css/full-bleed-layout-using-css-grid
description: Code for creating a full bleed layout using css grid
---

The code below is based off an excellent tutorial by [Josh Comeau](https://www.joshwcomeau.com/css/full-bleed/). You should really go checkout his explanation.

```css
body {
  margin: 0;
}
.wrapper {
  font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
    Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif;
  display: grid;
  grid-template-columns: 1fr min(65ch, calc(100% - 64px)) 1fr;
  column-gap: 32px;
}
.wrapper > * {
  grid-column: 2;
}

.full-bleed {
  width: 100%;
  grid-column: 1/-1;
}
```

- The `calc` within the min function is important in order to avoid a horizontal scroll bar on mobile.
- It is now recommended to use `column-gap` instead of `grid-column-gap` as used in Josh's tutorial.
- The `1/-1` is a neat trick to cover all columns in a row.