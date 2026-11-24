import { useEffect, useRef, useState } from 'react';
import { config, unitCutLink } from './config';
import { areaLink, distanceKm, hasCoordinates, routeLink } from './locations';
export default function Units(){
 const [nearest,setNearest]=useState<number|null>(null),[status,setStatus]=useState(''),[busy,setBusy]=useState(false);
 const active=useRef(true);useEffect(()=>{active.current=true;return()=>{active.current=false;};},[]);
 const canLocate=config.units.length===2&&config.units.every(unit=>hasCoordinates(unit)&&!!routeLink(unit));
 function locate(){
   if(!canLocate||busy)return;
   setNearest(null);
   if(!navigator.geolocation){setStatus('Localização indisponível neste navegador. Escolha uma das unidades abaixo.');return;}
   setBusy(true);setStatus('Consultando sua localização…');
   navigator.geolocation.getCurrentPosition(position=>{
     if(!active.current)return;
     const point={latitude:position.coords.latitude,longitude:position.coords.longitude};
     const distances=config.units.map(unit=>distanceKm(point,unit.coordinates!));
     const index=distances[0]<=distances[1]?0:1;
     setNearest(index);setBusy(false);setStatus(`${config.units[index].name} é a mais próxima em linha reta (aproximadamente ${distances[index].toLocaleString('pt-BR',{maximumFractionDigits:1})} km). Isso não indica tempo de deslocamento.`);
   },error=>{if(!active.current)return;setBusy(false);setStatus(error.code===1?'Permissão de localização negada. Você pode escolher qualquer unidade abaixo.':'Não foi possível obter sua localização. Escolha uma unidade abaixo.');},{enableHighAccuracy:false,timeout:10000,maximumAge:0});
 }
 return <section id="unidades" className="units"><div className="units-heading"><p className="eyebrow">ENCONTRE A COUTINHO</p><h2>Duas unidades.<br/><em>A mesma essência.</em></h2></div>
 {canLocate&&<div className="nearest-action"><button className="button" disabled={busy} onClick={locate}>{busy?'Localizando…':'Ver unidade mais próxima'}</button><p>A comparação usa distância em linha reta, não tempo de viagem. Sua posição é usada apenas neste navegador para o cálculo.</p></div>}
 <p role="status" aria-live="polite" className="location-status">{status}</p>
 <div className="unit-grid">{config.units.map((unit,index)=>{const route=routeLink(unit);return <article className={`unit-card ${nearest===index?'is-nearest':''}`} key={unit.name} aria-label={`${unit.name} — ${unit.district}`}>
 <span className="unit-label">{unit.name}</span>{nearest===index&&<span className="nearest-badge">Mais próxima em linha reta</span>}<h3>{unit.district}</h3>{unit.address&&<p>{unit.address}</p>}{unit.hours&&<p>{unit.hours}</p>}
 <a className="button unit-booking" href={unitCutLink(unit)} target="_blank" rel="noreferrer">Agendar corte</a>
 {route?<a className="unit-contact" href={route} target="_blank" rel="noreferrer">Traçar rota</a>:<><p className="location-pending">Localização aproximada da região.<br/>Endereço da unidade ainda não confirmado.</p><a className="text-link" href={areaLink(unit)} target="_blank" rel="noreferrer">Ver região no mapa</a></>}
 </article>;})}</div></section>;
}
