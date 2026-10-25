# Scotty — Brand, Color & Micro-interaction System

**Version:** 1.0 · Mobile-first design direction  
**Positioning:** Scotty helps space commuters and curious travelers find a shared ride across the stars—with clear routes, dependable ship times and a reassuringly human guide.  
**Brand essence:** *Your galaxy. One ride away.*  
**Personality:** capable, curious, warm.

## 1. Creative direction: optimistic retro-futurism, made useful

Build an original visual identity inspired by the *feeling* of classic optimistic spaceflight: purposeful control panels, a crew that gets you there, luminous navigation signals, a moment of anticipation before a journey. Translate that inspiration into contemporary travel software, not a replica of any franchise. The app should feel as usable as a transit timetable, with just enough wonder to make the unfamiliar inviting.

### Design principles

1. **Mission clarity before spectacle.** A gate, time, fare and booking state must read faster than decorative effects. Every flourish yields to travel information.
2. **Technology with a human hand.** Interface language is warm, concise and reassuring. Prefer “Ride confirmed” and “Gate E-01” over unexplained technical jargon.
3. **Exploration, not military command.** Suggest discovery and a capable crew; avoid rank, combat, alert-level red, weapon motifs or authoritarian command vocabulary.
4. **Honest fiction.** The schematic is not live tracking; credits are not currency. Label both conspicuously and consistently.

### IP and differentiation guardrails

Create Scotty’s own wordmark, compass/beam mark, pictograms, terminology and animation curves. Do not use or approximate official Star Trek or Starfleet insignia, uniforms, emblems, ship silhouettes, typefaces, LCARS screen layouts, trademark wordmarks or recognizable sound effects. The reference is tonal—optimistic interstellar exploration and resourceful transit—not imitation. Avoid franchise-protected visual vocabulary such as a recognizable delta-insignia-with-centered-graphic lockup; make Scotty recognizable through its orbiting route arc and interrupted star/beam motif instead.

## 2. Brand identity

### Wordmark and app icon

Use a lowercase **scotty.** wordmark with a custom, gently geometric rounded sans; retain a small terminal dot as a beacon, not as a copied franchise mark. Pair it with an original **wayfinder mark**: a four-point mint star partly wrapped by one offset orbital arc, with a small intentional gap suggesting a boarding beam/route connection. Keep the mark asymmetrical enough to own and legible at 24 px. Do not put a letter, badge, uniform or official-looking insignia inside it.

The native icon should be a dark forest-black field with the mint wayfinder mark centered and generously padded. Avoid text at app-icon scale. Use the full wordmark plus short descriptor in splash/brand surfaces; use the small mark in tabs, map legends and loading indicators.

### Graphic motifs

- **Waypoint arc:** a fine curved line linking pickup and destination; one brighter traveling node moves along it only when motion is permitted.
- **Signal halo:** a restrained concentric mint ring for a selected station or successful booking; never use it to imply live vehicle tracking.
- **Beam aperture:** paired soft-edged brackets or narrowing lines at a transition between screens, evoking arrival without drawing a transporter device.

Keep background star texture sparse and low contrast. Navigation routes and interactive stations may glow; text and core data must not glow.

### Voice and microcopy

Sound like a helpful member of the travel crew: calm under change, precise about time and place, quietly optimistic. Lead with concrete facts; let one small poetic line set the mood per screen at most. Keep button labels verbs and outcomes: **Find my ride**, **Review fare**, **Confirm demo booking**, **View boarding pass**. Avoid faux-computer voice, excessive exclamation, “engage,” “warp speed” as an actual schedule promise, and unlabeled science-fiction jargon.

Examples:

- “Your gate is set. Arrive 15 minutes before ship time.”
- “This departure is delayed by 10 minutes. Updated time: 10:10 UTC.”

Demo disclosure is direct: **“Fictional travel · Demo credits only · No real payment.”** Do not bury this in legal text.

## 3. Color system

Use color semantically and sparingly. Dark surfaces form a quiet viewport around high-confidence information; mint is the ownable signal color and primary-action cue, not a decorative wash over every element. Amber indicates a service change that needs attention. Red is reserved for destructive/error severity and should not represent ordinary delay.

| Token | Hex | Role | Guidance |
|---|---:|---|---|
| `space.950` | `#0B1110` | App background | Primary canvas; very dark green-black rather than pure black |
| `space.900` | `#101816` | Header, nav and secondary background | Creates a slightly separated chrome plane |
| `surface.800` | `#151E1B` | Card/panel | Route cards, search form, settings groups |
| `surface.700` | `#1C2823` | Elevated/pressed surface | Sheets, pickers, nested information |
| `line.subtle` | `#283832` | Borders/dividers | One-pixel line; don’t use as text |
| `text.primary` | `#F2F5F1` | Primary copy | Headings, route endpoints, fares |
| `text.secondary` | `#AFBBB3` | Supporting copy | Station subtitles, explanatory detail |
| `text.quiet` | `#82918A` | Tertiary/noncritical copy | Dates, hints; do not use for essential departure data |
| `scotty.mint` | `#55E0AA` | Signature/action color | Wayfinder, primary CTA, selected state, route destination |
| `scotty.mint.deep` | `#173C30` | Mint-tinted surface | Selected chips, wallet/demo callout background |
| `status.good` | `#69D8A2` | On time / confirmed | Pair with “On time” or “Confirmed” label and an icon |
| `status.caution` | `#F1BD70` | Delay / attention | Pair with “Delayed” and the number of minutes |
| `status.error` | `#FF827A` | Blocking error/destructive | Only failed/cancelled operation or confirmation warning |
| `status.neutral` | `#9AA9A1` | Cancelled/completed metadata | Add a text badge; muted color must not hide state |
| `focus.ring` | `#B9FFE0` | Keyboard/accessibility focus | 2 px minimum, separated from control edge |

### Application rules

- Primary button: mint fill `#55E0AA` with dark `#0B1110` text; use mint outline/text rather than fill for secondary actions.
- Selected field/chip: surface `#1C2823`, a 1 px mint border, plus selected label or check icon.
- Delay badge: low-opacity amber-tinted surface plus amber text and “Delayed” label. Never convey delay only as color.
- Confirmed/on-time: restrained green/mint dot and explicit wording, not a glowing green card.
- Cancelled or unavailable: neutral/error text badge and explanation; do not use mint as if bookable.
- On wallet surfaces, label every amount as **credits** and show the fictional/demo disclosure adjacent to the balance.
- Maintain WCAG AA contrast for essential body text and controls; measure final rendered combinations rather than assuming a token pairing is compliant. Avoid placing quiet text on low-contrast panels.
- In Spanish and French, allow content-driven heights and localized date formats. Do not color-match a translated word by shrinking it below readable size.

## 4. Motion language

**Motion idea:** Scotty doesn’t teleport the interface; it *plots, signals, and arrives*. Motion is brief, directional, and tied to a system response. It confirms where the traveler is in a flow without delaying a booking task.

### Timing and easing tokens

| Token | Duration | Curve | Use |
|---|---:|---|---|
| `motion.tap` | 90–120 ms | ease-out | Press/release feedback |
| `motion.state` | 160–220 ms | standard ease-in-out | Selected chips, toggles, badge changes |
| `motion.sheet` | 240–300 ms | decelerate on entry; ease-in on exit | Bottom sheets and confirmation panels |
| `motion.route` | 450–650 ms | cubic-bezier(0.22, 0.8, 0.25, 1) | Search → results waypoint transition |
| `motion.success` | 420–650 ms total | ease-out, no bounce | Confirmed booking signal |
| `motion.skeleton` | 1.3–1.7 s loop | linear/low-amplitude | Loading shimmer only when loading exceeds a brief wait |

Never make essential content wait for a decorative animation. No looping map pulses on every screen, no perpetual spin without an adjacent “Loading” label, no parallax that shifts controls, no haptics as the only feedback. Under reduced motion, remove route travel, scale/zoom, shimmer and confetti; replace them with immediate state changes, labels and a simple opacity transition under 100 ms. Haptics should be optional and light; use success haptic only after server-confirmed booking and selection ticks for local selection, where supported.

## 5. Micro-interaction specifications

### A. Tap and press feedback

- **Trigger:** Press any tappable card, route chip or primary button.
- **Response:** Within 100 ms, darken the surface slightly or shift it inward by at most 1 px; primary button can reduce brightness ~6%, never lose text contrast.
- **Release:** Restore by ~120 ms; selection gets a persistent outline/check rather than staying “pressed.”
- **Accessibility:** Entire visible control is tappable; provide pressed/selected state semantics and a visible keyboard focus ring on web.

### B. Map world selection

- **Trigger:** Tap a planet/station node.
- **Response:** Selected node grows subtly from 1.0 to 1.08 over 180 ms, receives one mint halo that fades after ~500 ms, and shows a pinned station label/details. Pickup and destination have distinct shapes (dot vs ring) as well as color.
- **State:** Selection is persistent and reflected in the search fields; tapping again does not deselect a required endpoint.
- **Guardrail:** Do not animate a vehicle/marker along the arc. The schematic is illustrative, not live tracking. With reduced motion, add a static outline and selected label.

### C. Edit a search field

- **Trigger:** Tap origin, destination, date or traveler count.
- **Response:** A labeled sheet rises from the bottom over a dim scrim. Its title matches the field (“Choose departure,” “Choose destination,” “Choose date,” “Travelers”). Selected option is visibly checked. Opening and closing are 240–300 ms; tapping a choice updates its row immediately.
- **Completion:** The sheet closes after a valid selection; the originating form updates without a spinner. Date changes re-query availability, keeping the user’s route and traveler count.
- **Guardrail:** Same origin/destination produces an inline explanation and preserves input; do not permit a contradictory selection to masquerade as an available result.

### D. Swap route

- **Trigger:** Tap swap icon.
- **Response:** Endpoint names and pickup subtitles crossfade/shift positions horizontally over 180–220 ms; reverse the accessible labels at the same time. Avoid a full-screen spin. If the route becomes identical, show a concise inline prompt.

### E. Find ride / service filter

- **Trigger:** Submit valid criteria or select a rideshare/vanpool chip.
- **Response:** Keep the submitted search summary in place; transition content below it using a short crossfade plus 8–12 px upward shift (200–260 ms). Show labeled skeletons only if query takes >150 ms. Focus/announce the results heading and result count after data arrives.
- **Failure:** Preserve the search and show an inline retry panel; never briefly show empty results as though no route exists while data is loading.

### F. Current availability and seat changes

- **Trigger:** Availability refresh or another booking reduces remaining seats.
- **Response:** Crossfade the seat count over ~150 ms; if it becomes fewer than requested, show “Only 1 seat left” or “This ride is full,” amber/neutral status, and disable the book CTA with an explanation.
- **Failure:** Preserve last-known results but label availability as unverified/stale; offer Refresh. Do not convert a network error to “0 seats” or reuse stale values as confirmed.

### G. Delayed departure

- **Trigger:** A departure response changes to delayed.
- **Response:** Update the badge and revised ship times together with a 160–200 ms crossfade. Retain original scheduled time underneath and add “Scheduled” label. An optional single soft highlight may draw attention to the status row for under 600 ms.
- **Guardrail:** Never animate a clock counting up or leave the old time prominent. Show date and UTC ship-time qualifier with the revised time. No alarm sounds by default.

### H. Review fare and demo balance

- **Trigger:** Select “Review fare.”
- **Response:** Open a review sheet and count the fare total from 0 to the final number only if reduced-motion is off; cap count-up at 300 ms. Prefer an immediate final value for users with reduced motion or accessibility text reading. Itemize per-seat fare, per-traveler service fee, total, current demo balance and post-booking balance.
- **Disclosure:** Keep “Fictional travel · Demo credits only · No real payment” visible before the confirm control; never replace with a security/card-entry pattern.

### I. Confirm booking

- **Trigger:** Tap “Confirm demo booking.”
- **Immediate:** Disable the CTA, retain its width/position, replace label with a small spinner and “Booking…”; lock repeated taps and dismiss actions.
- **Success:** Only after server confirms, show a mint waypoint arc drawing from origin to destination over ~450 ms; resolve to a check and “Ride confirmed.” Haptic (optional light success) follows confirmation. Reveal reference, date, UTC times, gate and demo-credit total.
- **Recoverable error:** Restore CTA, preserve entered values, show localized inline reason and next step. Seat conflict prompts refresh/select another departure; wallet shortage explains reduced passenger count/alternative fare. Never show success optimistically.

### J. Boarding pass reveal

- **Trigger:** Open “View boarding pass.”
- **Response:** Present the ticket sheet/screen with a slight upward reveal and opacity transition, 220–280 ms. Draw a decorative nonfunctional route arc over 250–350 ms; show gate and UTC departure immediately, not after animation. The reference remains selectable/copyable.
- **Guardrail:** Any decorative barcode is labeled as such unless an actual validating system exists. Do not emit a real-world boarding claim.

### K. Cancel ride

- **Trigger:** Tap “Cancel trip.”
- **Response:** Open a confirmation sheet with the specific route, travel date and exact demo-credit refund amount. Emphasize the irreversible state change, but style “Keep ride” as the visually safe option.
- **Confirm:** Disable duplicate submissions and show “Cancelling…”; only update the booking and ledger after server success.
- **Success:** Crossfade status to “Cancelled,” release the seats, update demo wallet; show one localized success message. The transaction must be idempotent so retries never duplicate a refund.
- **Departed trip:** Do not offer cancellation. If server reports it has departed, refresh status and explain; do not display a successful refund animation.

### L. Wallet ledger update

- **Trigger:** Confirmed booking or confirmed cancellation.
- **Response:** Balance changes only after authoritative server response. Briefly highlight the new ledger row background for ~700 ms; retain plus/minus, label, date and demo-credit unit after highlight fades. Do not use count-up as the sole indicator of a new value.

### M. Language switch

- **Trigger:** Choose English, Español or Français.
- **Response:** Apply translation immediately, update the selected radio/check mark, localize current screen labels/dates/statuses and persist preference. Use no flag animations (language is not a country). Keep navigation stable and avoid a full-screen loading state.
- **Fallback:** If a specific string is missing, use a clear English fallback without blank space, truncation or clipped buttons; log implementation coverage outside the traveler-facing flow.

### N. Reminder toggle

- **Trigger:** Toggle reminders.
- **Response:** Thumb glides 150–180 ms, track/state label updates, and a polite live-region message confirms On/Off. If reminders are only a stored prototype preference and do not schedule OS notifications, label the feature truthfully (e.g. “Travel reminder preference”) and do not claim the system will notify at departure.

### O. Loading, refresh and offline

- **Refresh:** Rotate the refresh icon once (300–450 ms) while retaining readable existing balance/trips. Prevent simultaneous requests. Stop immediately on result/error.
- **Waiting:** For waits >150 ms, show restrained skeletons shaped like final content. For a longer wait, add “Connecting to mission control…” and a retryable error if appropriate.
- **Offline:** Replace status text/icon and add Retry; preserve form entries and known local display values. Do not imply that a booking made offline is confirmed.

## 6. Handoff-ready interaction checklist

- Each state transition is triggered by a clear user action or a confirmed service response.
- Search criteria persist through result, detail, review and recoverable failure.
- Revised delayed time, original scheduled time, date and UTC qualifier remain unambiguous.
- Availability and wallet amount use current server state; an error is not represented as zero.
- Booking/cancellation confirmation is server-driven, guarded against duplicate submissions, and written idempotently.
- Demo credits and fictional itinerary disclosure remain visible through review, receipt and wallet screens.
- The map is labeled illustrative and never shown as vehicle tracking.
- Reduced-motion settings suppress travel arcs, shimmer and animated number effects without suppressing feedback.
- Screen readers receive status changes, loading/error announcements, selected filters and accessible names for map controls.
- English, Spanish and French strings fit without clipping or lowering essential type below readable size.
