const CACHE_NAME = 'secao-carga-v2-condensado-cic';
const APP_SHELL = [
  './','./index.html','./manifest.json','./condensado-carga-u39.html?v=2',
  './icons/icon-192.png','./icons/icon-512.png','./icons/icon-maskable-192.png','./icons/icon-maskable-512.png'
];
const MARKER = '<section class="quick-grid">';
const CARD_ID = 'emergencia-condensado-carga-v2';
const CARD = `
<section id="${CARD_ID}" class="card" style="padding:16px;border-color:#396c86;background:linear-gradient(180deg,#102b3c,#0a1822);display:grid;grid-template-columns:minmax(0,1fr) auto;gap:14px;align-items:center">
  <div>
    <div style="font-size:11px;font-weight:900;letter-spacing:.08em;color:#9ee5ff;margin-bottom:5px">💧 EMERGÊNCIA DE CARGA • CIC</div>
    <b style="font-size:18px">Presença de Condensado na Carga U-39</b>
    <p style="margin:6px 0 0;color:#9db3c5;line-height:1.45">PT/PI de carga • FIC-39152 MAN • carga fria → carga quente • identificar → bloquear → estabilizar → AUTO.</p>
  </div>
  <a class="btn primary" href="./condensado-carga-u39.html?v=2" style="text-decoration:none;white-space:nowrap">💧 Treinar emergência</a>
</section>
`;
function inject(html){
  if(!html || html.includes(`id="${CARD_ID}"`)) return html;
  if(!html.includes(MARKER)) return html;
  return html.replace(MARKER, `${CARD}
${MARKER}`);
}
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(APP_SHELL)));self.skipWaiting();});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE_NAME).map(k=>caches.delete(k)))));self.clients.claim();});
self.addEventListener('fetch',e=>{
 if(e.request.method!=='GET') return;
 const u=new URL(e.request.url);
 const isMain=u.origin===self.location.origin&&(u.pathname.endsWith('/Secao-carga-U39/')||u.pathname.endsWith('/Secao-carga-U39/index.html'));
 if(isMain){e.respondWith(fetch(e.request,{cache:'no-store'}).then(async r=>{if(!r||!r.ok)return r;const h=await r.text();const hd=new Headers(r.headers);hd.set('Content-Type','text/html; charset=utf-8');const rr=new Response(inject(h),{status:r.status,statusText:r.statusText,headers:hd});caches.open(CACHE_NAME).then(c=>c.put(e.request,rr.clone()));return rr;}).catch(()=>caches.match(e.request).then(async c=>{if(!c)return caches.match('./index.html');return new Response(inject(await c.text()),{status:200,headers:{'Content-Type':'text/html; charset=utf-8'}})})));return;}
 e.respondWith(fetch(e.request).then(r=>{const cp=r.clone();caches.open(CACHE_NAME).then(c=>c.put(e.request,cp));return r;}).catch(()=>caches.match(e.request).then(c=>c||caches.match('./index.html'))));
});
