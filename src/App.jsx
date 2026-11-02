import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { WhatsappLogo, InstagramLogo, MapPin, CalendarBlank, List, X, Plus, Minus } from '@phosphor-icons/react';
import { BOOK, MAPS, INSTAGRAM, WhatsAppLink, Brand, descriptions, groups, category } from './site-shared.jsx';
import services from './services.json';
import media from './media.json';

gsap.registerPlugin(ScrollTrigger, useGSAP);

function Disclosure({ open, id, children, labelledBy }) {
  const region = useRef();
  useGSAP(() => {
    if (!open && region.current.clientHeight === 0) return;
    gsap.to(region.current, {
      height: open ? 'auto' : 0,
      duration: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : .3,
      ease: 'power2.inOut', overwrite: true,
      onComplete: () => ScrollTrigger.refresh(),
    });
  }, { dependencies: [open], scope: region });
  return <div className="disclosure" ref={region} id={id} aria-labelledby={labelledBy} role="region" inert={!open ? true : undefined}>{children}</div>;
}

function ServiceCard({ service, open, onToggle }) {
  return <article className={`service-card${open ? ' is-open' : ''}`}>
    <h3><button className="service-toggle" id={`service-${service.id}`} aria-expanded={open} aria-controls={`detail-${service.id}`} onClick={onToggle}>
      <img src={service.image} alt="" loading="lazy" width="240" height="200" />
      <span>{service.name}</span>{open ? <Minus size={16} /> : <Plus size={16} />}
    </button></h3>
    <Disclosure open={open} id={`detail-${service.id}`} labelledBy={`service-${service.id}`}>
      <div className="service-detail"><p>{descriptions[service.name]}</p><a href={BOOK} target="_blank" rel="noopener noreferrer">Consultar horários <CalendarBlank size={15} /></a></div>
    </Disclosure>
  </article>;
}

function Treatments() {
  const [active, setActive] = useState('Todos');
  const [opened, setOpened] = useState(null);
  const tabs = ['Todos', ...groups];
  const selected = services.filter(s => active === 'Todos' || category(s) === active);
  useEffect(() => { ScrollTrigger.refresh(); }, [active]);
  const select = value => { setOpened(null); setActive(value); };
  return <section className="treatments section-space" id="tratamentos"><div className="container">
    <div className="section-heading reveal"><h2>Tratamentos <em>para você.</em></h2><p>Escolha uma área e toque para conhecer cada cuidado.</p></div>
    <div className="treatment-tabs" role="tablist" aria-label="Categorias de tratamentos">{tabs.map((group, i) => <button key={group} id={`tab-${i}`} role="tab" aria-selected={active === group} aria-controls="treatment-panel" tabIndex={active === group ? 0 : -1} onClick={() => select(group)} onKeyDown={e => {
      const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
      if (d || e.key === 'Home' || e.key === 'End') { e.preventDefault(); const next = e.key === 'Home' ? 0 : e.key === 'End' ? tabs.length - 1 : (i + d + tabs.length) % tabs.length; select(tabs[next]); document.getElementById(`tab-${next}`).focus(); }
    }}>{group}</button>)}</div>
    <div className="service-grid" role="tabpanel" id="treatment-panel" aria-labelledby={`tab-${tabs.indexOf(active)}`} tabIndex="0">{selected.map(s => <ServiceCard service={s} key={s.id} open={opened === s.id} onToggle={() => setOpened(opened === s.id ? null : s.id)} />)}</div>
    <p className="catalog-note">Cada indicação começa com uma avaliação individual.</p>
  </div></section>;
}

function FAQItem({ question, children, index, open, onToggle }) {
  return <div className="faq-item"><h3><button id={`question-${index}`} onClick={onToggle} aria-expanded={open} aria-controls={`faq-${index}`}>{question}{open ? <Minus size={17} /> : <Plus size={17} />}</button></h3><Disclosure id={`faq-${index}`} labelledBy={`question-${index}`} open={open}><p>{children}</p></Disclosure></div>;
}

export default function App() {
  const root = useRef();
  const [menu, setMenu] = useState(false);
  const [faq, setFaq] = useState(null);
  useEffect(() => { const close = e => { if (e.key === 'Escape') setMenu(false); }; window.addEventListener('keydown', close); return () => window.removeEventListener('keydown', close); }, []);
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const flow = root.current.querySelector('.hero-flow');
      const length = flow.getTotalLength();
      const intro = gsap.timeline({ defaults: { ease: 'power3.out', duration: 1.1 } });
      intro.from('.hero-line > span', { yPercent: 105, stagger: .12, clearProps: 'transform' }, 0)
        .from('.hero-portrait', { y: 28, opacity: .45, scale: .985, duration: 1.4, clearProps: 'all' }, 0)
        .from('.hero-wash', { x: 25, opacity: .2, duration: 1.6, clearProps: 'all' }, 0)
        .fromTo(flow, { strokeDasharray: length, strokeDashoffset: length }, { strokeDashoffset: 0, duration: 1.6 }, .15)
        .from('.hero-description, .hero-actions', { y: 18, opacity: 0, stagger: .1, clearProps: 'all' }, .35);
      gsap.to('.hero-depth', { y: 22, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 } });
      gsap.utils.toArray('.reveal').forEach(el => gsap.from(el, { y: 28, ease: 'none', scrollTrigger: { trigger: el, start: 'top 98%', end: 'top 73%', scrub: .5 } }));
    });
    let active = true;
    document.fonts.ready.then(() => { if (active) ScrollTrigger.refresh(); });
    return () => { active = false; mm.revert(); };
  }, { scope: root });

  return <div ref={root}>
    <a className="skip-link" href="#conteudo">Pular para o conteúdo</a>
    <header className="site-header"><div className="container header-inner"><Brand /><nav className={`navigation${menu ? ' is-open' : ''}`} id="navigation" aria-label="Navegação principal"><a href="#tratamentos" onClick={() => setMenu(false)}>Tratamentos</a><a href="#nataly" onClick={() => setMenu(false)}>Nataly Matos</a><a href="#contato" onClick={() => setMenu(false)}>Contato</a><a className="button button-small" href={BOOK} target="_blank" rel="noopener noreferrer" onClick={() => setMenu(false)}>Agendar avaliação</a></nav><button className="menu-toggle" aria-label={menu ? 'Fechar menu' : 'Abrir menu'} aria-expanded={menu} aria-controls="navigation" onClick={() => setMenu(!menu)}>{menu ? <X size={25} /> : <List size={25} />}</button></div></header>
    <main id="conteudo">
      <section className="hero" id="inicio"><div className="hero-wash" aria-hidden="true" /><div className="container hero-inner">
        <div className="hero-copy"><h1><span className="hero-line"><span>Beleza que</span></span><span className="hero-line"><span><em>começa em você.</em></span></span></h1><p className="hero-description">Estética facial e corporal em Diadema.<br />Um olhar atento para o seu momento.</p><div className="hero-actions"><a className="button" href={BOOK} target="_blank" rel="noopener noreferrer">Agendar avaliação <CalendarBlank size={18} weight="light" /></a><a className="text-link" href="#tratamentos">Ver procedimentos</a></div></div>
        <div className="hero-visual"><div className="hero-depth"><svg className="hero-graphic" viewBox="0 0 620 640" fill="none" aria-hidden="true"><path className="hero-ribbon" d="M452 -80C647 104 185 163 312 357S690 498 551 720" /><path className="hero-flow" d="M544 -60C727 111 242 154 366 351S734 525 604 720" /></svg><img className="hero-portrait" src={media.hero} alt="Nataly Matos sorrindo, com blazer branco, em um retrato sem fundo" width="1100" height="1100" fetchPriority="high" /></div></div>
      </div></section>
      <Treatments />
      <section className="about section-space" id="nataly"><div className="container about-grid"><figure className="about-media reveal"><img src="/images/nataly-atendimento.webp" alt="Registro original de Nataly Matos durante um atendimento facial" loading="lazy" width="1600" height="900" /></figure><div className="about-copy reveal"><h2>Prazer,<br /><em>Nataly Matos.</em></h2><p>Sou esteticista e acredito em um cuidado que começa pela escuta. Cada protocolo é pensado para as necessidades de quem está à minha frente.</p><a className="social-link" href={INSTAGRAM} target="_blank" rel="noopener noreferrer"><InstagramLogo size={21} weight="light" /> Conheça meu trabalho</a></div></div></section>
      <section className="contact section-space" id="contato"><div className="container contact-grid"><div className="contact-copy reveal"><h2>Vamos cuidar<br /><em>de você?</em></h2><p>Escolha o seu horário ou converse comigo.</p><div className="contact-actions"><a className="button" href={BOOK} target="_blank" rel="noopener noreferrer">Agendar avaliação <CalendarBlank size={18} weight="light" /></a><WhatsAppLink className="text-link"><WhatsappLogo size={19} weight="light" /> Falar com a Nataly</WhatsAppLink></div><div className="faq-list"><FAQItem question="Por onde eu começo?" index={0} open={faq === 0} onToggle={() => setFaq(faq === 0 ? null : 0)}>Comece pela avaliação. Vamos conversar sobre suas necessidades e escolher os cuidados indicados para você.</FAQItem><FAQItem question="Como posso agendar?" index={1} open={faq === 1} onToggle={() => setFaq(faq === 1 ? null : 1)}>Acesse a agenda, escolha o procedimento e consulte os horários da Nataly. Você também pode conversar pelo WhatsApp.</FAQItem></div></div><div className="location-card reveal"><MapPin size={25} weight="light" /><h3>Te espero no<br /><em>Studio Bellas.</em></h3><address>Rua Tupinambás, 678 · Sala 9<br />Conceição, Diadema · SP</address><a className="text-link" href={MAPS} target="_blank" rel="noopener noreferrer">Ver localização <MapPin size={15} /></a><div className="location-contact"><WhatsAppLink><WhatsappLogo size={18} weight="light" /> (11) 98441-8691</WhatsAppLink><span>Atendimento com agendamento</span></div></div></div></section>
    </main>
    <footer className="site-footer"><div className="container footer-main"><Brand footer /><a href={INSTAGRAM} target="_blank" rel="noopener noreferrer" className="footer-instagram" aria-label="Instagram da Nataly"><InstagramLogo size={22} weight="light" /> @esteticanatalymatos</a></div><div className="container footer-bottom"><span>© {new Date().getFullYear()} Nataly Matos.</span><WhatsAppLink className="author-credit" href="https://wa.me/5585999745534">Desenvolvido por <strong>Jonas Jr.</strong></WhatsAppLink></div></footer>
  </div>;
}
