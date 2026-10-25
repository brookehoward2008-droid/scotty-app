# SCOTTY typography revision

Display: Manrope variable, weight 450 for the main hook and 550–600 for interface headings. Headlines use measured negative tracking (-0.03 to -0.04em) and 1.11–1.3 line height. The supplied logo and approved copy are preserved.

Interface: Source Sans 3 variable. Main text is 15–16px, supporting information 13px, and labels generally 11–12px. Product prices use Manrope with tabular numerals and clear per-seat/per-ship labels. Map attribution remains smaller to preserve cartographic space.

Layout: Narrow presentation screens stack Private and Shared sections; minmax(0,1fr) prevents the presentation grid from forcing horizontal clipping. Compact phone navigation receives separate spacing. Larger reading text is allowed to wrap instead of being reduced to fit.

Implementation: scotty-typography.css is shared by index.html, both presentation HTML pages, and the React App.jsx. The existing app and presentation styles remain separate. No new illustration or generated artwork was required.

Fonts are hosted locally. Original variable TTF files and SIL Open Font License texts are in fonts/. Official source files:
- https://github.com/google/fonts/tree/main/ofl/manrope
- https://github.com/google/fonts/tree/main/ofl/sourcesans3

Validation: typography-verification.json records loaded font checks, computed sizes, browser errors and responsive overflow checks. Screenshots cover the presentation, spacecraft cards, pilot reviews, checkout and welcome states. Browser validation does not certify physical iOS/Android behavior. The saved video is refreshed separately from the live app.
