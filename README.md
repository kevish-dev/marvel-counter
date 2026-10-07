# HeroCount: pixel hero visitor counter

A 7-digit visitor counter for a GitHub profile. Seven original pixel-art heroes each hold a sign with one digit,
with small CSS animations. Served as an SVG from a Vercel function; the count lives in Upstash Redis.

## Local preview
    node preview.mjs      # writes out/*.svg and out/index.html
    PORT=3000 node dev.mjs  # http://localhost:3000/count.svg (in-memory count)

## Deploy (Vercel + Upstash Redis)
1. Create a free Redis database at https://console.upstash.com (or Vercel dashboard > Storage > Upstash Redis).
2. Push this folder to a GitHub repo and import it at https://vercel.com/new
   (or `npm i -g vercel && vercel` from this folder).
3. Add environment variables in the Vercel project (Settings > Environment Variables):
   - `UPSTASH_REDIS_REST_URL`
   - `UPSTASH_REDIS_REST_TOKEN`
   (The Vercel Storage integration adds `KV_REST_API_URL` / `KV_REST_API_TOKEN`, which also work.)
4. Redeploy, then open `https://herocount.kevish.dev/count.svg`. Each load adds 1.

## Embed
    <picture>
      <source media="(prefers-color-scheme: light)" srcset="https://herocount.kevish.dev/count.svg?theme=light">
      <img alt="Visitors" src="https://herocount.kevish.dev/count.svg">
    </picture>

## Options
- `?theme=light|dark` (default dark)
- `?peek=1` shows the count without incrementing (use this for previews)
- Env `COUNTER_KEY` changes the Redis key (default `visits`). To start from another number, set that key in Redis.

## Notes
- Counts image loads, not unique people: GitHub proxies images, so visitor IPs are hidden.
- Responses send `no-store` headers so GitHub's image proxy refetches each time.

## What it does

| URL | What you get |
|---|---|
| `/c/<id>.svg` | The animated counter. +1 per view. Options below. |
| `/c/<id>.badge.svg` | A small shields-style badge that counts the same way. |
| `/c/<id>.json` | `{ id, count, created, claimed, by }`. Read-only, CORS open. |
| `/c/<id>.shields.json` | Shields.io endpoint schema. Read-only. |
| `/preview.svg` | Stateless sample for the generator (same options, plus `n=`). |
| `/api/heroes` | Every hero: id, label, pack, trick. |
| `/dashboard` | Stats (30 days, referrers) and reset / rotate key / delete, with your edit key. |
| `/integrations` | Snippets for GitHub, GitLab, Notion, Dev.to, Hashnode, websites, React. |

### Image options

`theme` dark, light, auto, clear | `digits` 3 to 9 | `format` plain, sep (1,234), compact (1.2K) |
`pack` classic, marvel, retro, critters | `heroes` comma list, e.g. `thor,groot,cat` | `since=1` adds "since oct 2026" |
`milestone=0` turns off confetti at 100 / 1,000 / 10,000 views and so on | `peek=1` reads without counting.

### Edit keys

`POST /api/create {"id"}` returns a one-time `key`. The server stores only its SHA-256. The key unlocks `POST /api/manage`
(`stats`, `reset`, `rotate`, `delete`). Ids that predate keys can be claimed once with `{"id", "action":"claim"}`; `kevish-dev` is reserved.

### Counting rules

Crawlers, link previews, HEAD requests and `peek=1` do not count. One IP can add at most 120 views a minute to one counter.
GitHub strips referrers, so the referrer list is mostly useful for embeds on your own site.

### Admin

Set `ADMIN_TOKEN` on the deployment, then open `/admin` or call `GET /api/admin` with `Authorization: Bearer <token>`.

### GitHub Action (visitor count as text)

```yaml
- uses: kevish-dev/marvel-counter@main
  with:
    id: your-id
    template: "{count} ({compact})"
```

Put `<!-- herocount:start -->0<!-- herocount:end -->` in your README where the number should go.

## Tests

`node --test test/herocount.test.mjs test/features.test.mjs`

## License

HeroCount is **source-available, not open source**. See [LICENSE](LICENSE).

- Using the hosted service (herocount.kevish.dev) and embedding its images: free. The "by kevish.dev" credit is part of every image and must stay visible.
- Self-hosting or modifying this code: 7-day evaluation, then you need a written license. Ask at https://kevish.dev.
- The credit must be kept in every use, including licensed ones.

The pixel figures are fan-made tributes and are not affiliated with Marvel.

### Self-hosting and license keys

The server checks its license on every request (`src/license.js`):

1. **Official deployment** (this repo's Vercel project): always allowed.
2. **Valid key:** set `HEROCOUNT_LICENSE_KEY` to the key you received. Keys are signed (Ed25519) and name the licensee. Without a valid signature a key is ignored.
3. **Otherwise:** a 7-day evaluation starts at the first request the copy serves. Responses carry `X-HeroCount-License: trial; N d left`. After that, counters, the API and previews answer `402` with a "license required" notice.

The credit is never turned off by a key.

Licensor only: `node scripts/issue-license.mjs --to "Licensee" [--days 365]` signs a key with the private key in `~/.herocount/license-private.pem` (never commit it).
