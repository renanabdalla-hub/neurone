# Neurone · Identidade Visual

Sofisticada como uma clínica de alto padrão, calorosa como uma casa. Feita para **posts escritos** — a Fernanda não precisa aparecer para a marca ter presença.

## Conceito
**"Neurone"** = o neurônio, a célula que cria novos caminhos. O monograma é um **"n" contínuo que se ramifica como um dendrito**, com dois pontos dourados (as sinapses): a ideia de **reconexão**, que é a base da reabilitação neurofuncional.

Arquivo: `site/assets/logo.svg`

## Paleta

| Cor | Hex | Uso |
|---|---|---|
| Azul-noite | `#1B2A41` | Títulos, fundos de autoridade e CTA |
| Marfim | `#F7F2EA` | Fundo principal (acolhimento, papel) |
| Areia | `#EDE4D7` | Fundo alternado para dar ritmo no carrossel |
| Dourado champanhe | `#B08D57` | Detalhes, destaques em itálico, números — o toque premium |
| Dourado suave | `#D8C3A0` | Linhas, números grandes de fundo |
| Rosé argila | `#C9A196` | Detalhes de carinho (destaques "Online", "Sobre mim") |

Regra: **no máximo 1 palavra/frase em dourado itálico por slide.**

## Tipografia (Google Fonts, gratuitas)
- **Cormorant Garamond** (500 e itálico) — títulos. Editorial, elegante, "revista".
- **Manrope** (400–700) — texto e rótulos. Moderna e muito legível no celular.

Hierarquia nos posts (1080×1350):
- Rótulo (kicker): Manrope 26 px, caixa alta, espaçado, dourado, com fio à esquerda
- Título capa: Cormorant 112 px · Título interno: 96 px
- Texto: Manrope 42 px, azul-acinzentado, com **negrito** para a frase-chave

## Templates de post
Todos em `posts/templates.html` (gerar PNG com `node posts/render.js` → `posts/png/`).

| Template | Quando usar | Exemplo |
|---|---|---|
| **Capa marfim** | Carrossel educativo / família | `c1-01.png` |
| **Capa azul-noite** | Tema de autoridade (AVC, ciência) | `capa-avc.png` |
| **Capa com chips** | Lista de estratégias | `capa-parkinson.png` |
| **Mito ou verdade** (areia) | Debate e alcance | `capa-mito.png` |
| **Frase da Fernanda** | Pilar "Por trás do cuidado" | `capa-bastidor.png` |
| **Slide numerado** | Miolo do carrossel (número grande ao fundo) | `c1-02.png` … `c1-06.png` |
| **Slide CTA** (azul-noite) | Último slide — palavra-chave para comentar | `c1-07.png` |
| **Capas de destaque** | 8 destaques do perfil | `hl-*.png` |

Para criar um post novo: duplique um `<section class="slide">` no HTML, troque o texto e rode o script. Se preferir o **Canva**, recrie os templates com as mesmas cores e fontes (ambas existem no Canva).

## Fotografia (para a sessão de fotos)
- Luz natural, tons quentes, fundo claro (marfim/bege) — combina com a paleta.
- Roupa: azul-marinho, off-white ou jaleco claro bem cortado; sem estampas.
- Lista de fotos: retrato sorrindo (perfil), meio corpo de braços cruzados (site), **mãos** guiando o pé/joelho/mão de alguém, ajoelhada ao lado de uma poltrona, caminhando ao lado de um idoso (de costas), anotando numa prancheta, detalhes de materiais (faixa elástica, bola, escala impressa), notebook em teleatendimento.
- Fotos de "mãos" e "de costas" resolvem a timidez e são ótimas para Reels sem rosto.

## Avatar provisório
`site/assets/avatar-fernanda.jpg` — retrato em duotom sépia gerado a partir da foto enviada, para usar no site e no post "Frase da Fernanda" até as fotos profissionais ficarem prontas.
