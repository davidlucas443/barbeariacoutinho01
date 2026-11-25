import { Emblem } from './Brand';
import { config, unitCutLink, whatsappLink } from './config';

function ArrowIcon({ diagonal = false }: { diagonal?: boolean }) {
 return <svg className="bio-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
  {diagonal ? <path d="M7 17 17 7M8 7h9v9"/> : <path d="M4 12h15m-6-6 6 6-6 6"/>}
 </svg>;
}

export default function Bio(){
 return <main className="bio-page">
  <header className="bio-heading"><Emblem/><p className="bio-kicker">BARBEARIA & ESCOLA</p><h1>Barbearia Coutinho</h1><p className="bio-since">Desde 2014</p></header>
  <nav className="bio-links" aria-label="Links da Coutinho">
   <a className="bio-action bio-course" href={whatsappLink('course')} target="_blank" rel="noreferrer"><span className="bio-label">Consultar próximas turmas</span><ArrowIcon diagonal/><small>Seu futuro começa com um ofício.</small></a>
   {config.units.map(unit=><a className="bio-action" key={unit.name} href={unitCutLink(unit)} target="_blank" rel="noreferrer"><span>Agendar corte · {unit.district}</span><ArrowIcon diagonal/></a>)}
   <a className="bio-action bio-home" href="/"><span>Conhecer a Barbearia Coutinho</span><ArrowIcon/></a>
  </nav>
  <footer className="bio-footer">Aqui transformamos estilos<br/>e construímos futuros.</footer>
 </main>;
}
