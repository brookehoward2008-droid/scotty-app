import { useEffect, useRef } from 'react';
import { mountPresentation } from './screen-share.js';
import './ScottyPresentation.css';
import './scotty-typography.css';
import './screen-share.css';

/** Serve the SCOTTY outputs beside this component, or pass the hosted app URL. */
export default function App({ appUrl = './index.html?skip=1' }) {
  const rootRef = useRef(null);
  useEffect(() => mountPresentation(rootRef.current), []);
  return (
    <main className="presentation-root" ref={rootRef}>
      <div className="presentation-nebula" aria-hidden="true" />
      <section className="presentation-story" aria-labelledby="presentation-heading">
        <p className="presentation-eyebrow">SCOTTY / YOUR DAILY CONNECTION</p>
        <h1 id="presentation-heading">Beam me up,<br /><span>Scotty.</span></h1>
        <p className="presentation-intro">Your ship. Your rocket bus. Your daily ride.</p>
        <div className="presentation-route" aria-label="Example route: Earth Spacedock to Vulcan ShiKahr">
          <div><span className="route-dot" /><p><strong>Earth</strong><small>Spacedock</small></p></div>
          <span className="presentation-route-line" aria-hidden="true" />
          <div><span className="route-dot route-dot-gold" /><p><strong>Vulcan</strong><small>ShiKahr</small></p></div>
        </div>
        <div className="presentation-services">
          <article><span className="presentation-service-label">01 / PRIVATE</span><h2>Book a ship.</h2><p>Your pilot. Your departure.<br />One fare for your ship.</p></article>
          <article><span className="presentation-service-label">02 / SHARED</span><h2>Ride a rocket bus.</h2><p>Scheduled connections.<br />Reserve a seat for your commute.</p></article>
        </div>
        <a className="presentation-open" href={appUrl} target="_blank" rel="noreferrer">Open SCOTTY full screen <span aria-hidden="true">↗</span></a>
        <p className="presentation-hint">Try the phone: plan a route, compare pilots, read reviews and book a ride.</p>
        <footer className="presentation-footnote">UI/UX class assignment · Fictional transport, schedules and reviews.</footer>
      </section>
      <section className="presentation-device-stage" aria-label="Interactive SCOTTY mobile app">
        <div className="presentation-device"><iframe title="SCOTTY commuter app — interactive phone preview" src={appUrl} loading="eager" allow="fullscreen" /></div>
        <p className="presentation-device-caption"><span aria-hidden="true" /> LIVE INTERACTIVE APP</p>
      </section>
    </main>
  );
}
