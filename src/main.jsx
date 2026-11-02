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
import './styles.css';

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
  return <a href="#inicio" className={`brand ${footer ? 'brand-footer' : ''}`} aria-label="Nataly Matos, início"><span className="brand-monogram" aria-hidden="true">nm</span><span className="brand-name">Nataly Matos<span className="brand-specialty">ESTÉTICA AVANÇADA</span></span></a>;
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
function displayName(name) { return ({ 'Pacote - Pós Operatório de Cirurgias': 'Pós-operatório de cirurgias', 'Pacote - Redução de Medidas': 'Redução de medidas', 'Pacote pós férias renew': 'Protocolo Renew', 'Lipo de papada enzimática': 'Lipo de papada', 'Lobuloplastia sem corte': 'Lobuloplastia sem corte' })[name] || name; }

function Treatments() {
  const [active, setActive] = useState(groups[0]);
  const panel = useRef();
  useEffect(() => { ScrollTrigger.refresh(); }, [active]);
  const selected = services.filter(s => category(s) === active).sort((a, b) => a.name === 'Avaliação' ? -1 : b.name === 'Avaliação' ? 1 : 0);
  return <section className="treatments section-space" id="tratamentos">
    <div className="container">
      <div className="section-heading reveal"><h2>O cuidado certo para<br /><em>cada parte de você.</em></h2><p>Tratamentos faciais, corporais e cuidados específicos.<br className="desktop-break" /> O seu protocolo começa com uma avaliação individual.</p></div>
      <div className="treatment-layout">
        <aside className="treatment-aside reveal"><div className="treatment-flower"><FlowerLotus size={52} weight="thin" /></div><h3>Cada pele,<br />uma história.</h3><p>Vamos encontrar juntas o cuidado que faz sentido para o seu momento.</p><a className="text-link" href={BOOK} target="_blank" rel="noopener noreferrer">Agendar avaliação <CalendarBlank size={17} /></a></aside>
        <div className="treatment-browser reveal">
          <div className="treatment-tabs" role="tablist" aria-label="Categorias de tratamentos">{groups.map((group, i) => <button role="tab" id={`tab-${i}`} aria-controls="treatment-panel" aria-selected={active === group} tabIndex={active === group ? 0 : -1} key={group} onClick={() => setActive(group)} onKeyDown={e => { const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0; if (d) { e.preventDefault(); const next = (i + d + groups.length) % groups.length; setActive(groups[next]); document.getElementById(`tab-${next}`).focus(); } }}>{group}</button>)}</div>
          <div id="treatment-panel" role="tabpanel" aria-labelledby={`tab-${groups.indexOf(active)}`} ref={panel} className="treatment-list" tabIndex="0">{selected.map(s => <article className="treatment-item" key={s.id}><h3>{displayName(s.name)}</h3><p>{descriptions[s.name]}</p></article>)}</div>
          <p className="treatment-note">Indicações, valores e disponibilidade são confirmados na avaliação e na agenda.</p>
        </div>
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
      gsap.from('.hero-portrait', { y: 35, opacity: 0, duration: 1.4, ease: 'power2.out', clearProps: 'all' });
      gsap.utils.toArray('.reveal').forEach(el => gsap.from(el, { y: 38, ease: 'none', scrollTrigger: { trigger: el, start: 'top 96%', end: 'top 68%', scrub: .6 } }));
      gsap.to('.hero-outline', { y: 55, rotation: 8, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 } });
      gsap.from('.philosophy-word', { x: -45, ease: 'none', scrollTrigger: { trigger: '.philosophy', start: 'top bottom', end: 'bottom top', scrub: 1.2 } });
    });
    document.fonts.ready.then(() => ScrollTrigger.refresh());
    return () => mm.revert();
  }, { scope: root });
  return <div ref={root}>
    <a className="skip-link" href="#conteudo">Pular para o conteúdo</a>
    <header className="site-header"><div className="container header-inner"><Brand /><nav className={menu ? 'navigation is-open' : 'navigation'} id="navigation" aria-label="Navegação principal"><a href="#tratamentos" onClick={closeMenu}>Tratamentos</a><a href="#nataly" onClick={closeMenu}>Sobre a Nataly</a><a href="#contato" onClick={closeMenu}>O espaço</a><a className="button button-small nav-book" href={BOOK} target="_blank" rel="noopener noreferrer" onClick={closeMenu}>Agendar avaliação</a></nav><button className="menu-toggle" aria-label={menu ? 'Fechar menu' : 'Abrir menu'} aria-controls="navigation" aria-expanded={menu} onClick={() => setMenu(!menu)}>{menu ? <X size={25} /> : <List size={25} />}</button></div></header>
    <main id="conteudo">
      <section className="hero" id="inicio"><div className="hero-background" aria-hidden="true" /><div className="container hero-inner"><div className="hero-copy"><p className="eyebrow">ESTÉTICA AVANÇADA EM DIADEMA</p><h1>Sua beleza.<br /><em>Seu melhor cuidado.</em></h1><p className="hero-description">Um olhar atento para você. Tratamentos faciais e corporais que respeitam sua essência e o seu momento.</p><div className="hero-actions"><a className="button" href={BOOK} target="_blank" rel="noopener noreferrer">Agendar avaliação <CalendarBlank size={18} weight="light" /></a><a className="hero-secondary" href="#tratamentos">Conhecer os tratamentos</a></div></div><div className="hero-art"><span className="hero-watermark" aria-hidden="true">natural</span><div className="hero-outline" aria-hidden="true" /><img className="hero-portrait" src="/images/nataly-hero.webp" alt="Nataly Matos, esteticista, sorrindo e vestindo um blazer branco" width="1254" height="1254" fetchPriority="high" /></div></div></section>
      <div className="care-strip"><div className="container care-strip-inner"><span><FlowerLotus size={21} weight="light" /> Beleza com naturalidade</span><span><HandHeart size={21} weight="light" /> Atendimento humanizado</span><span><Sparkle size={21} weight="light" /> Protocolos personalizados</span></div></div>
      <Treatments />
      <section className="philosophy"><div className="philosophy-word" aria-hidden="true">essência</div><div className="container philosophy-inner reveal"><FlowerLotus size={38} weight="thin" /><h2>Você não precisa mudar quem é.<br />Precisa se sentir <em>bem sendo você.</em></h2><p>Tecnologia, escuta e cuidado se encontram em uma experiência<br className="desktop-break" /> de estética pensada para valorizar a sua individualidade.</p></div></section>
      <section className="about section-space" id="nataly"><div className="container about-grid"><div className="about-image reveal"><img src="/images/nataly-foto-original-caefe429.webp" alt="Nataly Matos sorrindo, com blazer branco" loading="lazy" width="1000" height="1000" /><span className="portrait-signature" aria-hidden="true">Nataly</span></div><div className="about-copy reveal"><p className="eyebrow">PRAZER, NATALY MATOS</p><h2>Antes de cuidar da pele,<br /><em>eu escuto você.</em></h2><p>Sou esteticista e acredito que o cuidado começa ao entender o que você busca, como se sente e o que faz sentido para a sua rotina.</p><p>No meu atendimento, cada protocolo é pensado de forma individual. Unimos tecnologia e um olhar humano para cuidar do rosto, do corpo e da sua relação com o espelho.</p><p>Meu convite é para que você tenha um momento seu, com acolhimento e atenção em cada detalhe.</p><a className="social-link" href={INSTAGRAM} target="_blank" rel="noopener noreferrer"><InstagramLogo size={21} weight="light" /> @esteticanatalymatos</a></div></div></section>
      <section className="practice"><div className="container"><div className="practice-heading reveal"><h2>Cuidado que você vê.<br /><em>Acolhimento que você sente.</em></h2><p>Conheça um pouco do atendimento da Nataly.</p></div><figure className="practice-photo reveal"><img src="/images/nataly-atendimento.webp" alt="Capa original de Nataly Matos: atendimento facial com equipamento estético" loading="lazy" width="1600" height="900" /></figure></div></section>
      <section className="faq section-space"><div className="container faq-grid"><div className="reveal"><h2>Vamos tirar<br /><em>suas dúvidas?</em></h2><p>O primeiro passo pode ser uma conversa.</p><WhatsAppLink className="text-link"><WhatsappLogo size={20} /> Falar com a Nataly</WhatsAppLink></div><div className="faq-list reveal"><FAQItem index={0} question="Por onde eu começo?" open={faq === 0} onToggle={() => setFaq(faq === 0 ? null : 0)}>A avaliação é o melhor ponto de partida. É o momento de conversar sobre suas necessidades e entender quais cuidados são indicados para você.</FAQItem><FAQItem index={1} question="Como posso agendar?" open={faq === 1} onToggle={() => setFaq(faq === 1 ? null : 1)}>Use o botão “Agendar avaliação” para acessar a agenda da Nataly, escolher o serviço e consultar os horários disponíveis. Se preferir, fale diretamente pelo WhatsApp.</FAQItem><FAQItem index={2} question="Os tratamentos são personalizados?" open={faq === 2} onToggle={() => setFaq(faq === 2 ? null : 2)}>Sim. A escolha do protocolo considera suas necessidades e a avaliação individual. A indicação e a frequência dos cuidados são conversadas no atendimento.</FAQItem><FAQItem index={3} question="Onde acontece o atendimento?" open={faq === 3} onToggle={() => setFaq(faq === 3 ? null : 3)}>No Studio Bellas, na Rua Tupinambás, 678, sala 9, bairro Conceição, em Diadema, São Paulo. O atendimento é realizado com agendamento.</FAQItem></div></div></section>
      <section className="contact" id="contato"><div className="container contact-grid"><div className="contact-copy reveal"><p className="eyebrow">SEU MOMENTO COMEÇA AQUI</p><h2>Reserve um tempo<br /><em>para cuidar de você.</em></h2><p>Um espaço de acolhimento em Diadema,<br />pronto para receber a sua melhor versão.</p><a className="button" href={BOOK} target="_blank" rel="noopener noreferrer">Agendar avaliação <CalendarBlank size={18} weight="light" /></a></div><div className="location-card reveal"><MapPin size={29} weight="light" /><h3>Te espero no<br /><em>Studio Bellas.</em></h3><address>Rua Tupinambás, 678 · Sala 9<br />Conceição, Diadema · SP<br />CEP 09991-090</address><a className="text-link" href={MAPS} target="_blank" rel="noopener noreferrer">Ver localização no mapa <MapPin size={16} /></a><div className="location-contact"><WhatsAppLink><WhatsappLogo size={19} /> (11) 98441-8691</WhatsAppLink><span>Atendimento com agendamento</span></div></div></div></section>
    </main>
    <footer className="site-footer"><div className="container footer-main"><Brand footer /><p>Estética com cuidado.<br />Beleza com a sua essência.</p><div className="footer-socials"><a href={INSTAGRAM} target="_blank" rel="noopener noreferrer" aria-label="Instagram da Nataly"><InstagramLogo size={23} weight="light" /></a><WhatsAppLink><span className="sr-only">WhatsApp da Nataly</span><WhatsappLogo size={23} weight="light" /></WhatsAppLink></div></div><div className="container footer-bottom"><span>© {new Date().getFullYear()} Nataly Matos. Todos os direitos reservados.</span><WhatsAppLink className="author-credit" href="https://wa.me/5585999745534">Desenvolvido por <strong>Jonas Jr.</strong></WhatsAppLink></div></footer>
  </div>;
}

createRoot(document.getElementById('root')).render(<React.StrictMode><App /></React.StrictMode>);
