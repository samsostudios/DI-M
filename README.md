## ss-threejs-starter

A starter project for inetragating three js with Webflow based on Finsweets Developer Starter. This project is NPM based unlike Finsweet's PNPM based starter.

Please review the information below to get started.

## Included tools

This template contains some preconfigured development tools:

- [Typescript](https://www.typescriptlang.org/)
- [Prettier](https://prettier.io/)
- [ESLint](https://eslint.org/)
- [esbuild](https://esbuild.github.io/)
- [Changesets](https://github.com/changesets/changesets)
- [Finsweet's TypeScript Utils](https://github.com/finsweet/ts-utils)

## Getting started

The quickest way to start developing a new project is by [creating a new repository from this template](https://docs.github.com/en/github/creating-cloning-and-archiving-repositories/creating-a-repository-from-a-template#creating-a-repository-from-a-template).

Once the new repository has been created, update the `package.json` file with the correct information, specially the name of the package which has to be unique.

### Installing

After creating the new repository, open it in your terminal and install the packages by running:

```bash
npm install
```

It is also recommended that you install the following extensions in your VSCode editor:

- [Prettier - Code formatter](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)

### Modes

To build the files:

- `npm run build`: Builds to the production directory (`dist`).

To serve index.js to localhost at localhost:3000:

- `npm run dev`: A local server created under `http://localhost:3000`.
