import React, { useEffect, useRef, useState } from 'react';
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

export { BOOK, MAPS, INSTAGRAM, WhatsAppLink, Brand, descriptions, groups, category };
