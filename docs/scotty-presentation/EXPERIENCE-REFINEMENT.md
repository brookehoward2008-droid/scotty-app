# SCOTTY experience refinement

Target: supplied phone screenshot and feedback that controls dominate the map and background craft look like a repeated GIF. Preserve the approved SCOTTY hook, typefaces, pilot casting, private/shared booking flow, and authored models.

Implemented:
- One compact mobile map-options button discloses zoom, recenter, motion, trips and ship inspection. Default map tools no longer occupy several stacked floating panels. Options supports Escape and outside-click dismissal.
- Visible map-options circle is 34px inside a 44px button; menu actions remain 44px targets. Booking CTAs are 44px mobile / 42px desktop. Progress uses a compact current-step label and numbered remaining steps.
- Desktop booking width reduced from 390px to 350px, with shorter controls/cards and less padding. Mobile collapsed booking sheet reduced from 49dvh to 44dvh. Reading sizes remain deliberate; fields retain 16px mobile text to avoid focus zoom.
- Seattle ordinary landmarks use small pins. Only pickup/destination names are persistently shown; other names appear on hover/focus or remain in accessible labels. Launchpads use 32px visible symbols inside 44px buttons. The launchpad network is a compact disclosure.
- Map bounds enlarged so the mobile camera can frame both selected stops above the booking sheet. Previous max-bounds constraints prevented that camera shift even with correct padding.
- Three.js traffic now uses curved paths and changing pitch/bank with four depth bands, perspective compensation, distance fog, per-instance edge fading, and planet-silhouette occlusion. Background traffic is capped at twelve desktop/six mobile, with fewer visible when outside the viewport or behind planets. Clones share authored geometry; the scene is not a video or GIF.
- Selected spacecraft reduced in size, especially rocket buses. Hull exposure, reflections and fill light reduced to retain texture and shading. Existing Star Destroyer and Proteron geometry/credits retained.
- Nebula distortion reduced from 7% to 1.4%; image brightness reduced to keep the texture from reading as a liquid video backdrop.

Scope limit: the map remains Leaflet with shader planets and a separate Three.js ship scene. Planet occlusion is screen-space masking, not shared planet/ship depth geometry or a cinematic orbital simulator. Traffic and transport remain fictional class-assignment data. Physical-device performance is unverified.

Provider/access check, 2026-10-25: no callable Midjourney tool or Midjourney catalog plugin was found. Midjourney stage remains pending; it was not used. No new raster art was generated: this revision refines existing licensed 3D assets and supplied/approved artwork. Zoom was tagged; the catalog reports an available but uninstalled Zoom connector. No meeting or account action occurred.

Evidence: experience-verification.json, experience-booking-verification.json, experience-space-desktop.png, experience-space-mobile.png, experience-seattle-mobile.png, experience-map-menu-mobile.png. The booking test exercises pilot review, selection, checkout and beginning travel. Existing WebM walkthrough is refreshed after the revision.

Further compacting after the follow-up "this is way too big": desktop top bar is 72px (previously 84px), booking panel 350px (previously 390px), primary actions 42px desktop / 44px mobile, and the collapsed mobile sheet occupies 44dvh. Cards, fields and gaps are shorter. A final Leaflet resize-settle pass keeps the selected stops framed after presentation/phone resizing; map maxBounds previously prevented the required camera shift. A fresh 390 x 844 check placed the selected stop centers at y=378 and y=192 with the booking sheet starting at y=472.6; the full booking flow reached riding with no JavaScript errors. At 320 x 568 the expanded sheet starts below the progress navigation (132px versus 118px).
