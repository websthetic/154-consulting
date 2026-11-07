# 154 Consulting

The 154 Consulting website: brand, web and growth for service businesses across Ontario.
Built with [Eleventy](https://www.11ty.dev/) (Nunjucks templates, LESS, esbuild) and deployed on Netlify.

```
npm install
npm start        # dev server with live reload
npm run build    # production build into public/
```

## Where things live

| What | Where |
| --- | --- |
| Case studies, one file each (`/work/<file>/`) | `src/work/*.md` |
| Brand, Web and Growth (`/services/<file>/`) | `src/services/{brand,web,growth}.md` |
| Individual services (`/services/<file>/`) | `src/services/*.md` with `kind: service` |
| Home, Work, Services, Process, Where to start, About, FAQ, Contact | `src/*.html`, `src/work/index.html`, `src/services/index.html`, `src/contact/` |
| Page layouts | `src/_includes/layouts/` (`base`, `case`, `pillar`, `service`) |
| Nav, footer and repeated pieces | `src/_includes/partials/` |
| Business details (name, email, phone, address, domain) | `src/_data/client.js` |
| Structured data (JSON-LD) for every page | `src/_data/eleventyComputed.js` |
| Styles | `src/assets/less/site.less` |
| Scripts, one module per feature | `src/assets/js/modules/`, loaded by `src/assets/js/site.js` |
| Images | `src/assets/images/site/` |

Content files hold their text in front matter. Each one also sets its page's `title` and `description`,
which become the search result title and snippet.

`src/_data/marks.json` is the drawing data for the logo animations on the case study pages
(thousands of coordinates, keyed by each case's `key`). Edit the case's `.md` file for anything a
person reads; leave `marks.json` alone unless a mark itself changes.

## Forms

The enquiry form on `/contact/` is a Netlify Form (`name="contact"`). Submissions appear under
**Forms** in the Netlify dashboard once form detection is enabled for the site. Anything a visitor
picked on the homepage, and their answer from Where to start, is sent with it in hidden fields.
