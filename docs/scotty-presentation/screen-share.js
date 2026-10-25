export function mountPresentation(scope=document){
 const root=scope.matches?.('.presentation-root')?scope:scope.querySelector('.presentation-root');if(!root)return()=>{};
 const device=root.querySelector('.presentation-device'),frame=device.querySelector('iframe');root.classList.add('share-ready');
 const controls=document.createElement('nav');controls.className='share-controls';controls.setAttribute('aria-label','Presentation controls');controls.innerHTML='<button data-share="overview" aria-pressed="true">Overview</button><button data-share="demo" aria-pressed="false">App demo</button><button data-share="video" aria-haspopup="dialog">Walkthrough</button><button data-share="fullscreen">Full screen</button>';root.append(controls);
 const dialog=document.createElement('dialog');dialog.className='share-video';dialog.innerHTML='<header><span>SCOTTY / HOW IT WORKS</span><button aria-label="Close walkthrough">Close ×</button></header><video controls playsinline preload="metadata"><source src="./SCOTTY-Presentation.webm" type="video/webm"></video>';root.append(dialog);const video=dialog.querySelector('video');
 function fit(){const width=device.clientWidth-20;device.style.setProperty('--phone-scale',String(width/390));}
 function setDemo(on){root.classList.toggle('share-demo',on);controls.querySelector('[data-share="overview"]').setAttribute('aria-pressed',!on);controls.querySelector('[data-share="demo"]').setAttribute('aria-pressed',on);requestAnimationFrame(fit)}
 function closeVideo(){video.pause();dialog.close();controls.querySelector('[data-share="video"]').focus()}
 async function full(){try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen()}catch{controls.querySelector('[data-share="fullscreen"]').textContent='Use browser full screen'}}
 function openVideo(){dialog.showModal();video.play().catch(()=>{});}
 controls.querySelector('[data-share="overview"]').onclick=()=>setDemo(false);controls.querySelector('[data-share="demo"]').onclick=()=>setDemo(true);controls.querySelector('[data-share="video"]').onclick=openVideo;controls.querySelector('[data-share="fullscreen"]').onclick=full;dialog.querySelector('button').onclick=closeVideo;dialog.addEventListener('cancel',()=>video.pause());
 function key(e){if(e.ctrlKey||e.metaKey||e.altKey||e.target.closest('input,textarea,select'))return;if(e.key.toLowerCase()==='f'){e.preventDefault();full()}if(e.key.toLowerCase()==='d')setDemo(!root.classList.contains('share-demo'));if(e.key.toLowerCase()==='v'&&!dialog.open)openVideo();if(e.key==='Escape'&&!dialog.open)setDemo(false)}
 const observer=new ResizeObserver(fit);observer.observe(device);document.addEventListener('keydown',key);fit();
 return()=>{observer.disconnect();document.removeEventListener('keydown',key);video.pause();dialog.remove();controls.remove();root.classList.remove('share-ready','share-demo')};
}
