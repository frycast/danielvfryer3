# LinkedIn profile update

Source: the LinkedIn profile PDF supplied by Danny on 21 October 2026, seven pages. The original PDF remains outside the repository.

SHA-256: `ad39eea3fc467b3fc9fb917a46b0ade56e4da938b70c30b197414bfe081dfaad`.

The About text in `content/profile.md` preserves the Summary wording and punctuation, including its quotations. PDF line wraps were removed, split compound words rejoined, and paragraphs restored for readability. `tests/fixtures/linkedin-about.txt` records the extracted Summary independently so automated checks can compare the complete biography, ignoring whitespace only.

The headline, email, top skills, languages, current affiliations, and all three education records come from the PDF. Its explicit dates replace the older website's PhD year of 2024 with January 2019–April 2023. No graduation date or completion claim is inferred for the 2010 Bachelor of Arts entry.

`data/career.yaml` contains all 15 experience entries, their explicit date ranges, descriptions, research links, and the honors listed in the export. Relative durations and historical download counts are not used as current headline metrics. The homepage introduces the three ongoing roles; `/experience/` contains the complete history. Honors and languages appear with the profile information. Existing publication pages, images, attachments, CV link, and social links remain available.

Design review before implementation: keep the established portrait and typography as the focal point. Add a simple, left-aligned experience section instead of a new card grid. Longer career descriptions belong on a separate page, grouped by organization; this keeps the homepage useful on mobile. The existing cool blue palette and locally hosted typefaces remain unchanged.

The checks cover the exact biography, all 15 roles, education, skills, languages, honors, navigation, images, form markup, and publication search. Chrome checks cover 1440, 768, 390, and 320px. Reading and navigation work without JavaScript.
