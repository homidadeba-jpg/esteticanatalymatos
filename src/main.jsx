import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { WhatsappLogo, InstagramLogo, MapPin, CalendarBlank, List, X, Plus, Minus, FlowerLotus, HandHeart, Sparkle } from '@phosphor-icons/react';
import '@fontsource-variable/cormorant-garamond';
import '@fontsource-variable/cormorant-garamond/wght-italic.css';
import '@fontsource-variable/manrope';
import services from './services.json';
import media from './media.json';
import './redesign.css';

gsap.registerPlugin(ScrollTrigger, useGSAP);
const BOOK = 'https://tuaagenda.app/c/Studiobellas1?startSchedule=true&profissionalID=1f635a1f-31e5-4790-97b2-a84d522a51de#flowSchedule/1';
const WHATSAPP = 'https://wa.me/5511984418691?text=Ol%C3%A1%2C%20Nataly!%20Gostaria%20de%20saber%20mais%20sobre%20os%20tratamentos.';
const MAPS = 'https://maps.app.goo.gl/ZyZnXnDf5mRVJhXQ8';
const INSTAGRAM = 'https://www.instagram.com/esteticanatalymatos/';

function WhatsAppLink({ children, className = '', href = WHATSAPP }) {
  const [opening, setOpening] = useState(false);
  const timer = useRef();
  useEffect(() => {
    const reset = () => { setOpening(false); clearTimeout(timer.current); };
    const visible = () => { if (document.visibilityState === 'visible') reset(); };
    window.addEventListener('focus', reset);
    window.addEventListener('pageshow', reset);
    document.addEventListener('visibilitychange', visible);
    return () => { reset(); window.removeEventListener('focus', reset); window.removeEventListener('pageshow', reset); document.removeEventListener('visibilitychange', visible); };
  }, []);
  return <a className={`whatsapp-link ${className}`} href={href} target="_blank" rel="noopener noreferrer" onClick={() => { setOpening(true); clearTimeout(timer.current); timer.current = setTimeout(() => setOpening(false), 5500); }}>
    <span className={opening ? 'link-content is-hidden' : 'link-content'}>{children}</span>
    <span className="opening-feedback" role="status" aria-live="polite">{opening && <><span className="spinner" />Abrindo WhatsApp…</>}</span>
  </a>;
}

function Brand({ footer = false }) {
  return <a href="#inicio" className={`brand ${footer ? 'brand-footer' : ''}`} aria-label="Nataly Matos, início"><span className="brand-name">Nataly Matos<span className="brand-specialty">ESTÉTICA AVANÇADA</span></span></a>;
}

const descriptions = {
  'Limpeza de Pele': 'Um cuidado essencial para a limpeza profunda e a renovação da sua pele.',
  'Dermaplaning': 'Esfoliação e remoção de penugens para uma textura mais suave.',
  'Microagulhamento Facial': 'Um protocolo personalizado para cuidar da textura e da aparência da pele.',
  'Jato de Plasma': 'Cuidado direcionado a áreas específicas, conforme avaliação individual.',
  'Lipo de papada enzimática': 'Tratamento da região da papada com indicação após avaliação.',
  'Drenagem Linfática': 'Técnicas manuais para o cuidado corporal e uma sensação de leveza.',
  'Massagem Relaxante': 'Uma pausa na rotina com atenção ao seu conforto e bem-estar.',
  'Lipo sem cortes': 'Tecnologia e protocolos voltados ao cuidado do contorno corporal.',
  'Peeling clareador corporal': 'Cuidado com a aparência e a uniformidade da pele do corpo.',
  'Pump de Glúteo': 'Um protocolo específico para o cuidado da região dos glúteos.',
  'Pacote - Redução de Medidas': 'Técnicas combinadas em um plano de cuidado corporal.',
  'Pacote - Pós Operatório de Cirurgias': 'Cuidados individualizados para o período após a cirurgia.',
  'Microagulhamento Capilar': 'Atenção ao couro cabeludo em um protocolo individualizado.',
  'Lobuloplastia sem corte': 'Cuidado específico para o lóbulo da orelha, mediante avaliação.',
  'Remoção de Verruga': 'Avaliação da sua necessidade e orientação sobre o cuidado indicado.',
  'Secagem de vasinhos': 'Cuidado estético direcionado a pequenos vasos, após avaliação.',
  'Pacote pós férias renew': 'Drenagem linfática, ventosaterapia e dermaplaning em um pacote de cuidados.',
  'Avaliação': 'Uma conversa para conhecer suas necessidades e planejar os próximos cuidados.',
};
const facial = ['Limpeza de Pele', 'Dermaplaning', 'Microagulhamento Facial', 'Jato de Plasma', 'Lipo de papada enzimática'];
const body = ['Drenagem Linfática', 'Massagem Relaxante', 'Lipo sem cortes', 'Peeling clareador corporal', 'Pump de Glúteo', 'Pacote - Redução de Medidas'];
const groups = ['Faciais', 'Corporais', 'Cuidados específicos'];
function category(s) { return facial.includes(s.name) ? groups[0] : body.includes(s.name) ? groups[1] : groups[2]; }
function displayName(name) { return name; }

function Treatments() {
  const [active, setActive] = useState('Todos');
  const panel = useRef();
  useEffect(() => { ScrollTrigger.refresh(); }, [active]);
  const tabs = ['Todos', ...groups];
  const selected = services.filter(s => active === 'Todos' || category(s) === active).sort((a, b) => a.name === 'Avaliação' ? -1 : b.name === 'Avaliação' ? 1 : 0);
  const choose = group => { setActive(group); document.getElementById('catalogo').scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' }); };
  return <section className="treatments section-space" id="tratamentos">
    <div className="container">
      <div className="section-heading reveal"><h2>Cuide da pele.<br /><em>Reconecte-se com você.</em></h2><p>Do rosto ao corpo, um plano de cuidado que considera<br className="desktop-break" /> suas necessidades e acompanha o seu momento.</p></div>
      <div className="treatment-stories">
        <article className="treatment-story story-facial reveal"><div className="story-photo"><img src={media.facial} alt="Cuidado facial com aplicação de produto e técnicas manuais" loading="lazy" width="1200" height="1800" /></div><div className="story-copy"><h3>Um novo olhar<br /><em>para a sua pele.</em></h3><p>Limpeza de pele, dermaplaning e microagulhamento facial. Escolhas que começam por entender você.</p><button className="text-link" onClick={() => choose('Faciais')}>Explorar cuidados faciais</button></div></article>
        <article className="treatment-story story-body reveal"><div className="story-photo"><img src={media.corporal} alt="Massagem corporal em uma composição de tons naturais" loading="lazy" width="1400" height="933" /></div><div className="story-copy"><h3>Leveza para o corpo.<br /><em>Uma pausa para você.</em></h3><p>Drenagem linfática, massagem relaxante e protocolos corporais com atenção a cada detalhe.</p><button className="text-link" onClick={() => choose('Corporais')}>Explorar cuidados corporais</button></div></article>
      </div>
      <div className="treatment-browser" id="catalogo">
        <div className="catalog-heading"><h3>Encontre o seu cuidado.</h3><p>Todos os procedimentos da Nataly, em um só lugar.</p></div>
        <div className="treatment-tabs" role="tablist" aria-label="Categorias de tratamentos">{tabs.map((group, i) => <button role="tab" id={`tab-${i}`} aria-controls="treatment-panel" aria-selected={active === group} tabIndex={active === group ? 0 : -1} key={group} onClick={() => setActive(group)} onKeyDown={e => { const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0; if (d || e.key === 'Home' || e.key === 'End') { e.preventDefault(); const next = e.key === 'Home' ? 0 : e.key === 'End' ? tabs.length - 1 : (i + d + tabs.length) % tabs.length; setActive(tabs[next]); document.getElementById(`tab-${next}`).focus(); } }}>{group}</button>)}</div>
        <div id="treatment-panel" role="tabpanel" aria-labelledby={`tab-${tabs.indexOf(active)}`} ref={panel} className="treatment-list" tabIndex="0">{selected.map(s => <article className="treatment-item" key={s.id}><h3>{displayName(s.name)}</h3><p>{descriptions[s.name]}</p></article>)}</div>
        <div className="catalog-footer"><p className="treatment-note">A indicação de cada procedimento depende de avaliação individual.<br />Consulte valores e horários na agenda.</p><a className="button" href={BOOK} target="_blank" rel="noopener noreferrer">Agendar avaliação <CalendarBlank size={18} weight="light" /></a></div>
        </div>
    </div>
  </section>;
}

function FAQItem({ question, children, index, open, onToggle }) {
  const region = useRef();
  useGSAP(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    gsap.to(region.current, { height: open ? 'auto' : 0, duration: reduce ? 0 : .32, ease: 'power2.inOut', overwrite: true, onComplete: () => ScrollTrigger.refresh() });
  }, { dependencies: [open], scope: region });
  return <div className={`faq-item ${open ? 'is-open' : ''}`}><h3><button onClick={onToggle} aria-expanded={open} aria-controls={`faq-${index}`} id={`question-${index}`}>{question}{open ? <Minus size={18} /> : <Plus size={18} />}</button></h3><div className="faq-answer" id={`faq-${index}`} role="region" aria-labelledby={`question-${index}`} ref={region} inert={!open ? true : undefined}><p>{children}</p></div></div>;
}

function App() {
  const root = useRef();
  const [menu, setMenu] = useState(false);
  const [faq, setFaq] = useState(null);
  const closeMenu = () => setMenu(false);
  useEffect(() => { const close = e => { if (e.key === 'Escape') setMenu(false); }; window.addEventListener('keydown', close); return () => window.removeEventListener('keydown', close); }, []);
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.from('.hero-copy > *', { y: 26, opacity: 0, duration: 1.05, stagger: .13, ease: 'power3.out', clearProps: 'all' });
      gsap.from('.hero-visual', { y: 24, opacity: 0, duration: 1.25, ease: 'power2.out', clearProps: 'all' });
      gsap.utils.toArray('.reveal').forEach(el => gsap.from(el, { y: 38, ease: 'none', scrollTrigger: { trigger: el, start: 'top 96%', end: 'top 68%', scrub: .6 } }));
      gsap.utils.toArray('.photo-motion').forEach(el => gsap.fromTo(el, { y: -16 }, { y: 16, ease: 'none', scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: 1 } }));
    });
    document.fonts.ready.then(() => ScrollTrigger.refresh());
    return () => mm.revert();
  }, { scope: root });
  return <div ref={root}>
    <a className="skip-link" href="#conteudo">Pular para o conteúdo</a>
    <header className="site-header"><div className="container header-inner"><Brand /><nav className={menu ? 'navigation is-open' : 'navigation'} id="navigation" aria-label="Navegação principal"><a href="#tratamentos" onClick={closeMenu}>Tratamentos</a><a href="#nataly" onClick={closeMenu}>Sobre a Nataly</a><a href="#contato" onClick={closeMenu}>O espaço</a><a className="button button-small nav-book" href={BOOK} target="_blank" rel="noopener noreferrer" onClick={closeMenu}>Agendar avaliação</a></nav><button className="menu-toggle" aria-label={menu ? 'Fechar menu' : 'Abrir menu'} aria-controls="navigation" aria-expanded={menu} onClick={() => setMenu(!menu)}>{menu ? <X size={25} /> : <List size={25} />}</button></div></header>
    <main id="conteudo">
      <section className="hero" id="inicio"><div className="container hero-inner"><div className="hero-copy"><p className="eyebrow">ESTÉTICA AVANÇADA · DIADEMA</p><h1>Mais cuidado.<br /><em>Mais você.</em></h1><p className="hero-description">Tratamentos faciais e corporais com um olhar atento à sua pele, ao seu corpo e à sua individualidade.</p><div className="hero-actions"><a className="button" href={BOOK} target="_blank" rel="noopener noreferrer">Agendar avaliação <CalendarBlank size={18} weight="light" /></a><a className="hero-secondary" href="#tratamentos">Descubra os tratamentos</a></div></div><div className="hero-visual"><figure className="hero-photo"><div className="hero-photo-frame"><img className="hero-portrait" src="/images/nataly-foto-original-caefe429.webp" alt="Nataly Matos, esteticista, sorrindo em um retrato com blazer branco" width="1000" height="1000" fetchPriority="high" /></div><figcaption><span>Nataly Matos</span><span>Esteticista</span></figcaption></figure><div className="hero-detail"><img src={media.detalhe} alt="Frascos de cuidados para a pele em tons âmbar e neutros" width="1200" height="1800" /><span>Tempo para se cuidar.</span></div></div></div></section>
      <div className="care-strip"><div className="container care-strip-inner"><span><FlowerLotus size={21} weight="light" /> Beleza com naturalidade</span><span><HandHeart size={21} weight="light" /> Atendimento humanizado</span><span><Sparkle size={21} weight="light" /> Protocolos personalizados</span></div></div>
      <Treatments />
      <section className="approach section-space"><div className="container approach-grid"><div className="approach-photo reveal"><img className="photo-motion" src={media.pele} alt="Detalhe da aplicação de sérum na pele" loading="lazy" width="1200" height="1800" /></div><div className="approach-copy reveal"><p className="eyebrow">A SUA PELE TEM UMA HISTÓRIA</p><h2>O seu cuidado <br />começa com<br /><em>uma boa conversa.</em></h2><p>O que você sente ao se olhar no espelho importa. Na avaliação, vamos conversar sobre sua rotina, suas necessidades e o que você deseja cuidar.</p><div className="approach-principles"><div><h3>Escuta de verdade.</h3><p>Espaço para suas dúvidas, expectativas e seu momento.</p></div><div><h3>Escolhas com sentido.</h3><p>Um protocolo individual, com orientação em cada etapa.</p></div></div><WhatsAppLink className="text-link"><WhatsappLogo size={20} weight="light" /> Falar com a Nataly</WhatsAppLink></div></div></section>
      <section className="about section-space" id="nataly"><div className="container about-grid"><div className="about-copy reveal"><h2>Prazer, <br /><em>Nataly Matos.</em></h2><p>Sou esteticista e meu trabalho é unir conhecimento, tecnologia e acolhimento em cada atendimento.</p><p>Em Diadema, cuido de cada pessoa de forma individual: da avaliação à escolha dos tratamentos, com atenção ao rosto, ao corpo e ao seu bem-estar.</p><a className="social-link" href={INSTAGRAM} target="_blank" rel="noopener noreferrer"><InstagramLogo size={21} weight="light" /> Acompanhe meu trabalho</a></div><figure className="about-media reveal"><img src="/images/nataly-atendimento.webp" alt="Registro original de Nataly Matos realizando um atendimento facial" loading="lazy" width="1600" height="900" /><figcaption>Um pouco do meu dia a dia em atendimento.</figcaption></figure></div></section>
      <section className="faq section-space"><div className="container faq-grid"><div className="reveal"><h2>Vamos tirar <br /><em>suas dúvidas?</em></h2><p>O primeiro passo pode ser uma conversa.</p><WhatsAppLink className="text-link"><WhatsappLogo size={20} /> Falar com a Nataly</WhatsAppLink></div><div className="faq-list reveal"><FAQItem index={0} question="Por onde eu começo?" open={faq === 0} onToggle={() => setFaq(faq === 0 ? null : 0)}>A avaliação é o melhor ponto de partida. É o momento de conversar sobre suas necessidades e entender quais cuidados são indicados para você.</FAQItem><FAQItem index={1} question="Como posso agendar?" open={faq === 1} onToggle={() => setFaq(faq === 1 ? null : 1)}>Use o botão “Agendar avaliação” para acessar a agenda da Nataly, escolher o serviço e consultar os horários disponíveis. Se preferir, fale diretamente pelo WhatsApp.</FAQItem><FAQItem index={2} question="Os tratamentos são personalizados?" open={faq === 2} onToggle={() => setFaq(faq === 2 ? null : 2)}>Sim. A escolha do protocolo considera suas necessidades e a avaliação individual. A indicação e a frequência dos cuidados são conversadas no atendimento.</FAQItem><FAQItem index={3} question="Onde acontece o atendimento?" open={faq === 3} onToggle={() => setFaq(faq === 3 ? null : 3)}>No Studio Bellas, na Rua Tupinambás, 678, sala 9, bairro Conceição, em Diadema, São Paulo. O atendimento é realizado com agendamento.</FAQItem></div></div></section>
      <section className="contact" id="contato"><div className="container contact-grid"><div className="contact-copy reveal"><h2>Seu próximo cuidado<br /><em>tem hora marcada.</em></h2><p>Escolha um horário na agenda.<br />Eu te espero no Studio Bellas, em Diadema.</p><a className="button" href={BOOK} target="_blank" rel="noopener noreferrer">Agendar avaliação <CalendarBlank size={18} weight="light" /></a></div><div className="location-card reveal"><MapPin size={29} weight="light" /><h3>Onde nos <br /><em>encontramos.</em></h3><address>Studio Bellas<br />Rua Tupinambás, 678 · Sala 9<br />Conceição, Diadema · SP<br />CEP 09991-090</address><a className="text-link" href={MAPS} target="_blank" rel="noopener noreferrer">Ver localização no mapa <MapPin size={16} /></a><div className="location-contact"><WhatsAppLink><WhatsappLogo size={19} /> (11) 98441-8691</WhatsAppLink><span>Atendimento com agendamento</span></div></div></div></section>
    </main>
    <footer className="site-footer"><div className="container footer-main"><Brand footer /><p>Estética com cuidado.<br />Beleza com a sua essência.</p><div className="footer-socials"><a href={INSTAGRAM} target="_blank" rel="noopener noreferrer" aria-label="Instagram da Nataly"><InstagramLogo size={23} weight="light" /></a><WhatsAppLink><span className="sr-only">WhatsApp da Nataly</span><WhatsappLogo size={23} weight="light" /></WhatsAppLink></div></div><div className="container footer-bottom"><span>© {new Date().getFullYear()} Nataly Matos. Todos os direitos reservados.</span><WhatsAppLink className="author-credit" href="https://wa.me/5585999745534">Desenvolvido por <strong>Jonas Jr.</strong></WhatsAppLink></div></footer>
  </div>;
}

createRoot(document.getElementById('root')).render(<React.StrictMode><App /></React.StrictMode>);
