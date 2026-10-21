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

## Explore and learn

The large primary hero button reads “Explore and learn” and takes visitors directly to the resources, making participation a main purpose of the site. Its stronger scale and blue fill distinguish it from the quieter CV link; a downward arrow indicates the in-page destination. It uses no automatic animation.

The section sits after the skills band and before work history. Use the existing blue palette and typography. A compact list with a format column, title/description column, and explicit action scales naturally as more entries are added. All text stays left aligned. On phones, format and action move above and below the description. The list stays quiet beside the large invitation, while distinguishing a course to read, a game to play, and software to use. Keep the section title, introduction, and complete list in `data/resources.yaml`.

```text
Introduction + [Explore and learn]       Portrait
                    ↓
Explore and learn
Course     Introduction to SQL           View course materials
Game       Night Shift at Shackleton     Play the game
Software   rcosmo                        View the package
```

The review favors a list over three matching cards: these resources serve different purposes, and their format and action make those differences easy to scan. The larger invitation supplies the emphasis; the list needs no extra decorative elements. Desktop and phone screenshots confirm that the button and resource actions remain clear in both themes.

## Review

Chrome checks cover 1440, 768, 390, and 320px widths, with no horizontal overflow. Keyboard focus is visible, reduced motion is respected, and fonts are served locally. The frontend design skill is retained in `.agents/skills/frontend-design/SKILL.md`.
