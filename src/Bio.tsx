import { Emblem } from './Brand';
import { config, unitCutLink, whatsappLink } from './config';

export default function Bio(){
 return <main className="bio-page">
  <header className="bio-heading"><Emblem/><p className="bio-kicker">BARBEARIA & ESCOLA</p><h1>Barbearia Coutinho</h1><p className="bio-since">Desde 2014</p></header>
  <nav className="bio-links" aria-label="Links da Coutinho">
   <a className="bio-action bio-course" href={whatsappLink('course')} target="_blank" rel="noreferrer"><span className="bio-label">Consultar próximas turmas</span><span aria-hidden="true">↗</span><small>Seu futuro começa com um ofício.</small></a>
   {config.units.map(unit=><a className="bio-action" key={unit.name} href={unitCutLink(unit)} target="_blank" rel="noreferrer"><span>Agendar corte · {unit.district}</span><span aria-hidden="true">↗</span></a>)}
   <a className="bio-action bio-home" href="/"><span>Conhecer a Barbearia Coutinho</span><span aria-hidden="true">→</span></a>
  </nav>
  <footer className="bio-footer">Aqui transformamos estilos<br/>e construímos futuros.</footer>
 </main>;
}
