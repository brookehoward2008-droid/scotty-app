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

## Current state

The booking flow, cancellation/refund, route selection and mobile layout have been tested in Chromium. Native device testing remains outstanding. Restoration of the full blue/cyan space-scene styling requested by Brooke is still pending; the current source retains the earlier palette. This repository is source publication, not proof of a publicly hosted app.

Existing fonts retain their licenses in `assets/fonts/`. Brand specifications and wireframes are included for project context.
