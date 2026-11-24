import { useEffect, useRef, useState } from 'react';
import { config } from './config';
export default function HaircutGallery() {
  const [ready,setReady]=useState(false),[index,setIndex]=useState(0);
  const start=useRef<{x:number;y:number}|null>(null);
  const views=[{label:'Frente',src:config.haircut.front},{label:'Perfil',src:config.haircut.profile},{label:'Nuca',src:config.haircut.back}];
  useEffect(()=>{
    if(!views.every(v=>v.src))return;
    let active=true;
    Promise.all(views.map(v=>new Promise<void>((resolve,reject)=>{const image=new Image();image.onload=()=>image.naturalWidth>0?resolve():reject();image.onerror=reject;image.src=v.src;}))).then(()=>{if(active)setReady(true);}).catch(()=>{if(active)setReady(false);});
    return()=>{active=false;};
  },[]);
  if(!ready)return null;
  return <div className="haircut-gallery" aria-label="Vistas do corte afro com degradê"><div className="haircut-image" onPointerDown={e=>{start.current={x:e.clientX,y:e.clientY};}} onPointerMove={e=>{const p=start.current;if(p&&Math.abs(e.clientY-p.y)>Math.abs(e.clientX-p.x)&&Math.abs(e.clientY-p.y)>10)start.current=null;}} onPointerUp={e=>{const p=start.current;start.current=null;if(!p)return;const dx=e.clientX-p.x,dy=e.clientY-p.y;if(Math.abs(dx)>35&&Math.abs(dx)>Math.abs(dy))setIndex(i=>(i+(dx<0?1:2))%3);}} onPointerCancel={()=>{start.current=null;}}>
    <img src={views[index].src} alt={`Ilustração do mesmo corte afro com degradê — ${views[index].label}`} draggable="false" onError={()=>setReady(false)}/>
    </div><p className="gallery-hint">Deslize para ver o corte</p><div className="angle-controls" role="group" aria-label="Ângulo do corte">{views.map((v,i)=><button key={v.label} aria-pressed={i===index} onClick={()=>setIndex(i)} onKeyDown={e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();const next=(i+(e.key==='ArrowRight'?1:2))%3;setIndex(next);(e.currentTarget.parentElement!.children[next] as HTMLButtonElement).focus();}}}>{v.label}</button>)}</div></div>;
}
