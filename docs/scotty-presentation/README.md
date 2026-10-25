# SCOTTY commuter presentation

A self-contained classroom web presentation and interactive ride-booking study. This folder is separate from the existing Expo/React Native app.

Serve the repository docs folder with a static HTTP server and open `scotty-presentation/SCOTTY-Phone-Presentation.html`. The overview fits laptop sharing windows. Toolbar actions switch between Overview, App demo, Walkthrough and Full screen. The static page needs no React build. `App.jsx` is an optional React integration source; a React build of this component has not been verified.

`index.html` opens the app directly. The interface includes Seattle street routing, private ships and shared rocket buses, pilot reviews, checkout and a departure animation. Transport, bus schedules, launchpads, users and reviews are fictional class-assignment fixtures. No payments or real bookings are processed. Seattle map tiles and routing need network access; the default route has a local fallback. Solar System positions use Astronomy Engine and the device UTC clock.

Assets: Proteron models by Viktor Hahn, CC BY 4.0; Star Destroyer model by rubaun, CC BY 4.0. Credits and source links are in `models/`. The Star Destroyer source contains embedded author/license metadata. Pilot portraits are character stills from official Star Trek pages, used for this classroom study; franchise publication rights have not been cleared. Atreyu's profile image was supplied by the project owner. Fonts and license texts are retained in `fonts/`. Generated-art provenance is in `generation-log.json`. The generated source studies and other local drafts are not part of this export.

Validation evidence: `screen-share-verification.json`, `experience-verification.json`, and `experience-booking-verification.json`. Browser checks include screen-share layout, toolbar actions, full-screen, video playback, motion pause and a booking reaching the riding state. Physical iOS/Android behavior is not certified.

This folder is ready to serve from its own relative path. Adding it on a branch does not deploy it. The repository's existing GitHub Pages workflow serves `docs` on pushes to main.
