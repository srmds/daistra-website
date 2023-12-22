# Daistra website

This repository contains the code base of the daistra website: <https://daistra.com> and <https://daistra.nl>

- Webframework used: [Sveltekit](https://kit.svelte.dev/)
- Deployed as serverless worker on: [Cloudflare](https://www.cloudflare.com/)

**Preqrequisites**

- [nvm](https://github.com/nvm-sh/nvm)
- [Node v20+](https://nodejs.org/en)

## Set up and configure

```bash
$ git clone https://github.com/srmds/daistra-website.git
$ cd daistra-webiste
```

### Developing

Install needed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
$ npm run dev

# or start the server and open the app in a new browser tab
$ npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
$ npm run build
```

You can preview the production build with `npm run preview`.
