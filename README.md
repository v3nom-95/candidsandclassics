# React + TypeScript + Vite

## Portfolio Sheets

The Portfolio menu includes Weddings, Wedding Films, Kids Photography, and Everyday Joys. Each section reads its own published Google Sheets CSV. Configure the published CSV URLs in `src/lib/data.ts`.

Create one sheet per category with a header row, then one row per session or film:

- Weddings: `Client Name, Photo 1, Photo 2, Photo 3...`
- Kids Photography: `Client Name, Photo 1, Photo 2, Photo 3...` (the supplied sheet is connected)
- Everyday Joys: `Client Name, Photo 1, Photo 2, Photo 3...`
- Wedding Films: `Title, YouTube URL, Description` (the supplied Movies sheet is connected)

Photo cells should contain public image URLs or public Google Drive file links. Film rows should contain a YouTube watch/share URL. The homepage hero always uses the existing YouTube video `ueuj4cmeLzI`; the Movies sheet's `Background MP4 URL` column, if present, is ignored.

Publish each sheet to the web as CSV, then set its exported CSV URL in `PORTFOLIO_SHEET_CSV_URLS` or `WEDDING_FILMS_SHEET_CSV_URL` in `src/lib/data.ts`. The homepage and portfolio pages show no sample content when a sheet is empty or not configured.

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend enabling type-aware lint rules by installing `oxlint-tsgolint` and editing `.oxlintrc.json`:

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["react", "typescript", "oxc"],
  "options": {
    "typeAware": true
  },
  "rules": {
    "react/rules-of-hooks": "error",
    "react/only-export-components": ["warn", { "allowConstantExport": true }]
  }
}
```

See the [Oxlint rules documentation](https://oxc.rs/docs/guide/usage/linter/rules) for the full list of rules and categories.
