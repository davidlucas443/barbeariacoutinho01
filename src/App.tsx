import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { config, whatsappLink } from './config';
import { Brand } from './Brand';
import HaircutGallery from './HaircutGallery';
import Units from './Units';
import BarberPole from './BarberPole';
gsap.registerPlugin(ScrollTrigger);
export default function App(){
  const root=useRef<HTMLDivElement>(null);
  useEffect(()=>{
    const mm=gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)',()=>{
      const mobile=()=>window.innerWidth<900;
      // The stable wrapper keeps anchor destinations independent of the moving panel.
      gsap.timeline({scrollTrigger:{trigger:'.school-stage',start:'top bottom',end:()=>mobile()?'top 58%':'top 48%',scrub:true,invalidateOnRefresh:true}})
        .fromTo('.school',{y:()=>mobile()?48:96},{y:0,ease:'none',duration:1},0)
        .fromTo('.school-stat',{y:()=>mobile()?18:30,opacity:.2},{y:0,opacity:1,ease:'none',duration:.85},.15);
      for(const [trigger,content] of [['#barbearia','.barber-main'],['#unidades','.units-heading, .unit-grid']]){
        gsap.fromTo(content,{y:()=>mobile()?14:26},{y:0,ease:'none',scrollTrigger:{trigger,start:'top 96%',end:'top 68%',scrub:true,invalidateOnRefresh:true}});
      }
    },root);
    mm.add('(min-width: 900px) and (min-height: 720px) and (prefers-reduced-motion: no-preference)',()=>{
      const lenis=new Lenis({autoRaf:false,syncTouch:false,anchors:false});
      const tick=(time:number)=>lenis.raf(time*1000);lenis.on('scroll',ScrollTrigger.update);gsap.ticker.add(tick);
      const navigate=(event:MouseEvent)=>{
        if(event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
        const link=(event.target as Element).closest<HTMLAnchorElement>('a[href^="#"]');
        const target=link&&document.querySelector<HTMLElement>(link.hash);
        if(!target)return;
        event.preventDefault();
        history.pushState(null,'',link!.hash);
        lenis.scrollTo(target.getBoundingClientRect().top+window.scrollY,{offset:-18,duration:.65,force:true,onComplete:()=>{target.setAttribute('tabindex','-1');target.focus({preventScroll:true});}});
      };
      root.current?.addEventListener('click',navigate);
      const element=root.current;
      return()=>{element?.removeEventListener('click',navigate);gsap.ticker.remove(tick);lenis.destroy();};
    },root);
    return()=>mm.revert();
  },[]);
  const course=config.course;
  return <div ref={root}>
    <a className="skip" href="#curso">Ir para o curso</a>
    <header className="header"><Brand/><nav aria-label="Principal"><a href="#curso">A escola</a><a href="#barbearia">A barbearia</a><a href="#unidades">Unidades</a></nav></header>
    <main>
      <section id="inicio" className="hero">
        <div className="hero-heading"><p className="eyebrow">BARBEARIA & ESCOLA PROFISSIONALIZANTE</p><h1><span className="title-lead">Aqui transformamos estilos</span>{' '}<span className="title-impact"><span className="title-join">e </span>construímos futuros.</span></h1></div>
        <div className="hero-actions"><div className="actions"><a className="button" href="#curso">Conhecer o curso</a><a className="text-link" href={whatsappLink('cut')} target="_blank" rel="noreferrer">Agendar corte</a></div></div>
        <div className="hero-visual"><BarberPole/></div>
        <div className="hero-bottom"><span>TÉCNICA QUE TRANSFORMA.</span><a href="#curso">O futuro começa com um ofício <span aria-hidden="true">↓</span></a></div>
      </section>
      <div id="curso" className="school-stage"><section className="school" aria-label="Escola Coutinho">
        <div className="section-top"><p className="eyebrow">ESCOLA PROFISSIONALIZANTE DE BARBEIRO</p><span>CONHECIMENTO QUE FICA.</span></div>
        <div className="school-grid"><div className="school-title"><h2>Aprenda um ofício.<br/>Construa <em>seu futuro.</em></h2><div className="school-stat"><strong>+100</strong><span>alunos<br/>formados</span></div><p className="stat-note">Histórias que começam com a vontade de aprender.</p></div><div className="school-info"><h3>O próximo passo <br/>está nas suas mãos.</h3><p>Conheça a Escola Coutinho e descubra as próximas oportunidades para aprender a arte do corte.</p><dl className="course-details">{Object.entries({'Duração':course.duration,'Carga horária':course.hours,'Investimento':course.price,'Próximas turmas':course.dates}).filter(([,v])=>v).map(([key,value])=><div key={key}><dt>{key}</dt><dd>{value}</dd></div>)}</dl>{course.content.length>0&&<div className="course-content"><h4>Conteúdo do curso</h4><ul>{course.content.map(item=><li key={item}>{item}</li>)}</ul></div>}<a className="button" href={whatsappLink('course')} target="_blank" rel="noreferrer">Consultar próximas turmas</a><small>Converse diretamente com a escola pelo WhatsApp.</small></div></div>
      </section>
      </div>
      <section id="barbearia" className="barber"><div className="barber-main"><div><p className="eyebrow">BARBEARIA COUTINHO</p><h2>Desde 2014,<br/><em>transformando estilos.</em></h2><p>Um novo corte. Uma nova versão de você.<br/>Reserve seu próximo horário com a Coutinho.</p><a className="button" href={whatsappLink('cut')} target="_blank" rel="noreferrer">Agendar meu corte</a></div><div className="barber-stat"><strong>+25 mil</strong><span>mudanças de visual.</span><p>Uma trajetória construída<br/>um corte de cada vez.</p></div></div><HaircutGallery/></section>
      <Units/>
    </main><footer><Brand full/><div className="footer-links"><a href={`https://www.instagram.com/${config.instagram}/`} target="_blank" rel="noreferrer">@{config.instagram}</a><a href={whatsappLink('cut')} target="_blank" rel="noreferrer">WhatsApp</a></div><small>São Paulo · Feito de técnica e atitude.</small></footer>
  </div>;
}
