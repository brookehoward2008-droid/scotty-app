# Scotty Mobile — Detailed Screen Wireframe Layout

**Product:** Scotty — Your galaxy. One ride away.  
**Audience:** Daily space commuters and interplanetary tourists.  
**Platform:** Mobile-first iOS and Android  
**Primary design goal:** Make fictional intergalactic travel feel easy to understand and operationally dependable. Show route, local pickup, date, ship time, fare, seats and service status before asking the traveler to book.  
**Prototype note:** Destinations, schedules and payments are fictional. Credit balance and checkout must be labeled as demo; never imply that a real-world payment was processed.

---

## 1. Global layout and design system

### Reference canvas

Design primary wireframes for a **390 × 844 pt** phone viewport. Account for the top system status area and bottom gesture/home indicator; allow content to scroll underneath a pinned bottom navigation bar where appropriate. Test the layout at 320 pt width and larger devices. Use safe-area insets for all screen-edge content.

```text
┌──────────────────────────────────┐  y=0
│ System status / safe area         │  ~47 pt, OS-controlled
├──────────────────────────────────┤
│ App header                        │  52 pt; only on secondary pages
│ Scrollable screen content         │
│                                  │
│                                  │
├──────────────────────────────────┤
│ Bottom tab bar                    │  66 pt + bottom safe area
└──────────────────────────────────┘  y=844
```

The Overview screen can omit a separate toolbar and let its brand/date row lead the page. Secondary pages use a compact back/title row. In dialogs, use a bottom sheet on phones and a centered dialog on wide screens; retain a visible close affordance and do not dismiss while a booking or cancellation request is in flight.

### Visual hierarchy

Use a near-black green-tinted space canvas; dark elevated surfaces distinguish cards from the page without making the interface feel dense. Reserve bright mint for primary actions, selected states, route highlights and available/confirmed signals. Use amber for delay, caution, or attention; use muted gray for secondary text. Maintain legible contrast and do not rely on color alone to communicate service status.

Use a distinctive display face for large headlines and route names, a highly readable sans serif for body labels, and tabular/monospaced numerals for ship times, credits and short references. Keep touch targets about 44 × 44 pt or larger. Prefer concise labels, explicit field names and ordinary travel language, with light “mission control” personality in secondary copy.

### Persistent navigation

On compact phones, pin a five-item bottom tab bar above the system gesture area:

```text
┌──────────────────────────────────┐
│   Overview   Find   Trips   Wallet│
│                    Explore        │
└──────────────────────────────────┘
```

Use icons plus short labels; visibly indicate the selected tab. Preserve each tab’s scroll position only when it helps resume a task; after a new search, return the search/results view to its top. Settings and language controls remain easy to find from the top-right language/reminder area or the profile/settings entry point. At larger widths, the same destinations may be shown in a navigation rail without changing content order.

### Shared route language

Every timetable and ticket must say **ship time (UTC)** near the time display. Show departure and arrival separately and retain the selected calendar date. For a delayed trip, show the revised time prominently and the originally scheduled time as supporting text. Always pair a destination with its named terminal/pickup area rather than displaying a planet name alone.

---

## 2. Screen A — Overview / Home

**Purpose:** Orient a first-time or returning traveler, offer the fastest route-search path, and establish that the map is illustrative and payment credits are demo-only.

```text
┌──────────────────────────────────┐
│ Status bar                       │
│ [SCOTTY mark] scotty.     [EN ▾] │
│                          [Bell]  │
│ Wed, 21 October · Sol sector     │
├──────────────────────────────────┤
│ THE UNIVERSE IS YOUR NEIGHBORHOOD │
│ A little closer to anywhere.     │
│ Your daily commute. Your next    │
│ great adventure.                 │
│ [All systems go]  6 WORLDS       │
│                                  │
│ ┌ Your corner of the cosmos ────┐│
│ │     • Earth ─── • Luna         ││
│ │       • Mars          • Titan  ││
│ │  • Europa              • Vulcan││
│ │  Pickup ●   Drop-off ◉         ││
│ │  Illustrative, not tracking    ││
│ │            [−] [+] [recenter]  ││
│ └───────────────────────────────┘│
│ ┌ Find a ride ──────────────────┐│
│ │ FROM       Earth · Orbital Gate││
│ │ TO         Luna · Tranquility  ││
│ │ [swap]                          ││
│ │ DEPARTURE  Wed, 21 Oct   [›]   ││
│ │ TRAVELERS  1 traveler    [›]   ││
│ │ [           Find my ride    →]││
│ └───────────────────────────────┘│
│ Next departures           View all│
│ [Departure card]                  │
│ [Departure card]                  │
│ Destinations / inspiration        │
├──────────────────────────────────┤
│ Overview · Find · Trips · Wallet │
└──────────────────────────────────┘
```

**Content order:** Brand and locale controls → welcoming headline/status → small schematic galaxy map → route-search card → up to three soonest eligible departures for the chosen date → destination discovery cards. On narrower screens, the map is a compact card; it must not push search far below the fold. Destination discovery is secondary to the search form.

**Header controls:** Language control opens language selection and clearly displays the active locale; reminder bell opens reminder preferences. A non-personal demo account label may appear in a profile menu, but do not imply a verified passenger identity.

**Map behavior:** Tapping a world opens its station information and can populate the origin/destination selector. Distinguish a selected pickup and drop-off with symbol, label and color. Provide zoom-in, zoom-out and reset/recenter controls. Include the small persistent text “Illustrative positions · Not live tracking.” Do not imply a live vessel position or geographic navigation.

**Search behavior:** Route, date and passenger controls open purpose-built pickers. The swap control exchanges origin/destination. Disable or explain same-station searches. Primary CTA moves to results and visibly preserves the chosen search criteria. A quick-route shortcut sets only the route and sensible date/passenger defaults.

**States:** Initial mission-control connection → “Connecting to mission control…”; success → “All systems go”; service failure → clear offline/error message with Retry while preserving search fields. No eligible upcoming departure → concise empty state plus a one-tap next-day option. If current availability is loading, do not show zero seats as a settled fact.

---

## 3. Screen B — Find a ride / Results

**Purpose:** Compare eligible options for one exact search without hiding dates, schedule context or availability.

```text
┌──────────────────────────────────┐
│ [‹] Find a ride                  │
│ Earth → Luna                     │
│ Wed, 21 Oct · 1 traveler · [Edit]│
│ Ship times shown in UTC          │
├──────────────────────────────────┤
│ [All]  [Rideshare]  [Vanpool]    │
│ 3 rides · Sort: Departure [▾]    │
│                                  │
│ ┌ VANPOOL · ON TIME ────────────┐│
│ │ 08:30 UTC             09:05   ││
│ │ Earth              →  Luna     ││
│ │ Orbital Gate 1        Tranquility│
│ │ 35 min · 6 seats left          ││
│ │ Lunar Link · Mira Quill · ★4.8 ││
│ │ 24 credits/person    [Choose →]││
│ └───────────────────────────────┘│
│ ┌ VANPOOL · DELAYED +10 MIN ────┐│
│ │ 10:10 UTC             10:50   ││
│ │ Scheduled: 10:00–10:40 UTC    ││
│ │ Earth              →  Luna     ││
│ │ Orbital Gate 1        Tranquility│
│ │ 40 min · 8 seats left          ││
│ │ 18 credits/person    [Details] ││
│ └───────────────────────────────┘│
│                                  │
├──────────────────────────────────┤
│ Overview · Find · Trips · Wallet │
└──────────────────────────────────┘
```

Each card is one tappable unit, with an explicit CTA for screen-reader discovery. Keep the status badge text (“On time”, “Delayed · +10 min”, or “Cancelled”) visible. A cancelled service can remain visible for schedule transparency but cannot offer a book action. Indicate when a route is full, and never present zero remaining seats as “available.” If availability refreshes, preserve the current result position and announce the changed count accessibly.

**Edit search:** Opens or returns to the search form with previous inputs intact. Service chips filter; selected filters are visually and programmatically selected. Use simple departure ordering as the default. Make all times explicitly UTC/ship time. If no results match the chosen date, route, passenger count or filter, explain why when known and offer “Change search” or “Try tomorrow.”

**Failure states:** If current seat availability cannot be confirmed, show a small inline alert and Retry; do not silently treat an API failure as zero or fixture capacity. Keep already loaded results readable but label them as possibly outdated, and ask the traveler to refresh before booking.

---

## 4. Screen C — Journey details

**Purpose:** Let the traveler verify the specific departure and its practical boarding instructions before reviewing a fare.

```text
┌──────────────────────────────────┐
│ [‹] Journey details              │
│ Vanpool · Lunar Link   [On time] │
├──────────────────────────────────┤
│ WED, 21 OCT · SHIP TIME (UTC)    │
│ 08:30             09:05          │
│ Earth ──────────── Luna           │
│ Orbital Gate 1    Tranquility Pad│
│ 35 minutes · Comet Van 7 · E-01  │
├──────────────────────────────────┤
│ Pickup at Orbital Gate 1          │
│ Arrive 15 minutes before ship time│
│ Follow the marked departure ring  │
│ [View schematic route]            │
├──────────────────────────────────┤
│ Mira Quill · ★ 4.8               │
│ 6 seats remaining                │
│ Shared vanpool                   │
├──────────────────────────────────┤
│ 24 credits / traveler            │
│ [Review fare and travelers  →]   │
└──────────────────────────────────┘
```

**Delayed variant:** Use revised departure and arrival in the time row; display “Delayed · +10 min” and original schedule in smaller but readable text. **Availability variant:** Show current remaining seats for the selected date. If the selected party exceeds availability, disable booking and make the reason actionable. **Cancelled variant:** Show “Cancelled” prominently, suppress booking CTA, and offer alternative departures.

Pickup guidance must be phrased as a clear action (“Arrive 15 minutes before ship time for manifest scan”), not atmospheric lore. Do not call the schematic route a live map. If the prototype does not connect to real-time tracking, state that explicitly.

---

## 5. Screen D — Search and trip-detail pickers

Keep each picker focused rather than combining date, station and passenger selection into an overloaded modal. Use a bottom sheet with a visible title, close/back control and one clear current selection.

### Station picker

```text
┌──────────────────────────────────┐
│ [×] Choose departure              │
│ [Search planets or stations…]     │
│ Sol system                       │
│ Earth     Orbital Gate 1          │
│ Luna      Tranquility Terminal    │
│ Mars      Olympus Transit Hall    │
│ Titan     Kraken Mare Pier        │
│ Europa    Galileo Ice Terminal    │
│ Vulcan    T'Khasi Landing Apron    │
└──────────────────────────────────┘
```

Display station names and their terminals together. Mark the selected station, and return immediately after selection. Origin and destination use the same picker with a contextual title. Avoid an empty search result that looks like a failure; explain and allow clearing the query.

### Departure date picker

Show a calendar with the month/year heading, weekday abbreviations, selected day and disabled past days. Include an accessible textual selected-date summary (for example, “Wednesday, 21 October”) before an “Apply” CTA. The next-day shortcut must derive from the current selected date, not reset unrelated journey preferences.

### Traveler count picker

```text
┌──────────────────────────────────┐
│ Travelers                        │
│ Passengers sharing this booking  │
│ [−]                 1           [+]│
│ 8 travelers maximum per booking  │
│                   [Apply]        │
└──────────────────────────────────┘
```

Disable decrement at one and increment at the supported maximum; speak the count in accessibility state. Changing passenger count updates results and fare estimates.

---

## 6. Screen E — Fare review and demo checkout

**Purpose:** Prevent surprise charges and make the demo-only nature of this concept unmistakable before the confirm action.

```text
┌──────────────────────────────────┐
│ [×] Review your ride             │
│ Wed, 21 Oct · 08:30 UTC          │
│ Earth → Luna · Orbital Gate 1     │
│ Lunar Link · 1 traveler           │
├──────────────────────────────────┤
│ Fare             24 credits       │
│ Service fee       3 credits       │
│ Total            27 credits       │
│                                  │
│ Scotty demo wallet    500 credits │
│ Fictional demo credits only.      │
│ No real money or card is used.    │
│                                  │
│ [Confirm demo booking · 27 credits]│
│ [Back to ride details]            │
└──────────────────────────────────┘
```

Recalculate the total as per-person fare × traveler count plus the explicitly itemized per-traveler service fee. Show current demo wallet balance and post-booking balance where useful. Do not show a credit-card form, billing-address field or “payment processed” message; there is no real payment provider in the prototype.

While confirming, disable duplicate taps and prevent the sheet being dismissed accidentally. Show a concise progress state. If availability changed, wallet balance is insufficient or service is unavailable, keep the traveler’s route context, explain the issue in the selected language, refresh availability/balance where appropriate, and offer an actionable next step. Do not charge twice when a network retry returns a prior successful booking.

---

## 7. Screen F — Booking confirmation / Receipt

**Purpose:** Confirm what is booked and place operational boarding details first.

```text
┌──────────────────────────────────┐
│             ✓                    │
│ Your ride is confirmed           │
│ Demo booking · no real payment   │
│                                  │
│ SC-1A2B3C4D5E                   │
│ Wed, 21 Oct · Ship time (UTC)    │
│ 08:30 Earth → 09:05 Luna         │
│ Orbital Gate 1 · Gate E-01       │
│ Comet Van 7 · Lunar Link          │
│ 1 traveler · 27 demo credits     │
│                                  │
│ [View boarding pass]             │
│ [My trips]                       │
│ [Done]                           │
└──────────────────────────────────┘
```

Use a short, readable reference. Confirmation must be based on a saved booking result, not just a pressed button. State whether a ticket is confirmed or cancelled and make no unsupported claim about email delivery. Optionally provide copy-reference as a secondary control with a success announcement. After leaving, the booking appears under My Trips and the demo wallet ledger reflects the debit.

---

## 8. Screen G — Boarding pass

**Purpose:** Make the ticket scannable/readable and unambiguous at a fictional gate, even when shown quickly on a phone.

```text
┌──────────────────────────────────┐
│ [‹] Boarding pass         [Share]│
│           CONFIRMED               │
│ Earth ━━━━━━━━━━━━━━━━ Luna       │
│ Orbital Gate 1     Tranquility Pad│
│                                  │
│ WED · 21 OCT                     │
│ DEPARTS 08:30 UTC · ARRIVES 09:05 UTC
│ Board: Gate E-01 · Comet Van 7   │
│ Operator: Lunar Link              │
│ Traveler(s): 1                   │
│ Booking: SC-1A2B3C4D5E           │
│                                  │
│ [Decorative ticket barcode]       │
│ Demo ticket · no real-world use  │
│ [Trip details]                    │
└──────────────────────────────────┘
```

If no gate scanning infrastructure exists, the barcode/QR must be clearly decorative or omitted; never imply that it validates real travel. Keep reference, selected date, terminal, gate and UTC departure legible without requiring scroll on the target phone size. Localize all labels and retain numeric UTC times.

---

## 9. Screen H — My Trips

**Purpose:** Retrieve bookings without searching and distinguish future, completed and cancelled trips.

```text
┌──────────────────────────────────┐
│ My trips                         │
│ [Upcoming]       [Past]          │
├──────────────────────────────────┤
│ ┌ CONFIRMED · Wed, 21 Oct ──────┐│
│ │ Earth 08:30 UTC → Luna 09:05  ││
│ │ Orbital Gate 1 · Gate E-01    ││
│ │ Comet Van 7 · 1 traveler       ││
│ │ [Boarding pass] [Cancel trip]  ││
│ └───────────────────────────────┘│
│ [another booking]                 │
├──────────────────────────────────┤
│ Overview · Find · Trips · Wallet │
└──────────────────────────────────┘
```

Upcoming contains only confirmed departures whose effective departure time has not passed. Past contains completed/departed journeys and cancellations, with explicit status. Cancel should open a confirmation step that states the refund amount in **demo credits** before calling cancellation. After departure, do not offer a cancel/refund action; the server must enforce the same rule as the UI. Booking details open the same boarding-pass view from confirmation.

**Empty states:** Upcoming → “No trips booked yet” + Find a ride. Past → “No past journeys yet.” **Loading/error states:** use a restrained skeleton or loading label, and a retry action that preserves selected tab. Refresh should not erase cached readable trips while reloading.

---

## 10. Screen I — Explore / Galactic map

**Purpose:** Browse destinations and understand shared transit corridors, pickup environments and suggested routes.

```text
┌──────────────────────────────────┐
│ Explore the network              │
│ Sol sector · 6 stations           │
│                                  │
│ ┌ Interactive schematic map ────┐│
│ │ Earth ── Luna ── Mars ── Titan││
│ │           Europa       Vulcan ││
│ │ [−] [+] [Reset view]           ││
│ │ Pickup ●  Destination ◉        ││
│ │ Illustrative · not live tracking││
│ └───────────────────────────────┘│
│ Choose a world                   │
│ [Luna card]  [Mars card]         │
│ [Titan card] [Europa card]       │
│                                  │
│ Selected: Luna                   │
│ Tranquility Terminal             │
│ Pickup: Mare Tranquillitatis Pad │
│ Follow the silver beacon to dock │
│ [Find rides to Luna →]           │
├──────────────────────────────────┤
│ Overview · Find · Trips · Wallet │
└──────────────────────────────────┘
```

Selecting a map node and selecting its destination card have the same result: a selected-state summary with station name, terminal, meeting point, localized guidance and a route CTA. Provide non-map station cards as an equivalent, accessible navigation method. The route CTA pre-populates Find with the selected destination and a sensible origin; traveler must be able to edit both. Do not suggest that schematic distances or map positions are navigationally accurate.

---

## 11. Screen J — Demo wallet

**Purpose:** Explain the fictitious credit balance and show a trustworthy ledger of demo debits/refunds.

```text
┌──────────────────────────────────┐
│ Wallet                           │
│ DEMO WALLET                      │
│ 473 credits                      │
│ Fictional test credits only.     │
│ No real currency or card payment.│
│                                  │
│ Activity                  [↻]    │
│ +500  Welcome demo credits       │
│ −27   Ride booking · SC-…        │
│ +27   Ride refund · SC-…         │
│ Date and transaction status      │
│                                  │
├──────────────────────────────────┤
│ Overview · Find · Trips · Wallet │
└──────────────────────────────────┘
```

Use plus/minus and text labels as well as color. Show localized dates, stable amount alignment and newest activity first. Do not present top-up or card-adding functionality in this demo. If the wallet is unavailable, show a retryable connection state without pretending the balance is zero. Opening balance and every debit/refund must be distinguishable in the ledger.

---

## 12. Screen K — Settings and language

**Purpose:** Let commuters and visitors select their interface language and adjust reminders without losing confidence about current preferences.

```text
┌──────────────────────────────────┐
│ [‹] Settings                     │
│                                  │
│ Language                         │
│ Change the app’s display language│
│ (●) English                      │
│ ( ) Español                      │
│ ( ) Français                     │
│                                  │
│ Travel reminders         [ ON ]  │
│ Departure-time notifications     │
│                                  │
│ Help and travel guidance      [›]│
│ About Scotty · Concept edition 1.0│
│ Fictional travel · Demo credits  │
└──────────────────────────────────┘
```

Language selection should update the current interface immediately and persist on device. Localize form labels, confirmation/cancellation copy, station guidance, booking statuses, empty/error states and date formats—not only the Settings labels. Reminders are a stored preference in this prototype; clearly communicate if the control does not schedule real OS notifications. About/help must explain concept limitations without surfacing invented customer-support channels.

---

## 13. Cross-screen overlays and feedback

### Cancellation confirmation

```text
┌──────────────────────────────────┐
│ Cancel this ride?                │
│ Earth → Luna · Wed, 21 Oct       │
│ Refund 27 demo credits to wallet │
│ The journey will be marked       │
│ cancelled.                       │
│ [Keep ride] [Confirm cancellation]│
└──────────────────────────────────┘
```

On success, show a succinct confirmation, update Trips and Wallet, release seats, and prevent duplicate refunds. On refusal because the service already departed, keep the booking unchanged and refresh its status.

### Notifications and help

Use short, dismissible in-app feedback. Announce booking/cancellation success to accessibility services. Do not place important error messages only in a transient toast. Help can be a short static guide to ship times (UTC), pickup directions, shared rides and demo credits.

---

## 14. Compact component and spacing blueprint

| Element | Wireframe guidance |
|---|---|
| Primary screen margin | 20 pt horizontal; 16–24 pt vertical rhythm |
| Main page heading | 30–36 pt display style; short lines, no text hidden behind map |
| Secondary page title | 21–24 pt; header height ~52 pt plus top safe area |
| Search field | Full-width card row, 60–70 pt tall, label + selected value + terminal |
| Primary CTA | Full width on phone, at least 48 pt tall; plain action verb and arrow |
| Journey card | 16 pt internal padding; route times at opposite ends; status visible at top |
| Secondary copy | 12–14 pt; maintain contrast and meaningful line height |
| Status pill | Text + optional icon; green for on-time/confirmed, amber delay, muted cancelled |
| Bottom navigation | Five destinations, ~66 pt plus bottom safe inset, active item explicit |
| Bottom sheet | 24 pt top corner radius; title/close pinned; scroll body; CTA anchored above safe area |

Do not compress essential actions into a horizontal row on a 320 pt device. Stack traveler/date fields and allow the CTA to occupy a full line. Keep departure/arrival columns balanced; abbreviate station subtitle only when the complete pickup remains available in detail view. If long translations wrap, let cards grow vertically instead of clipping text.

---

## 15. End-to-end screen flow

```text
Overview
  ├─ Choose origin/destination/date/travelers
  ├─ Find my ride → Results → Journey details
  │                         └─ Review fare → Confirm demo booking
  │                                               └─ Confirmation
  │                                                   ├─ Boarding pass
  │                                                   └─ My trips
  ├─ Departure card → Journey details
  ├─ Map/destination → station summary → Results
  ├─ My trips → Boarding pass / Cancel confirmation → Wallet update
  ├─ Wallet → transaction history
  └─ Language / reminder controls → Settings
```

Preserve user-entered route, date and traveler count through results, detail, fare review, recoverable service errors and return navigation. The server remains authoritative for seats, fare, booking, demo wallet balance, cancellation cutoff and refund; client-side wireframes communicate these states but cannot replace server validation.
