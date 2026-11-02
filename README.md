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

Capa de atendimento recuperada do bio.site. O retrato de fundo marrom foi excluído a pedido do usuário; a apresentação usa a foto original enviada, exportada em WebP com nome versionado pelo conteúdo. O hero usa um recorte transparente da foto enviada pelo usuário, preparado com a ferramenta integrada de imagens e exportado em WebP. Prompt: remover somente fundo, planta e cadeira; preservar identidade, rosto, expressão, cabelo, mãos, joias, roupa, pose e iluminação; manter transparência real. Arquivo usado: `public/images/nataly-hero.webp`. Fotos de referência enviadas são preservadas na pasta de anexos.

Layout claro e editorial conforme referência. Navegação por teclado, abas acessíveis, acordeões animados, redução de movimento e feedback imediato nos links de WhatsApp. A abertura dos links continua nativa, sem atraso de redirecionamento.

`npm run check` verifica a página por Playwright em desktop e mobile, testa abas, menu, acordeão, links e redução de movimento e salva capturas em `artifacts/`.
