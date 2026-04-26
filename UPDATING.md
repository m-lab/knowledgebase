# Pulling template updates

This repo uses a Git upstream merge strategy. The template lives at a known
remote; you pull changes from it periodically. Your content and config are
protected by `.gitattributes` — git will always keep your local versions of
those files, even if the template changes them.

## One-time setup

Run these commands once after cloning your repo:

```bash
# Register the merge driver that protects your files
git config merge.ours.driver true

# Add the template as a second remote
git remote add template https://github.com/YOUR_ORG/astro-kb.git
git fetch template
```

## Pulling an update

```bash
git fetch template
git merge template/main --allow-unrelated-histories -m "chore: merge template update"
npm install   # in case new dependencies were added
```

Git will automatically keep your versions of the protected files listed in
`.gitattributes`. Everything else — layouts, components, styles, the Actions
workflow — will be updated from the template.

If you see conflicts outside the protected files it means you've customised a
template-owned file. Resolve them the usual way (`git mergetool` or your
editor), then `git merge --continue`.

## File ownership

### Your files — edit freely, never overwritten

| Path | What it controls |
|---|---|
| `src/content/articles/` | All your articles |
| `src/config.ts` | Site title, colors, nav, GitHub repo |
| `src/data/tags.ts` | Tag definitions |
| `src/pages/about.md` | About page content |
| `README.md` | Your project README |
| `LICENSE` | Your license |

### Template files — updated automatically

| Path | What it controls |
|---|---|
| `src/layouts/` | Page layouts (Base, Article) |
| `src/components/` | Svelte islands (search, filter) |
| `src/styles/global.css` | All styling |
| `src/utils.ts` | URL helper |
| `src/pages/index.astro` | Home page structure |
| `src/pages/[slug].astro` | Article page routing |
| `src/pages/tags/` | Tag index and tag pages |
| `src/pages/search.json.ts` | Search index endpoint |
| `astro.config.mjs` | Astro configuration |
| `tsconfig.json` | TypeScript configuration |
| `.github/workflows/` | GitHub Actions deployment |

### Customising template files

If you need to change a template-owned file (e.g. tweak the home page layout),
add it to `.gitattributes` to protect it from future updates:

```
src/pages/index.astro  merge=ours
```

Just be aware that you will no longer receive template updates for that file.
