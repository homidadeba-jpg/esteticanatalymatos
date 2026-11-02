# Nataly Matos · Estética Avançada

Landing page em React/Vite, com GSAP e fontes locais Cormorant Garamond e Manrope.

```sh
npm install
npm run dev
npm run build
npm run check
```

O agendamento aponta para o perfil da Nataly no Tua Agenda. Os 18 procedimentos foram extraídos da relação `funcionarioProduto` da página pública em 01/11/2026, filtrados pelo ID `1f635a1f-31e5-4790-97b2-a84d522a51de`. O catálogo local não sincroniza automaticamente. Não foram incluídos serviços de outros profissionais, depoimentos inventados ou promessas de resultados.

Fontes: https://bio.site/EsteticaNatalymatos e https://tuaagenda.app/c/Studiobellas1 . Contato confirmado: (11) 98441-8691. Endereço: Rua Tupinambás, 678, sala 9, Conceição, Diadema/SP.

Capa de atendimento recuperada do bio.site e foto original de Nataly enviada pelo usuário. A foto da Nataly aparece somente no hero, em um recorte transparente com fundo em camadas e textos em uma área separada. O retrato de fundo marrom não é usado. O original do recorte foi preservado em `assets/reference`, e sua exportação WebP com transparência é usada na publicação.

O catálogo foi reconferido na agenda em 01/11/2026: os 18 serviços da Nataly aparecem por padrão na aba Todos, com nomes completos e filtros por categoria. Outros profissionais do Studio Bellas não entram nessa relação.

Revisão atual: hero com o recorte transparente da foto da Nataly, animação GSAP coordenada e profundidade no fundo. São 18 miniaturas individuais obtidas na agenda oficial, com fontes registradas em `src/services.json`. As descrições abrem ao toque; não há exclusão de serviços. A auditoria e os cortes de conteúdo estão em [AUDIT.md](AUDIT.md).

Fotografias ilustrativas pesquisadas na revisão anterior foram preservadas como recursos, mas não são exibidas no layout atual. Fontes e [licença Pexels](https://www.pexels.com/license/):

- Facial: [Anna Shvets, foto 5069493](https://www.pexels.com/photo/crop-beautician-massaging-client-face-with-lotion-during-spa-procedures-5069493/).
- Corporal: [Anna Tarazevich, foto 6560265](https://www.pexels.com/photo/a-beautiful-woman-having-a-back-massage-6560265/).
- Pele: [Pavel Danilyuk, foto 6417954](https://www.pexels.com/photo/person-woman-hand-face-6417954/).
- Frascos: [foto 6621462](https://www.pexels.com/photo/6621462/).

As URLs dos novos arquivos têm os oito primeiros caracteres de SHA-256 no nome. Os anexos originais foram preservados.

Layout claro e editorial conforme referência. Navegação por teclado, abas acessíveis, acordeões animados, redução de movimento e feedback imediato nos links de WhatsApp. A abertura dos links continua nativa, sem atraso de redirecionamento.

`npm run check` verifica por Playwright o hero com recorte transparente, as 18 miniaturas individuais, os detalhes dos serviços, ausência de sobreposição no título, abas, menu, dúvidas, links e redução de movimento. Salva capturas em `artifacts/`.
