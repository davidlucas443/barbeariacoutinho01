import { useEffect, useState } from 'react';

// Project a helical pattern onto a cylinder: asin compresses the stripes at its edges.
// One texture tile equals one complete mechanical cycle; only this layer moves.
export default function BarberPole(){
 const [texture,setTexture]=useState('');
 useEffect(()=>{
  const canvas=document.createElement('canvas');canvas.width=240;canvas.height=320;
  const ctx=canvas.getContext('2d');if(!ctx)return;
  const pixels=ctx.createImageData(canvas.width,canvas.height);
  const colors=[[190,19,39],[243,243,237],[16,65,159],[243,243,237]];
  for(let x=0;x<240;x++){
   const normal=(x+.5)/240*2-1,angle=Math.asin(normal);
   const light=.56+.44*Math.sqrt(1-normal*normal);
   for(let y=0;y<320;y++){
    const phase=((y/320+angle/(2*Math.PI))%1+1)%1;
    const color=colors[Math.floor(phase*4)],i=(y*240+x)*4;
    for(let c=0;c<3;c++)pixels.data[i+c]=Math.round(color[c]*light);
    pixels.data[i+3]=255;
   }
  }
  ctx.putImageData(pixels,0,0);setTexture(canvas.toDataURL());
 },[]);
 return <div className="barber-pole" aria-hidden="true">
  <img className="pole-structure" src="/images/barber-pole-standalone.png" alt="" width="887" height="1774"/>
  <div className="pole-body"><div className="pole-stripes" style={texture?{backgroundImage:`url(${texture})`}:undefined}/><div className="pole-glass"/></div>
 </div>;
}
