# Auditoria da interface e revisão aplicada

Base: implementação e capturas do commit `87f7a1b`, comparadas ao pedido do usuário. A identidade clara e os dados da Nataly foram preservados. A revisão atual adota Bodoni Moda e DM Sans para uma tipografia mais marcada.

## Problemas encontrados

| Prioridade | Evidência | Efeito | Alteração |
| --- | --- | --- | --- |
| P1 | Hero usava o retrato com fundo em arco e uma segunda fotografia de frascos | A profissional dividia o destaque com uma composição que não correspondia ao pedido | Recorte transparente como único retrato, fundo em camadas e desenho geométrico animado atrás da pessoa |
| P1 | Catálogo exibia 18 nomes e 18 descrições simultaneamente, sem imagens individuais | Leitura longa, pouca diferenciação visual entre os serviços | Miniaturas originais de cada serviço; nome e foto visíveis, descrição disponível ao toque |
| P2 | Destaques faciais/corporais, catálogo e seção de abordagem repetiam a proposta | Aumentava a página antes do conteúdo que a visitante procurava | Uma única seção de tratamentos e apresentação pessoal curta |
| P2 | Alguns textos auxiliares e abas tinham áreas de interação pequenas | Toque e navegação menos confortáveis | Abas com 48px, controles principais com pelo menos 44px e foco visível |
| P2 | As entradas usavam efeitos semelhantes em vários blocos | A animação tinha pouca hierarquia | Uma sequência GSAP para a abertura; movimentos curtos e reversíveis apenas nos títulos e na apresentação |

## Organização final

Hero com uma única foto sem fundo no centro, título e textos distribuídos no mesmo espaço, sem colunas de texto/foto. A tipografia agora combina Bodoni Moda e DM Sans. A apresentação da Nataly aparece antes do catálogo, e a seção sobre avaliação explica o atendimento, equilibrando os serviços com informações úteis. Contato, endereço e duas dúvidas completam a página. Os 18 procedimentos continuam disponíveis na opção Todos e nas categorias, cada um com sua miniatura.

O enquadramento do hero foi refinado para centralizar o retrato em todos os tamanhos. No celular, o texto de apoio fica abaixo da foto; o título ocupa uma camada atrás da silhueta, com uma sobreposição discreta junto ao cabelo. O movimento relativo entre essas camadas é curto e reversível, respeitando redução de movimento.

## Integridade e acessibilidade

- O recorte aprovado foi reutilizado, sem gerar outro rosto ou alterar a identidade.
- As miniaturas foram recuperadas da agenda; as referências originais estão registradas em `src/services.json`.
- Fotos repetidas, monogramas e títulos sobre o rosto foram evitados.
- Abas, expansão de detalhes, navegação por teclado, retorno do WhatsApp e redução de movimento fazem parte da verificação final.
- A paleta clara segue a referência fornecida; não há alternância de tema no meio da página.
- Imagens abaixo do hero carregam sob demanda; dimensões reservadas evitam saltos de layout.

## Limites

As fotografias da agenda incluem registros de procedimentos, comparativos e artes fornecidas pela profissional. As miniaturas não representam promessa de resultado. Testes de viewport e navegador não equivalem a inspeção em aparelho físico. Esta auditoria não declara certificação de acessibilidade nem medições de Core Web Vitals em campo.
