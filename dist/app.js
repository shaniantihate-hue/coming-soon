const stage=document.querySelector('#stage');
const artifact=document.querySelector('#artifact');
const tilt=document.querySelector('.artifact-tilt');
const motion=document.querySelector('#motion');
const announcement=document.querySelector('#announcement');
const reduce=matchMedia('(prefers-reduced-motion: reduce)');
let enabled=!reduce.matches;
let tx=0,ty=0,cx=0,cy=0,frame=0,last=performance.now(),pulseTimer;

document.querySelector('#year').textContent=new Date().getFullYear();

function setPoint(clientX,clientY){
  const box=stage.getBoundingClientRect();
  const localX=Math.max(0,Math.min(box.width,clientX-box.left));
  const localY=Math.max(0,Math.min(box.height,clientY-box.top));
  stage.style.setProperty('--mx',`${localX}px`);
  stage.style.setProperty('--my',`${localY}px`);
  const art=artifact.getBoundingClientRect();
  artifact.style.setProperty('--ax',`${Math.max(0,Math.min(art.width,clientX-art.left))}px`);
  artifact.style.setProperty('--ay',`${Math.max(0,Math.min(art.height,clientY-art.top))}px`);
  tx=Math.max(-1,Math.min(1,(clientX-(art.left+art.width/2))/(art.width/2)));
  ty=Math.max(-1,Math.min(1,(clientY-(art.top+art.height/2))/(art.height/2)));
}

stage.addEventListener('pointermove',event=>{
  if(!enabled||event.pointerType==='touch')return;
  setPoint(event.clientX,event.clientY);
  stage.classList.add('engaged');
  stage.style.setProperty('--reveal','12%');
});
stage.addEventListener('pointerleave',()=>{
  tx=ty=0;
  stage.classList.remove('engaged');
  stage.style.setProperty('--mx','50%');
  stage.style.setProperty('--my','50%');
  stage.style.setProperty('--reveal','11%');
  artifact.style.setProperty('--ax','50%');
  artifact.style.setProperty('--ay','50%');
});

artifact.addEventListener('click',event=>{
  const box=stage.getBoundingClientRect();
  setPoint(event.clientX||box.left+box.width/2,event.clientY||box.top+box.height/2);
  artifact.classList.remove('pulse');
  void artifact.offsetWidth;
  artifact.classList.add('pulse');
  stage.classList.add('engaged');
  stage.style.setProperty('--reveal','33%');
  announcement.textContent='Coming soon — a little more has been revealed.';
  clearTimeout(pulseTimer);
  pulseTimer=setTimeout(()=>{
    artifact.classList.remove('pulse');
    stage.style.setProperty('--reveal','11%');
    if(matchMedia('(hover:none)').matches)stage.classList.remove('engaged');
  },1700);
});

function loop(now){
  frame=0;
  if(!enabled||document.hidden)return;
  const dt=Math.min((now-last)/1000,.05);last=now;
  const ease=1-Math.exp(-dt*5);
  cx+=(tx-cx)*ease;cy+=(ty-cy)*ease;
  tilt.style.setProperty('--rx',`${-cy*4}deg`);
  tilt.style.setProperty('--ry',`${cx*5}deg`);
  tilt.style.setProperty('--tx',`${cx*5}px`);
  tilt.style.setProperty('--ty',`${cy*4}px`);
  frame=requestAnimationFrame(loop);
}
function start(){if(enabled&&!frame&&!document.hidden){last=performance.now();frame=requestAnimationFrame(loop)}}
function syncMotion(){
  document.body.classList.toggle('paused',!enabled);
  motion.setAttribute('aria-pressed',String(enabled));
  motion.setAttribute('aria-label',enabled?'Pause motion':'Play motion');
  motion.querySelector('.motion-mark').textContent=enabled?'Ⅱ':'▷';
  motion.querySelector('span:last-child').textContent=enabled?'Motion on':'Motion off';
  if(enabled)start();else{cancelAnimationFrame(frame);frame=0;tx=ty=cx=cy=0;tilt.style.cssText=''}
}
motion.addEventListener('click',()=>{enabled=!enabled;syncMotion()});
reduce.addEventListener('change',event=>{enabled=!event.matches;syncMotion()});
document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(frame);frame=0}else start()});
syncMotion();
