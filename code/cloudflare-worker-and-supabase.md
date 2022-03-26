---
title: Cloudflare worker and Supabase
created: 2022-03-26
category: code
status: seedling
url: /code/cloudflare-worker-and-supabase
description: How to use supabase from a Cloudflare worker
---

[Supabase](https://supabase.com/) has made it easy to hit your Supabase API from a [Cloudflare worker](https://workers.cloudflare.com/) using their JavaScript package [@supabase/supabase-js](https://github.com/supabase/supabase-js).

Under the hood their library uses cross-fetch which will not work within the Cloudflare worker environment, but they now support a [custom fetch client](https://github.com/supabase/supabase-js#custom-fetch-implementation). In the case of Cloudflare workers, native [fetch](https://developers.cloudflare.com/workers/runtime-apis/fetch/) is already available so no new library is needed.

```javascript
import { createClient } from '@supabase/supabase-js'

// Provide a custom `fetch` implementation as an option
const supabase = createClient('https://xyzcompany.supabase.co', 'your-key', {
  fetch: (...args) => fetch(...args),
})
```

Here is an [example](https://github.com/beckelmw/beckelman.org/blob/main/src/api/analytics.js) where I am using it within one of my projects.