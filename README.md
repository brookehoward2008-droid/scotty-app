# scotty

Brooke Howard's retro space-travel app, built with Expo and React Native for web, Android and iOS. Retains the existing Scotty wordmark and logo.

## Run

```sh
pnpm install --frozen-lockfile
pnpm exec expo start --go
```

## Self-contained web demo

```sh
pnpm share:build
pnpm share:preview
```

Open http://localhost:8090. This explicit demo uses browser-local bookings and fictional credits, with no real payments or transport services. Each browser starts with 500 demo credits. Clearing site storage resets that browser's demo. The source also retains a separate MySQL-backed API; it requires configured service credentials and is not activated as a fallback.

## Checks

```sh
pnpm check
pnpm test
```

## Portfolio

[Brooke's clean26 portfolio](https://brookehoward2008-droid.github.io/clean26/)

[Open the interactive phone](https://brookehoward2008-droid.github.io/scotty-app/phone.html)

The phone screen embeds the working app, with search, demo booking, trips, cancellation and refunds. Its hardware frame and space-scene styling are adapted from Brooke's supplied HTML mockup; the existing logo remains intact. Open `/phone.html` on the local web preview to use the phone presentation.

## Current state

The booking flow, cancellation/refund, route selection and mobile layout have been tested in Chromium, including inside the phone frame. Native device testing remains outstanding. The restored space scene uses the navy and gold treatment from Brooke's phone mockup. The demo stores bookings separately in each browser; it is not a shared live reservation service.

Existing fonts retain their licenses in `assets/fonts/`. Brand specifications and wireframes are included for project context.

## SCOTTY screen-share presentation

The separate [classroom web presentation](docs/scotty-presentation/README.md) includes a compact overview, interactive app demo, recorded walkthrough, and full-screen controls. Source and assets are under `docs/scotty-presentation/`; the existing Expo app is preserved.
