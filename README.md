# Pixel hero visitor counter

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
4. Redeploy, then open `https://<project>.vercel.app/count.svg`. Each load adds 1.

## Embed
    <picture>
      <source media="(prefers-color-scheme: light)" srcset="https://<project>.vercel.app/count.svg?theme=light">
      <img alt="Visitors" src="https://<project>.vercel.app/count.svg">
    </picture>

## Options
- `?theme=light|dark` (default dark)
- `?peek=1` shows the count without incrementing (use this for previews)
- Env `COUNTER_KEY` changes the Redis key (default `visits`). To start from another number, set that key in Redis.

## Notes
- Counts image loads, not unique people: GitHub proxies images, so visitor IPs are hidden.
- Responses send `no-store` headers so GitHub's image proxy refetches each time.
