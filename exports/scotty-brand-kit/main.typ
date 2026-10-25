// Scotty Brand & Interface Standards — mobile product reference.
#import "report-theme.typ": report-accent, report-theme
#import "@preview/glossarium:0.5.10": make-glossary, register-glossary, print-glossary

#let ink = rgb("#0B1110")
#let chrome = rgb("#101816")
#let panel = rgb("#151E1B")
#let elevated = rgb("#1C2823")
#let rule = rgb("#D8E1DC")
#let mint = rgb("#55E0AA")
#let mint-deep = rgb("#173C30")
#let body = rgb("#405049")
#let quiet = rgb("#63736B")
#let amber = rgb("#93601B")
#let green = rgb("#28784F")
#let coral = rgb("#AC443F")
#let swatch(hex) = box(width: 10pt, height: 10pt, radius: 2pt, fill: rgb(hex), stroke: 0.35pt + rgb("#7B8A82"))

#let palette = (
  ("space.950", "#0B1110", "Canvas", "Green-black page background; avoid pure black."),
  ("space.900", "#101816", "Navigation", "Header, nav and secondary background plane."),
  ("surface.800", "#151E1B", "Cards", "Search, journey and settings cards."),
  ("surface.700", "#1C2823", "Elevated / pressed", "Sheets, pickers and nested information."),
  ("line.subtle", "#283832", "Border / divider", "Quiet one-pixel separators; never text."),
  ("text.primary", "#F2F5F1", "Primary text", "Route names, fares, headings and key values."),
  ("text.secondary", "#AFBBB3", "Supporting text", "Station subtitles and explanatory detail."),
  ("text.quiet", "#82918A", "Noncritical text", "Hints and dates only; not essential departure data."),
  ("scotty.mint", "#55E0AA", "Signature / action", "Wayfinder, primary CTA, selection and destination signal."),
  ("scotty.mint.deep", "#173C30", "Mint surface", "Selected chips and demo-credit callouts."),
  ("status.good", "#69D8A2", "On time / confirmed", "Pair with explicit status text and icon."),
  ("status.caution", "#F1BD70", "Delay / attention", "Pair with delay label and minutes; never color-only."),
  ("status.error", "#FF827A", "Blocking / destructive", "Only failed, cancelled or destructive states."),
  ("status.neutral", "#9AA9A1", "Completed / past", "Muted metadata with a text badge."),
  ("focus.ring", "#B9FFE0", "Keyboard focus", "At least 2 pt with separation from the control edge."),
)

#let glossary-terms = (
  (key: "utc", short: "UTC", long: "Coordinated Universal Time", description: "The shared time standard shown beside all ship departures and arrivals."),
  (key: "demo", short: "Demo credits", long: "Fictional test credits", description: "Non-currency prototype balance. No card details or real money are collected."),
  (key: "wayfinder", short: "Wayfinder mark", long: "Scotty’s original orbiting-star brand symbol", description: "A four-point star, interrupted orbital arc and small beacon dot."),
  (key: "waypoint", short: "Waypoint arc", long: "Illustrative route link", description: "A fine line linking pickup and destination; never live vehicle tracking."),
  (key: "halo", short: "Signal halo", long: "Selected-station ring", description: "A restrained mint selection accent, not proof of vehicle location."),
  (key: "safearea", short: "Safe area", long: "Device inset region", description: "The OS-controlled screen edge around notches, status bars and gesture indicators."),
  (key: "cta", short: "CTA", long: "Call to action", description: "A clearly named, tappable control that advances one user task."),
  (key: "rideshare", short: "Rideshare", long: "Shared-seat ride", description: "An individual ride option offered to one or more travelers."),
  (key: "vanpool", short: "Vanpool", long: "Shared scheduled van service", description: "A scheduled multi-seat service with named pickup and boarding details."),
  (key: "ledger", short: "Wallet ledger", long: "Demo-credit transaction record", description: "The authoritative list of wallet debits and confirmed refunds."),
  (key: "reducedmotion", short: "Reduced motion", long: "Motion-minimized preference", description: "An accessibility preference that removes route travel, scaling and shimmer."),
  (key: "focusring", short: "Focus ring", long: "Keyboard focus indicator", description: "A high-contrast visible outline for the currently focused web control."),
  (key: "availability", short: "Availability", long: "Current seat capacity", description: "Server-confirmed remaining seats for the selected route and date."),
  (key: "statusbadge", short: "Status badge", long: "Labeled service-state indicator", description: "Text and optional icon communicate on-time, delayed, cancelled or completed."),
  (key: "boardingpass", short: "Boarding pass", long: "Prototype trip ticket", description: "A readable trip summary; any unvalidated barcode is explicitly decorative."),
)

#show: report-theme.with(
  title: "Scotty Brand & Interface Standards",
  author: "Scotty Design System",
  rhythm: "report",
  body-size: 9.7pt,
  running-header: true,
)
#show: make-glossary
#register-glossary(glossary-terms)

// Cover — original project mark; no third-party or franchise imagery.
#page(margin: (top: 17%, bottom: 15%, x: 2.25cm), numbering: none, header: none)[
  #align(center)[
    #image("assets/scotty-mark.png", width: 31mm)
    #v(1.15em)
    #text(font: "Outfit", size: 32pt, weight: 700, fill: ink)[Your galaxy.]\
    #text(font: "Outfit", size: 32pt, weight: 700, fill: ink)[One ride away.]
    #v(0.8em)
    #line(length: 26%, stroke: 2pt + mint)
    #v(1em)
    #text(font: "DM Sans 9pt", size: 13pt, fill: body)[Brand guidelines & mobile UI component specifications]
    #v(2em)
    #box(fill: ink, inset: 14pt, radius: 9pt, width: 92%)[
      #align(center)[
        #text(font: "DM Sans 9pt", size: 9pt, weight: 600, fill: mint)[OPTIMISTIC RETRO-FUTURISM · MADE USEFUL]
        #v(0.55em)
        #text(font: "DM Sans 9pt", size: 9pt, fill: rgb("#F2F5F1"))[A dependable intergalactic rideshare identity: capable, curious and warm.]
      ]
    ]
    #v(2em)
    #text(font: "DM Sans 9pt", size: 8pt, fill: quiet)[Edition 1.0 · October 2026]\
    #text(font: "DM Sans 9pt", size: 8pt, fill: quiet)[Fictional travel · Demo credits only · No real payment]
    #v(2em)
    #text(font: "DM Sans 9pt", size: 7.5pt, fill: quiet)[Independent concept; not affiliated with or endorsed by any entertainment franchise.]
  ]
]
#pagebreak()
#outline(title: [Contents], indent: 1.2em)
#pagebreak()
#counter(page).update(1)

= Purpose and brand point of view

Scotty is an intergalactic rideshare and vanpool concept for commuters and visitors who depend on interplanetary travel. Its promise—“Your galaxy. One ride away.”—turns unfamiliar travel into a readable trip: named stations, useful pickup guidance, UTC times, current seats, clear fare and a dependable confirmation path.

#block(fill: mint-deep, inset: 10pt, radius: 7pt)[
  #text(font: "DM Sans 9pt", weight: 700, fill: ink)[Design north star.] #text(font: "DM Sans 9pt", fill: ink)[Make the timetable and boarding instructions feel more reliable than the space setting feels strange.]
]

== Principles

- *Mission clarity before spectacle.* Gate, time, fare and booking state must read before decorative effects.
- *Technology with a human hand.* Calm, concrete travel language; one small poetic line at most per screen.
- *Exploration, not command.* Avoid militaristic hierarchy, weapon motifs, combat language and alarm-red treatment for ordinary delay.
- *Honest fiction.* Label schematic positions as illustrative and balances as demo credits. Prototype interactions never masquerade as saved trips.

== Originality and differentiation

Scotty owns a lowercase `scotty.` wordmark, a custom wayfinder mark and original orbit/beam motifs. Borrow only the broad feeling of optimistic space exploration. Do not copy official marks, uniforms, ship silhouettes, trademark wordmarks, interface layouts, recognizable sound effects or other protected franchise vocabulary. Use the product name “Scotty” consistently and keep its visual identity distinct.

= Brand identity

== Wordmark and wayfinder mark

The wordmark is lowercase *scotty.* in a gently geometric rounded sans; its terminal dot behaves like a tiny beacon. The project’s original mark combines a four-point star, an offset interrupted orbital arc and a bright waypoint dot. Keep the mark asymmetric and recognizable at 24 px; use the full wordmark on brand surfaces and the mark alone in tabs, map keys and loaders.

- App icon: forest-black field, centered mint mark with generous clear space; no small text.
- Primary signature color: Scotty mint `#55E0AA`; pair with dark green-black rather than a bright white field when used as a large accent.
- Graphic motifs: the *waypoint arc* connects journey endpoints; the *signal halo* marks a selected station; the *beam aperture* brackets screen transitions without depicting a transporter device.
- Use sparse, low-contrast background stars. Never glow body text or essential timetable values.

== Voice and sample copy

Sound like a capable member of the travel crew: calm under a schedule change, exact about time and place, quietly optimistic. Prefer verbs and outcomes: *Find my ride*, *Review fare*, *Confirm demo booking*, *View boarding pass*.

#table(
  columns: (1fr, 1fr),
  stroke: 0.5pt + rule,
  inset: 7pt,
  table.header([*Use*], [*Avoid*]),
  [“Your gate is set. Arrive 15 minutes before ship time.”], [“Warp speed! Teleport to your gate instantly.”],
  [“Delayed by 10 minutes. Updated ship time: 10:10 UTC.”], [“Departure is imminent.”],
)

= Color and typography system

== Semantic palette

Use color by meaning, not decoration. Mint is the signature/action signal; amber calls out service change; coral is reserved for blocking errors or destructive actions. Every state remains readable in text and, where useful, shape or icon. Essential text must meet WCAG AA against its rendered surface; do not assume a pairing passes merely because it uses approved tokens.

#table(
  columns: (1.22fr, 0.66fr, 1.08fr, 2.04fr),
  stroke: 0.45pt + rule,
  inset: 5.5pt,
  table.header([*Token*], [*Hex*], [*Meaning*], [*Application*]),
  [space.950], [#swatch("#0B1110") #text(font: "DM Sans 9pt", size: 8pt)[`#0B1110`]], [Canvas], [Green-black app background; avoid pure black.],
  [space.900], [#swatch("#101816") #text(font: "DM Sans 9pt", size: 8pt)[`#101816`]], [Navigation], [Header, nav and secondary background plane.],
  [surface.800], [#swatch("#151E1B") #text(font: "DM Sans 9pt", size: 8pt)[`#151E1B`]], [Cards], [Search, journey and settings cards.],
  [surface.700], [#swatch("#1C2823") #text(font: "DM Sans 9pt", size: 8pt)[`#1C2823`]], [Elevated], [Sheets, pickers and nested information.],
  [line.subtle], [#swatch("#283832") #text(font: "DM Sans 9pt", size: 8pt)[`#283832`]], [Border], [Quiet one-pixel separators; never use as text.],
  [text.primary], [#swatch("#F2F5F1") #text(font: "DM Sans 9pt", size: 8pt)[`#F2F5F1`]], [Primary text], [Route names, fares, headings and key values.],
  [text.secondary], [#swatch("#AFBBB3") #text(font: "DM Sans 9pt", size: 8pt)[`#AFBBB3`]], [Supporting text], [Station subtitles and explanatory details.],
  [text.quiet], [#swatch("#82918A") #text(font: "DM Sans 9pt", size: 8pt)[`#82918A`]], [Noncritical], [Hints and dates only; not essential departure data.],
  [scotty.mint], [#swatch("#55E0AA") #text(font: "DM Sans 9pt", size: 8pt)[`#55E0AA`]], [Signature/action], [Mark, primary action, selection and route destination.],
  [scotty.mint.deep], [#swatch("#173C30") #text(font: "DM Sans 9pt", size: 8pt)[`#173C30`]], [Mint surface], [Selected chips and demo-credit callouts.],
  [status.good], [#swatch("#69D8A2") #text(font: "DM Sans 9pt", size: 8pt)[`#69D8A2`]], [On time / confirmed], [Always pair with the explicit state label and icon.],
  [status.caution], [#swatch("#F1BD70") #text(font: "DM Sans 9pt", size: 8pt)[`#F1BD70`]], [Delay / attention], [Name the delay and minutes; never color alone.],
  [status.error], [#swatch("#FF827A") #text(font: "DM Sans 9pt", size: 8pt)[`#FF827A`]], [Blocking / destructive], [Failed, cancelled or destructive state only.],
  [status.neutral], [#swatch("#9AA9A1") #text(font: "DM Sans 9pt", size: 8pt)[`#9AA9A1`]], [Completed / past], [Muted metadata with an explicit text label.],
  [focus.ring], [#swatch("#B9FFE0") #text(font: "DM Sans 9pt", size: 8pt)[`#B9FFE0`]], [Focus], [Visible 2 px keyboard ring separated from control edge.],
)

== Type, spacing and surface rules

- *Display and route headings:* Outfit, medium/semibold; large titles 30–36 pt, compact page title 21–24 pt. Use short lines and preserve station names.
- *Body, controls and explanation:* DM Sans. Body copy 12–14 pt in the app; captions are secondary, never the only location for key journey facts.
- *Numerals:* Use stable, tabular-looking forms for UTC departures, fare totals, seats and short references. Keep departure and arrival visually distinct.
- *Spacing:* 4 pt base increments; 20 pt phone side margin; 16–24 pt vertical rhythm. Allow content-driven heights and wrap long translations.
- *Cards and sheets:* use restrained border contrast, generous grouping and clearly separated primary data; avoid glowing text or full-surface mint.
- *Tap targets:* minimum ~44 × 44 pt; primary mobile CTA full width and at least 48 pt high.

All timetable/ticket values show a date and nearby “Ship time (UTC)” label. For a delayed journey, the updated time is prominent and the original schedule is supporting text.

= UI foundations and reusable components

== Shared control specifications

#table(
  columns: (1fr, 1.02fr, 1.5fr, 1.65fr),
  stroke: 0.45pt + rule,
  inset: 5pt,
  table.header([*Component*], [*Structure / size*], [*States / behavior*], [*Accessible contract*]),
  [Primary CTA], [Full width on phone; ≥48 pt], [Mint fill, dark text, clear verb; loading retains width.], [Named button; disabled explains why; never allow duplicate submits.],
  [Secondary action], [Inline or full width], [Mint outline/text on dark; low emphasis, still readable.], [Separate action label; never rely on color alone.],
  [Icon button], [≥44 × 44 pt hit target], [Quiet surface; brief tap feedback; no tiny visible target.], [Always a descriptive accessible label, e.g. “Swap origin and destination.”],
  [Search field row], [60–70 pt; label/value/station], [Origin, destination, date and travelers; focused sheet on tap.], [Field title, current value and terminal read as one control.],
  [Filter chip], [Compact, wrapped row], [Persistent selected style; filter applies to current results.], [Radio/selected semantics plus visible label.],
  [Status badge], [Text + optional icon], [Good, caution, cancelled, past; discrete tinted surface.], [“Delayed · +10 min” etc.; not color-only.],
  [Data card], [16 pt internal padding], [Times opposite, endpoints, terminal, availability and price.], [Whole card or a clear CTA; do not create ambiguous nested controls.],
  [Bottom tab], [Five destinations; ~66 pt + safe inset], [Overview, Find, Trips, Explore, Wallet; explicit selected item.], [Icon + short text label; active tab announced.],
  [Picker sheet], [24 pt top radius; title/close fixed], [Scrollable options; checked selection; apply/return updates parent.], [Focus stays managed; close and selected state are named.],
  [Status alert], [Inline near affected content], [Retryable network errors preserve inputs and last-known content.], [Announced message; a toast is not the only error channel.],
)

== Layout and navigation frame

Design the primary wireframe for a 390 × 844 pt phone. Respect the OS @safearea; keep bottom navigation above the gesture region. At 320 pt width, stack date/traveler controls and let the primary action occupy a full line. At wider sizes, a rail may replace the bottom bar without changing task order.

- Compact app header: mark/wordmark, active locale, reminders/profile where present. Secondary screens use a 21–24 pt title and back affordance.
- Bottom navigation: Overview · Find · Trips · Explore · Wallet; five destinations with short labels and visibly selected state.
- Phone card: 16 pt inset, clear data hierarchy, 16–20 pt corner treatment, subtle one-pixel border. Grow with translated text; never clip.
- Sheet/dialog: phone uses bottom sheet; wide screen may use centered dialog. Keep title/close visible, scroll content, and anchor actions above the safe inset.

== Journey components

#table(
  columns: (1fr, 2.1fr, 1.72fr),
  stroke: 0.45pt + rule,
  inset: 5.5pt,
  table.header([*Component*], [*Required content*], [*Interaction / state*]),
  [Home search panel], [From/to planet + named terminal; selected date; party size; swap; “Find my ride.”], [Each field opens a focused picker; swap revalidates route; preserve criteria into results.],
  [World schematic], [Station labels, pickup dot, destination ring, zoom/reset, “Illustrative positions · Not live tracking.”], [Selection updates the same origin/destination model as form fields; no fake live vessel marker.],
  [Departure card], [Service type, status, endpoints and terminals, UTC depart/arrive, duration, remaining seats, operator and fare per traveler.], [One clear CTA; unavailable/full/cancelled state blocks booking with an explanation.],
  [Journey details], [Date and UTC times, gate/pickup directions, arrival instruction, operator, vehicle, current availability and fare.], [Revised time leads; original schedule labeled underneath on delay.],
  [Fare review], [Traveler count, fare × count, per-person fee, total, current wallet balance, post-booking balance.], [“Fictional travel · Demo credits only · No real payment” stays visible before confirm.],
  [Receipt], [Saved reference, date, route, UTC times, pickup/gate, operator, travelers and credit total.], [Show success only after authoritative booking response; add trip to My Trips and debit to wallet ledger.],
  [Boarding pass], [Status, endpoints/terminals, date, UTC departure/arrival, gate/vehicle, reference and demo-ticket caveat.], [Decorative barcode is labeled as non-validating; ticket details available without unnecessary scroll.],
  [My Trips card], [Upcoming or past state, route, date, UTC times, gate, vehicle and party size.], [Boarding pass action; cancellation only while permitted; refund amount shown before confirm.],
  [Wallet summary], [Demo-credit balance and newest-first ledger with signed amount, label, date and transaction state.], [Server-confirmed debit/refund only; no card entry/top-up.],
  [Settings row], [English / Español / Français, reminders preference, guide/help and concept label.], [Locale updates journey copy immediately; reminders disclose if OS scheduling is not implemented.],
)

== Route-search and result hierarchy

On Home, order the experience as brand/locale → reassurance and status → compact schematic → search panel → next eligible departures → optional destination inspiration. Search remains easy to reach without scrolling through decorative content.

Results preserve route, date and party summary. Provide All / Rideshare / Vanpool filters, result count and simple departure sorting. Put “ship time (UTC)” near times. Availability errors are *unverified*, never zero seats. Keep stale cards readable only when explicitly marked and offer Refresh. Empty results state a reason when known and offer Change search / Try tomorrow.

= Booking flow and transaction safety

== Detail → fare review → confirm → receipt

1. *Search:* validate different endpoints, selected future date and party size; preserve inputs.
2. *Results:* filter/compare currently available services; include terminals, status, duration, seats and per-traveler fare.
3. *Journey details:* clarify gate and pickup action (“Arrive 15 minutes before departure”), operator, vehicle and remaining capacity.
4. *Fare review:* itemize traveler fare, service fee, total and demo-wallet impact before asking to confirm.
5. *Confirmation:* disable repeat taps and dismiss while the request is pending. Show booking success only after a persisted result from the server.
6. *Receipt/boarding pass:* put trip reference and UTC boarding facts first; show My Trips and wallet ledger consistently.

#block(fill: mint-deep, inset: 10pt, radius: 7pt)[
  #text(font: "DM Sans 9pt", weight: 700, fill: ink)[Trust rule.] #text(font: "DM Sans 9pt", fill: ink)[Client animation is not a booking result. Booking, capacity and demo-credit balance change only after authoritative server success. Never collect real payment data.]
]

== Confirmation, cancellation and recovery states

- Pending: retain CTA size and position, replace its verb with “Booking…” plus a labeled progress indicator, prevent repeat requests and protect the sheet from accidental dismissal.
- Confirmed: after server success only, show one restrained waypoint arc ending in a check, then “Ride confirmed,” reference and boarding facts. Optional success haptic follows confirmation.
- Seat conflict: preserve criteria, refresh seats, explain the conflict and offer another departure. Wallet shortfall: explain available demo balance and let the traveler edit party/fare.
- Cancel: show route/date and exact demo-credit refund before confirmation. Keep Ride is the safe visual action. Apply cancellation, seat release and refund atomically/idempotently; do not offer cancellation after departure.
- Offline/error: keep inputs, last readable results and specific next step. Do not convert service failure into empty results or zero availability.

== Trust disclosures

Place *“Fictional travel · Demo credits only · No real payment.”* before fare confirmation and near wallet totals. No add-card, top-up, receipt-to-email or real boarding validation claims. The schematic is explicitly illustrative. A decorative ticket code is marked decorative unless a validating system exists.

= Micro-interaction and motion specification

Scotty plots, signals and arrives. Motion is directional, quick and directly tied to system feedback. No essential content waits for decoration, and no control depends on haptic-only feedback.

#table(
  columns: (0.93fr, 0.72fr, 1.28fr, 2fr),
  stroke: 0.45pt + rule,
  inset: 5pt,
  table.header([*Token*], [*Time*], [*Use*], [*Behavior*]),
  [motion.tap], [90–120 ms], [Press / release], [Slight surface darkening or ≤1 px inward shift; restore quickly.],
  [motion.state], [160–220 ms], [Chip, filter, badge], [Crossfade/update state; retain explicit selected label.],
  [motion.sheet], [240–300 ms], [Picker / fare sheet], [Decelerate entry, ease-in exit; never hide title or action.],
  [motion.route], [450–650 ms], [Search → results], [Cubic-bezier (0.22, 0.8, 0.25, 1); short crossfade and 8–12 px rise.],
  [motion.success], [420–650 ms total], [Saved booking], [Single waypoint arc, no bounce; only after server confirmation.],
  [motion.skeleton], [1.3–1.7 s loop], [Prolonged load], [Low-amplitude shimmer only if load exceeds a brief wait; label Loading.],
)

== Interaction inventory

#table(
  columns: (1fr, 2.1fr, 1.72fr),
  stroke: 0.45pt + rule,
  inset: 5pt,
  table.header([*Trigger*], [*Feedback*], [*Guardrail*]),
  [Press any control], [Within ~100 ms, acknowledge; release by ~120 ms.], [Persistent selection uses outline/check, not a stuck pressed state.],
  [Select a map station], [Small 1.0 → 1.08 scale over ~180 ms; one halo fades by ~500 ms; show station label.], [Do not animate a vehicle or imply real tracking.],
  [Edit route/date/party], [Labeled field sheet opens; selected value updates immediately.], [Invalid same-station choice gets inline explanation; preserve other inputs.],
  [Swap route], [Endpoint labels exchange over 180–220 ms.], [Accessible names exchange too; no full-screen spin.],
  [Find / filter], [Keep summary in place; results update in ~200–260 ms.], [Skeleton only for delay; announce result count; preserve retry state.],
  [Seat count refresh], [Seat value crossfades over ~150 ms.], [If party no longer fits, disable booking and state why.],
  [Delay response], [Revised time + badge update together over ~160–200 ms.], [Original labeled “Scheduled”; new ship time is primary.],
  [Review fare], [Optional count-up capped at 300 ms.], [Reduced motion / screen reader receives final total immediately.],
  [Confirm], [Disable duplicate action; persist, then run success signal.], [Never show success optimistically; restore action on recoverable error.],
  [Open pass], [Sheet reveals in 220–280 ms; decorative line 250–350 ms.], [Gate and UTC time appear immediately; code is explicitly decorative.],
  [Cancel], [Confirmation contains exact trip and refund.], [Keep ride remains safe; no post-departure refund.],
  [Ledger updates], [Highlight new row for ~700 ms, then retain it.], [Amount, unit, label, date and authoritative status remain visible.],
  [Switch language], [Selection takes effect immediately.], [Localize all key journey and status copy, not only Settings.],
  [Toggle reminders], [Selected state is explicit; store preference.], [Do not claim OS notification scheduling unless implemented.],
  [Load / refresh / offline], [Quiet progress, specific retry, stale-data cue when needed.], [Never replace an error with empty results or settled zero seats.],
)

== Reduced motion and focus

Under @reducedmotion, remove route travel, zoom/scale, shimmer and confetti; replace with immediate state changes, labels and (if helpful) a simple opacity transition under 100 ms. Motion never blocks fare details or departure values. Web controls need a visible `#focusring` outline (2 px minimum) offset from each control. Screen readers receive selected/disabled states, route change/result count, booking or cancellation success, and durable errors.

= Accessibility, localization and implementation

== Language and readable data

Ship the working experience in English, Spanish and French. Localize field names, service filters, status labels, station/pickup guidance, fare disclosures, receipts, cancellations, errors, empty states and date formatting. Keep UTC as a stable numeric standard, labeled with “ship time (UTC)”; never shrink wrapped translations to fit a fixed row.

== Layout checks

- Reference mobile canvas: 390 × 844 pt with OS safe regions and bottom navigation.
- Validate a narrow 320 pt width and larger phones; no essential action is trapped in a horizontal row.
- Check long planet/station names, delayed schedule, full-party availability, no-results, loading, offline, cancellation and expanded text.
- Map browsing always has station cards/controls as a non-map equivalent.
- Confirm text contrast on actual rendered surfaces; color always has a textual and/or shape cue.

== Release handoff checklist

- ☐ Every departure and arrival includes the date and nearby @utc label.
- ☐ Fare and current/post-booking wallet totals are itemized before confirm.
- ☐ Demo-only and no-real-payment disclosures appear before the irreversible action.
- ☐ Booking/cancel state, seat release and wallet entries follow server success; duplicate requests are safe.
- ☐ Focus, touch target, labels, selected/disabled semantics and reduced motion are present.
- ☐ Originality guardrails and non-live map disclosures hold on every screen.

= Glossary

#text(size: 8.5pt, fill: body)[Use the short forms consistently in design reviews, handoffs and implementation notes. All listed concepts are included below.]

#print-glossary(glossary-terms, show-all: true, disable-back-references: true)
