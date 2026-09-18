# kimberlylawis.github.io

Personal portfolio for Kimberly Lawis-De Guzman. Static HTML, CSS, and JavaScript —
no build step, no dependencies, no framework. Edit the files, push, done.

Live at <https://kimberlylawis.github.io>

## Files

```
index.html          all content and markup
css/styles.css      design tokens, grid, components, dark mode, responsive
js/main.js          theme toggle, mobile nav, work filters, accordions, scroll reveal
assets/             CV PDF and favicon
.nojekyll           tells GitHub Pages to serve the files as-is
```

## Editing

**Colors.** Every color is a custom property in the two `:root` blocks at the top of
`css/styles.css` — one for light, one for dark. Change them there and the whole site
follows. Nothing else in the stylesheet hardcodes a color.

**Adding a job.** Copy a `<li>` inside `<ol class="timeline">` in `index.html` and fill
it in. Newest goes first.

**Adding a project.** Copy a `<li class="work-row">` inside `<ul class="work-list">`.
Two things to keep straight:

- `data-cat` must be one of `payroll`, `retail`, `telecom`, `finance`, `integration` —
  these are what the filter buttons match on. A new category also needs a new `<button
  class="chip" data-filter="...">` above the list.
- The button's `aria-controls` and its panel's `id` must match and be unique on the page
  (`p1`, `p2`, … ). If they drift apart the accordion stops opening.

The nine projects from the CV that aren't currently shown are listed in an HTML comment
directly above the work section, ready to swap in.

**Replacing the CV.** Drop the new PDF in `assets/` and update the two `href`s pointing
at `assets/CV_KLawisDeGuzman.pdf` (hero and contact section).

## Running it locally

Open a terminal in this folder:

```powershell
python -m http.server 5500
```

Then go to <http://localhost:5500>. Use a server rather than double-clicking
`index.html` — it makes local paths behave the same way they will once deployed.

## Deploying

The repo is a GitHub Pages user site, so anything pushed to `main` goes live within a
minute or two:

```powershell
git add .
git commit -m "Update portfolio"
git push
```

If Pages ever needs re-pointing, it is **Settings → Pages → Source: Deploy from a
branch → `main` / `(root)`**.

Because the repo is named `kimberlylawis.github.io`, the site is served from the domain
root. Every asset path in the HTML is relative, so nothing needs configuring — but if
the site ever moves into a project repo, update the `canonical` and `og:url` tags at the
top of `index.html` to include that subpath.

## Notes

- `CV_KLawisDeGuzman.docx` is gitignored. The PDF in `assets/` is the published version,
  so regenerate it whenever the source changes.
- The published PDF still contains the phone numbers on its references page. If that
  should not be public, export a version without that page and replace the file in
  `assets/`.
- There is no `og:image` yet. The tag is in `index.html`, commented out — add a
  1200×630 PNG to `assets/` and uncomment it to get a link preview on social sites.
