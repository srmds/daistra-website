# Daistra website

This repository contains the code base of the daistra website: <https://daistra.com> and <https://daistra.nl>

- Webframework used: [Sveltekit](https://kit.svelte.dev/)
- Deployed as serverless worker on: [Cloudflare](https://www.cloudflare.com/)

**Prerequisites**

- [nvm](https://github.com/nvm-sh/nvm)
- [Node v20+](https://nodejs.org/en)

## Set up and configure

```shell
git clone https://github.com/srmds/daistra-website.git && cd daistra-website
```

### Developing

Install needed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```shell
npm run dev
```

Or start the server and open the app in a new browser tab:

```shell
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the _production_ build with:

```bash
npm run preview -- --open
```

The browser will open the preview of the site: http://localhost:4173

## Analytics (Umami)

The site uses [Umami](https://umami.is) (Umami Cloud) for privacy-friendly, cookieless analytics. The tracker is loaded from `src/app.html` and picks the correct website ID from the hostname:

| Domain | Umami website ID |
|--------|------------------|
| `daistra.com` | - |
| `daistra.nl` | `- |

On local development (`localhost`), the **daistra.com** property is used unless you map a `.nl` host in `/etc/hosts`.

Umami collects aggregated usage data (pages, browser, device, city-level location). It does not use analytics cookies or advertising profiles. View reports in the [Umami Cloud](https://cloud.umami.is) dashboard for each property.

Google Analytics is not used on this site.

## Privacy & cookies

A dedicated privacy page explains third-party services and is linked from the site footer.

| Language | URL |
|----------|-----|
| English | `/en/privacy` |
| Dutch | `/nl/privacy` |

Content is defined in `languages/en.json` and `languages/nl.json` (keys prefixed with `privacy_`). The page covers:

- **Umami** — cookieless analytics and what is collected
- **hCaptcha** — spam protection on the contact form (via Web3Forms)
- **Web3Forms** — how contact form submissions are processed
- **GDPR rights** — how visitors can contact Daistra about their data

The page component lives at `src/routes/[lang]/privacy/+page.svelte`.

Visiting `/` redirects to `/en` by default (`src/routes/+page.server.ts`). Use `/nl` for the Dutch homepage.