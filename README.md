# 3Knotts

Next.js App Router site for 3Knotts, Chennai.
Tagline: "Your Celebration, Our Creation."

## Quick start

1. `npm install`
2. Copy `.env.example` to `.env.local` and fill values.
3. `npm run dev` - http://localhost:3000
4. `npm run build` then `npm run start` to verify production.

## Adding a service (one-line change)

Edit the `services` array at the top of `data/site.js` and append one object:

```js
{ slug: "my-new-service", title: "My New Service", blurb: "One line.", icon: "gift", image: "/random.jpg", details: ["..."], whyUs: ["..."] },
```

Everything (home, services page, detail page + sitemap entry, work grid, footer) renders from `data/site.js` - the single source of truth.

## Media (fullstack)

Delivery (what visitors see): all media paths live in `data/site.js`.
URLs are built by `lib/media.js` from `NEXT_PUBLIC_MEDIA_URL`.

- ImageKit now: `NEXT_PUBLIC_MEDIA_URL=https://ik.imagekit.io/YOUR_IMAGEKIT_ID`
- Self-hosted later: `NEXT_PUBLIC_MEDIA_URL=https://media.yourdomain.com`

Keep the folder `3knotts/videos/...` and `3knotts/images/...` identical in both places.

Management (uploads/deletes): `lib/imagekit.js` is server-only and uses
`IMAGEKIT_PRIVATE_KEY` from env (never `NEXT_PUBLIC_`, never committed -
`.env.local` is gitignored). `IMAGEKIT_PUBLIC_KEY` is optional and is returned
only for clients that use the direct-upload authentication endpoint.

- `POST /api/media/sign` with `{ folder }` returns short-lived ImageKit
  authentication parameters for direct browser uploads.
  Folders are locked inside `3knotts/`.
- Set `UPLOAD_TOKEN` env to gate the endpoint with an `x-upload-token` header.
- The admin upload route converts images to WebP before uploading them to
  ImageKit. Uploaded file ids are stored with their paths so deletes remain
  reliable; older path-only records are resolved through ImageKit before
  deletion.

## Enquiry email (Web3Forms)

Dashboard -> Email: paste the free access key created with the client's
inbox at https://web3forms.com, Save, then "Send test email". While a
key is on file, every enquiry is emailed automatically. Submissions go
from the visitor's browser (Web3Forms' edge accepts browser traffic
only on the free plan); the server just stores the key and composes
the payloads - the key is public-grade by Web3Forms design: it can
only send INTO that inbox, nothing more. Email failures never lose an
enquiry - the dashboard always keeps it. Key preview is masked in the
admin API.

The same Email tab also stores the business Gmail address: it shows up
as a Gmail row (mailto link) in the Enquiry page's contact panel, and
an empty value hides the row.

## Replace placeholders

- Logo: `public/logo.jpg` (+ `app/icon.jpg` favicon copy). Already using the real logo.
- `data/site.js` - `hero` + `work` entries marked PLACEHOLDER.
- Footer - `BUSINESS-HOURS-PLACEHOLDER` block (business hours to be added later).

## Coolify

- Same env vars as `.env.example`.
- Keep Atlas, or add a Coolify MongoDB service and point `MONGODB_URI` at it.
- `nixpacks.toml` handles build/start. No Dockerfile.
- For self-hosted media, attach a persistent volume and set `NEXT_PUBLIC_MEDIA_URL` to that host.
