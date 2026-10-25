/** Restored from Brooke's supplied phone mockup; decorative, never a logo. */
export function SpaceScene() {
  return <div aria-hidden="true" className="scotty-space-scene">
    <style>{`
      .scotty-space-scene { position:absolute; inset:0; pointer-events:none; overflow:hidden;
        background:radial-gradient(circle at 50% 18%,rgba(99,126,153,.2),transparent 36%),linear-gradient(180deg,#040b12,#091821); }
      .scotty-space-scene .screen-stars { position:absolute;inset:0;opacity:.9;
        background:radial-gradient(circle at 20% 22%,#ffffffcc 0 1.2px,transparent 2px),radial-gradient(circle at 32% 44%,#ffffffb3 0 1.1px,transparent 2px),radial-gradient(circle at 58% 18%,#ffffffb3 0 1.2px,transparent 2px),radial-gradient(circle at 75% 34%,#ffffffcc 0 1.2px,transparent 2px),radial-gradient(circle at 70% 72%,#ffffffcc 0 1.2px,transparent 2px); }
      .scotty-space-scene .planet { position:absolute;left:50%;top:15%;width:310px;height:310px;transform:translateX(-50%);border-radius:50%;
        background:radial-gradient(circle at 35% 35%,#f0bb72 0%,#87573a 24%,#1d2d35 62%,#091821 100%);
        box-shadow:inset -16px -16px 24px #0003,0 0 90px #f0c57d22; }
      .scotty-space-scene .vignette {position:absolute;inset:0;background:linear-gradient(180deg,#040b1210,#040b1266),radial-gradient(circle at center,transparent 58%,#02080cb3);}
    `}</style>
    <div className="screen-stars" /><div className="planet" /><div className="vignette" />
  </div>;
}
