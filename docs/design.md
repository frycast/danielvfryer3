# Redesign direction

Audience: research collaborators, students, and people looking for Danny's data science expertise. The site should introduce Danny, explain his approach, and make papers and contact easy to find. Existing content and media remain the source of truth.

## Tokens

- Paper `#f5f8fc`: cool page background.
- Ink `#182e48`: primary text.
- Blue `#224bc3`: links and primary actions.
- Mist `#e3ecf8`: portrait stage and quieter panels.
- Slate `#52647a`: secondary text.
- White `#ffffff`: reading surfaces.
- Type: locally hosted Manrope for navigation and body; locally hosted Newsreader for large display text and quotations. Both retain system fallbacks.

## Layout exploration

Option A: compact profile sidebar beside biography and a publication grid. Easy to scan, but too close to the old academic template.

Option B (chosen): spacious introduction with an oversized name and portrait, a flowing biography with a small education column, research presented as illustrated horizontal entries, then contact. Everything is left aligned; long prose stays below 75 characters per line.

```text
Name                         About  Research  Contact  CV
---------------------------------------------------------
Large name + role                  Existing portrait
Introduction + actions             on a blue arch
Affiliations

About / full biography             Interests / Education
Skills across a quiet blue band

Research                  Search papers
Figure | title, authors, summary, paper / citation
Figure | title, authors, summary, paper / citation

Contact details           Contact form
Footer / academic links
```

## Review before implementation

The initial sidebar option would preserve the template's visual hierarchy too closely. The chosen portrait stage gives this personal site a distinct focal point without inventing research metrics or adding decorative data visualizations. Publication images remain legible, uncropped figures. No repeated card grid, decorative numbering, or animation is needed. Keep the existing first-person writing rather than replace it with marketing copy.

## Implementation principles

Generate static HTML directly from the existing Markdown and YAML. Keep original files, links, PDFs, BibTeX, images, and inactive example content. Preserve public paper paths and talk paths. Netlify builds with Node; no Hugo, Go modules, or Hugo plugins are involved in the deployment. Progressive enhancement adds paper search; navigation, reading, downloads, and the Netlify contact form work without JavaScript.

## Visual review

Reviewed rendered Chrome screenshots at desktop and mobile sizes. The portrait and name carry the visual identity; affiliations, skills, and research are quieter. Research figures use contain sizing so scientific information is never cropped. The long biography remains fully readable, and the education column moves below it on narrow screens. Checked 1440, 768, 390, and 320 pixel widths with no horizontal overflow. All original biography paragraphs and abstracts are verified, as are attachment bytes and internal links.
