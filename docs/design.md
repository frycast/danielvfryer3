# Site design

The site introduces Danny's data science work to collaborators, students, and prospective colleagues, then makes his research, experience, and contact details easy to find.

## Palette and type

- Paper `#f5f8fc`: cool page background.
- Ink `#182e48`: primary text.
- Blue `#224bc3`: links and primary actions.
- Mist `#e3ecf8`: portrait stage and secondary surfaces.
- Slate `#52647a`: secondary text.
- White `#ffffff`: research figure backgrounds.

Locally hosted Manrope serves body text and navigation. Newsreader serves display headings. Both have system fallbacks.

## Theme modes

Light, Dark, and Automatic are available in a compact header selector. Automatic is the default and follows system appearance, including changes while the page is open. Explicit choices are remembered across visits and applied before the page paints.

Dark mode keeps the same blue identity: slate-blue paper `#142336`, pale ink `#e4ebf5`, blue links `#a8bfff`, secondary surfaces `#1e334c`, muted text `#b1bfd1`, and primary buttons `#426ae1`. Research figures keep white backgrounds so plots remain readable. The layout and portrait stay unchanged. This extends the established design rather than adding a separate visual style.

## Layout

The oversized name and portrait form the focal point. Affiliations sit beneath the introduction. The exact supplied biography pairs with education and profile details, followed by six professional disciplines, ongoing roles, illustrated publications, honors, and contact. Full career descriptions live on `/experience/`.

Text stays left aligned and long prose has a bounded line length. Research figures use contain sizing to avoid cropping scientific content. The profile sidebar moves below the biography on phones. Navigation, research downloads, and the contact form remain usable without JavaScript; publication search is progressively enhanced.

## Review

Chrome checks cover 1440, 768, 390, and 320px widths, with no horizontal overflow. Keyboard focus is visible, reduced motion is respected, and fonts are served locally. The frontend design skill is retained in `.agents/skills/frontend-design/SKILL.md`.
