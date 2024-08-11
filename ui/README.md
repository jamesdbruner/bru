# bru ui

This workspace serves as the UI layer for running mods in the `../modules`
directory. It provides an interactive UI that allows users to run and manage
Deno modules.

## Getting Started

From where you cloned bru you can cd into the ui directory and install the
dependencies

```bash
cd ui; pnpm i
```

From the root bru directory, once the deps are installed you can simply run

```bash
deno task ui
```

This command will start the backend server and the frontend development server
and you can navigate to localhost:3000 in your browser of choice

## Acknowledgements

- Vite Starter template: [Vital](https://vital.josepvidal.dev/)
- Components: [Headless UI](https://headlessui.com/)
- Icons: [Heroicons](https://heroicons.com/)
