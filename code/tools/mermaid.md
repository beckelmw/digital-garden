---
title: mermaidjs
category: code
status: seedling
url: /code/tools/mermaid
description: Notes on using mermaidjs
---


## State diagram

```mermaid
---
title: Simple sample
---
stateDiagram-v2
    [*] --> Still
    Still --> [*]

    Still --> Moving
    Moving --> Still
    Moving --> Crash
    Crash --> [*]
```
