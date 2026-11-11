# Neurone · Instagram — 12 semanas de conteúdo

**Período:** 16/11/2026 a 05/02/2027 · **36 posts** (12 Reels + 24 carrosséis) · **8 destaques**

| Dia | Formato | Objetivo |
|---|---|---|
| 🎬 **Segunda** | Reel narrado (40–60 s), sem precisar mostrar o rosto | **Alcance**: descoberta por quem ainda não segue |
| 🖼️ **Quarta** | Carrossel técnico (6–7 slides) | **Autoridade**: salvamentos e compartilhamentos |
| 💬 **Sexta** | Carrossel "Dúvida da família" (5–6 slides) | **Conversão**: comentários pedindo contato (KPI) |

Calendário completo: [`CALENDARIO.md`](CALENDARIO.md) · Simulação do perfil: [`simulacao/index.html`](simulacao/index.html)

## Estrutura

```
instagram/
├── content.js           ← fonte única: textos dos slides, cenas, narrações, legendas
├── CALENDARIO.md        ← os 36 posts com data, formato, pilar e pasta
├── posts/NN-tema/       ← assets prontos para postar
│   ├── slide-01.png …   (carrossel 1080×1350)
│   ├── legenda.md       (legenda + hashtags)
│   ├── reel.mp4         (Reel 1080×1920 com narração)
│   ├── capa.png         (capa do Reel)
│   ├── cenas/           (cada cena em PNG + narração em MP3)
│   └── roteiro.md       (tempos, texto na tela, narração, B-roll, legenda)
├── destaques/<nome>/    ← capa.png + story-N.png (1080×1920)
├── simulacao/           ← página que simula o perfil (abrir index.html)
└── tools/               ← build.js (gera tudo), mockup.js (simulação), tts.py (narração)
```

Para editar um texto: altere `content.js` e rode
```bash
node instagram/tools/build.js 05
```
(ou sem número para refazer tudo) e depois
```bash
node instagram/tools/mockup.js
```

## Sobre a narração
A narração dos Reels usa uma **voz sintética feminina em PT-BR**. Ela serve como guia de ritmo e pode ser publicada assim. Recomendamos, porém, que a **Fernanda regrave com a própria voz**: o texto completo está em cada `roteiro.md` e basta gravar no celular. A voz real gera mais confiança e conexão. Se a voz sintética for publicada, ative o rótulo de **"conteúdo gerado com IA"** do Instagram, e nunca a apresente como sendo a voz da Fernanda.

Ao publicar, adicione um **áudio em alta do próprio Instagram** em volume baixo (5–10%) sob a narração. Isso ajuda na distribuição.

## Princípios editoriais (performance sem apelação)
- **Capa = uma promessa clara e verdadeira**, entregue nos slides seguintes. Nada de "você está fazendo tudo errado", alarmismo ou caixa-alta.
- **Sem promessa de cura, prazo ou resultado.** A palavra mais forte que usamos é "pode ajudar".
- **CTA de comentário (CUIDADO) só às sextas e em posts de dor real.** Nos outros dias o CTA é salvar ou enviar, o que reforça a autoridade sem parecer caça-clique.
- **Autoridade por fatos, não por adjetivos:** HCor, HC-FMUSP, UTI neuro, pesquisa, escalas validadas.
- **Público-alvo:** filhos e cônjuges que decidem e pagam. Linguagem de quem explica com calma, nunca de quem vende.
- Datas sensíveis (Natal, Ano-Novo) têm conteúdo acolhedor e útil, sem CTA comercial forte.

## Sugestões de formato além do plano
1. **Reels de teste (Trial Reels):** publique as segundas também como *teste*, para não seguidores, e compare a retenção antes de tornar públicas.
2. **Collab com médicos:** convide um neurologista ou geriatra para um post colaborativo por mês. Isso dá alcance qualificado e autoridade cruzada.
3. **Caixinha de perguntas nos stories (quarta):** as perguntas viram as sextas seguintes, um ciclo que gera pauta real.
4. **Versão filmada:** a partir do mês 2, regrave os Reels com B-roll real (mãos, casa, materiais) seguindo o roteiro. O vídeo animado pode virar a "versão de estoque".
5. **Fixar no perfil:** 01 (Quem cuida de você), 09 (5 sinais, post-âncora de KPI) e 07 (SAMU, o mais compartilhável).

## Benchmark — como aprender e ajustar
Toda segunda, registre os posts da semana anterior em uma planilha:

| Métrica | Onde ver | Por que importa |
|---|---|---|
| Alcance de **não seguidores** | Insights do post | Descoberta |
| **Envios** (compartilhamentos) | Insights | Sinal mais forte de distribuição |
| **Salvamentos** | Insights | Valor percebido (autoridade) |
| Retenção aos 3 s e média assistida (Reels) | Insights do Reel | Qualidade do gancho |
| **Comentários com pedido de contato** ⭐ | Manual | KPI principal |
| Conversas no WhatsApp / avaliações agendadas | Manual | Resultado de negócio |
| Bairro/perfil do lead | Manual | Qualificação (público A/B nas regiões-alvo) |

Revisão a cada 4 semanas: repita os temas com mais **envios + comentários de contato** em outro formato, troque os ganchos com retenção baixa e ajuste os horários pelo gráfico de atividade dos seguidores.
