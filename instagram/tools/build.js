// Gera todos os assets do planejamento: node instagram/tools/build.js [id ...]
//  - Carrosséis: PNG 1080x1350 por slide
//  - Reels: capa + cenas 1080x1920, narração PT-BR (TTS) e MP4 final
//  - Stories dos destaques + capas dos destaques
//  - Legendas, roteiros e calendário em texto
const { chromium } = require('playwright');
const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const C = require(path.join(ROOT, 'content.js'));
const OUT = path.join(ROOT, 'posts');
const HL = path.join(ROOT, 'destaques');
const TMP = path.join(__dirname, '.tmp');
const LOGO = 'file://' + path.resolve(ROOT, '../site/assets/logo.svg');
const AVATAR = 'file://' + path.resolve(ROOT, '../site/assets/avatar-fernanda.jpg');
const only = process.argv.slice(2);
const VOICE = process.env.VOICE || 'pt-BR-ThalitaMultilingualNeural';
const BG = { ivory: '0xF7F2EA', sand: '0xEDE4D7', ink: '0x1B2A41', rose: '0xE7D3CC' };

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const md = s => esc(s).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/\*(.+?)\*/g, '<em>$1</em>');
const plain = s => String(s).replace(/\*\*?/g, '');
const slug = s => plain(s).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 48);
const dirOf = p => path.join(OUT, `${p.id}-${slug(p.title)}`);
const DOW = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];
const fmtDate = d => { const x = new Date(d + 'T12:00:00'); return `${DOW[x.getDay()]}, ${d.slice(8, 10)}/${d.slice(5, 7)}/${d.slice(0, 4)}`; };

const page = body => `<!doctype html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Manrope:wght@400;500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="file://${path.join(__dirname, 'theme.css')}"></head><body>${body}</body></html>`;

const foot = (s, i, n, dark) => `<div class="foot"><div class="brand"><img src="${LOGO}">${i === 0 ? '@' + C.profile.username : 'Neurone'}</div><div class="${i === 0 ? 'swipe' : ''}">${i === 0 ? 'deslize →' : `${i + 1}/${n}`}</div></div>`;

function slideHTML(s, i, n) {
  const theme = s.theme || (s.t === 'cta' ? 'ivory' : 'ivory');
  let inner = '';
  switch (s.t) {
    case 'cover':
      inner = `<div class="kicker">${md(s.k)}</div><h1 class="h xl">${md(s.h)}</h1>${s.b ? `<p class="b">${md(s.b)}</p>` : ''}
        ${s.chips ? `<div class="chips">${s.chips.map(c => `<span class="chip">${esc(c)}</span>`).join('')}</div>` : ''}
        <div class="arc" style="width:900px;height:900px;right:-420px;bottom:-420px"></div><div class="arc" style="width:700px;height:700px;right:-320px;bottom:-320px;opacity:.6"></div>`;
      break;
    case 'question':
      inner = `<div class="kicker">${md(s.k)}</div><div class="qcard"><span class="tag">Dúvida da família</span><h1 class="h">${md(s.h)}</h1></div>
        <p class="answer-hint">A resposta, com carinho — deslize.</p>`;
      break;
    case 'num':
      inner = `<div class="num-big">${s.n}</div><div class="kicker">${md(s.k)}</div><h2 class="h lg">${md(s.h)}</h2><div class="line"></div><p class="b">${md(s.b)}</p>`;
      break;
    case 'text':
      inner = `<div class="kicker">${md(s.k)}</div><h2 class="h lg">${md(s.h)}</h2><div class="line"></div><p class="b">${md(s.b)}</p>`;
      break;
    case 'list':
      inner = `<div class="kicker">${md(s.k)}</div><h2 class="h md">${md(s.h)}</h2><ul class="items">${s.items.map(x => `<li>${md(x)}</li>`).join('')}</ul>`;
      break;
    case 'split':
      inner = `<div class="kicker">${md(s.k)}</div><div class="split"><div><h3>${md(s.a.h)}</h3><p>${md(s.a.b)}</p></div><div><h3>${md(s.c.h)}</h3><p>${md(s.c.b)}</p></div></div>`;
      break;
    case 'quote':
      inner = `<div class="kicker">Por trás do cuidado</div><h2 class="h lg" style="margin-top:80px">${md(s.h)}</h2><p class="sig">— ${esc(s.sig)}</p><img class="avatar" src="${AVATAR}">`;
      break;
    case 'cta': {
      const isWord = /CUIDADO/.test(s.h);
      inner = `<div class="kicker">${md(s.k)}</div>` + (isWord
        ? `<h2 class="h lg">Se fez sentido para você…</h2><div class="cta-box"><p class="b" style="margin:0">Comente a palavra</p><div class="word">CUIDADO</div><p class="b" style="margin:12px 0 0">${md(s.b)}</p></div>`
        : `<h2 class="h lg">${md(s.h)}</h2>${s.b ? `<div class="line"></div><p class="b">${md(s.b)}</p>` : ''}`)
        + `<p class="b" style="font-size:30px;margin-top:50px;opacity:.8">Dra. Fernanda Iotti · CREFITO-3 000000-F</p>`;
      break;
    }
  }
  return `<section class="f slide ${theme}"><div class="wrapc">${inner}</div>${foot(s, i, n)}</section>`;
}

const NET = `<svg class="net" viewBox="0 0 400 260" fill="none" stroke="#D8C3A0" stroke-width="1.4"><path d="M20 200 L90 120 L170 160 L240 70 L320 120 L380 40 M90 120 L120 40 L240 70 M170 160 L210 240 L320 120 M120 40 L60 30"/><g fill="#B08D57" stroke="none"><circle cx="20" cy="200" r="5"/><circle cx="90" cy="120" r="6"/><circle cx="170" cy="160" r="5"/><circle cx="240" cy="70" r="7"/><circle cx="320" cy="120" r="5"/><circle cx="380" cy="40" r="4"/><circle cx="120" cy="40" r="4"/><circle cx="210" cy="240" r="5"/><circle cx="60" cy="30" r="3"/></g></svg>`;
function sceneHTML(p, sc, i, n) {
  const theme = sc.big || i === 0 || i === n - 1 ? 'ink' : (i % 2 ? 'ivory' : 'sand');
  const top = `<div class="topbrand"><span style="display:flex;gap:16px;align-items:center"><img src="${LOGO}">Neurone</span><span class="count">${String(i + 1).padStart(2, '0')} / ${String(n).padStart(2, '0')}</span></div>`;
  let body;
  if (sc.big) body = `<div class="rel">${esc(sc.rel)}</div><div class="bigw" style="font-size:${plain(sc.big).length <= 4 ? 300 : plain(sc.big).length <= 9 ? 205 : 165}px">${esc(sc.big)}</div><div class="line"></div><div class="capl">${esc(sc.cap)}</div>`;
  else if (sc.name) body = `<div class="kicker">${md(sc.k)}</div><div class="namecard">${NET}<div class="nm">Fernanda Iotti</div><div class="role">Fisioterapeuta</div><div class="spec">Neurológica</div><div class="cref">20 anos · ex-HCor · Pós HC-FMUSP · CREFITO-3 000000-F</div></div>`;
  else { const glyph = sc.k.length <= 2 ? `<div class="glyph">${esc(sc.k)}</div>` : '';
    body = `${glyph}<div class="kicker">${md(sc.k)}</div><h2 class="h ${plain(sc.h).length > 34 ? 'lg' : 'xl'}">${md(sc.h)}</h2><div class="line"></div>`; }
  return { theme, html: `<section class="f scene ${theme}">${top}${body}<div class="sub">${esc(sc.n)}</div></section>` };
}
const sceneLabel = sc => sc.big ? `${sc.rel} · ${sc.big} — ${sc.cap}` : sc.name ? `${sc.k} — Fernanda Iotti, Fisioterapeuta Neurológica (cartela de nome)` : `${plain(sc.k)} — ${plain(sc.h)}`;

const coverHTML = p => `<section class="f scene cover-reel ink"><div class="arc" style="width:1100px;height:1100px;right:-560px;bottom:-200px"></div>
  <div class="kicker">${md(p.cover.k)}</div><h1 class="h">${md(p.cover.h)}</h1><div class="line"></div><div class="playtag">▶ Reel · Neurone</div>
  <div class="topbrand" style="position:absolute;top:150px;left:100px;right:100px"><span style="display:flex;gap:16px;align-items:center"><img src="${LOGO}">@${C.profile.username}</span></div></section>`;

const storyHTML = (h, st, i) => { const theme = i % 2 ? 'sand' : (h.tone === 'rose' ? 'rose' : 'ivory');
  return `<section class="f story ${i === 0 ? 'ink' : theme}"><div class="kicker">${md(st.k)}</div><h2 class="h">${md(st.h)}</h2><div class="line"></div><p class="b">${md(st.b)}</p>
  <div class="handle"><img src="${LOGO}">@${C.profile.username}</div></section>`; };
const hlCoverHTML = h => `<div class="hl ${h.tone === 'ink' ? '' : h.tone}"><div class="ring"><span>${esc(h.glyph)}</span></div></div>`;

async function shot(pg, html, file, sel = 'section, .hl') {
  fs.writeFileSync(path.join(TMP, 'p.html'), page(html));
  await pg.goto('file://' + path.join(TMP, 'p.html'));
  await pg.evaluate(() => document.fonts.ready);
  await pg.waitForTimeout(150);
  await pg.locator(sel).first().screenshot({ path: file });
}

const sh = (cmd, args) => execFileSync(cmd, args, { stdio: ['ignore', 'pipe', 'pipe'] }).toString();
const dur = f => parseFloat(sh('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f]));

function tts(text, file) {
  if (fs.existsSync(file) && fs.statSync(file).size > 1000) return;
  for (let k = 0; k < 4; k++) {
    try { sh('python3', [path.join(__dirname, 'tts.py'), text, file, VOICE]); if (fs.statSync(file).size > 1000) return; } catch (e) { }
  }
  throw new Error('TTS falhou: ' + text);
}

async function buildReel(pg, p) {
  const d = dirOf(p); const sd = path.join(d, 'cenas'); fs.mkdirSync(sd, { recursive: true });
  await shot(pg, coverHTML(p), path.join(d, 'capa.png'));
  const clips = []; let t = 0; const rows = [];
  for (let i = 0; i < p.scenes.length; i++) {
    const sc = p.scenes[i]; const { theme, html } = sceneHTML(p, sc, i, p.scenes.length);
    const png = path.join(sd, `cena-${String(i + 1).padStart(2, '0')}.png`); await shot(pg, html, png);
    const mp3 = path.join(sd, `narracao-${String(i + 1).padStart(2, '0')}.mp3`); tts(sc.n, mp3);
    const D = +(dur(mp3) + 0.7).toFixed(2); const clip = path.join(TMP, `clip-${p.id}-${i}.mp4`);
    sh('ffmpeg', ['-y', '-loop', '1', '-framerate', '30', '-t', String(D), '-i', png, '-i', mp3, '-filter_complex',
      `[0:v]scale=1080:1920,format=yuv420p,fade=t=in:st=0:d=0.3:color=${BG[theme]},fade=t=out:st=${(D - 0.25).toFixed(2)}:d=0.25:color=${BG[theme]}[v];[1:a]adelay=250|250,apad,atrim=0:${D},aformat=sample_rates=44100:channel_layouts=stereo[a]`,
      '-map', '[v]', '-map', '[a]', '-t', String(D), '-r', '30', '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '24', '-c:a', 'aac', '-b:a', '128k', clip]);
    clips.push(clip); rows.push({ i: i + 1, start: t, end: t + D, sc }); t += D;
  }
  const list = path.join(TMP, `list-${p.id}.txt`); fs.writeFileSync(list, clips.map(c => `file '${c}'`).join('\n'));
  sh('ffmpeg', ['-y', '-f', 'concat', '-safe', '0', '-i', list, '-c', 'copy', '-movflags', '+faststart', path.join(d, 'reel.mp4')]);
  const ts = x => `${Math.floor(x / 60)}:${String(Math.round(x % 60)).padStart(2, '0')}`;
  fs.writeFileSync(path.join(d, 'roteiro.md'),
`# ${p.id} · ${p.title}
**${fmtDate(p.date)}** · Reel · Pilar: ${p.pillar} · Duração: ~${Math.round(t)}s

**Capa (texto):** ${plain(p.cover.h)}

| # | Tempo | Texto na tela | Narração (voz em off) |
|---|---|---|---|
${rows.map(r => `| ${r.i} | ${ts(r.start)}–${ts(r.end)} | ${sceneLabel(r.sc)} | ${r.sc.n} |`).join('\n')}

**Narração completa (para a Fernanda regravar com a própria voz):**
> ${p.scenes.map(s => s.n).join(' ')}

**Imagens de apoio (B-roll) para a versão filmada:** ${p.broll}

**Edição:** cortes a cada cena, legenda sempre visível (70% assistem sem som), áudio em alta do Instagram em volume baixo (5–10%) por baixo da voz.

## Legenda
${p.caption}

${p.hashtags}
`);
}

async function buildCarousel(pg, p) {
  const d = dirOf(p); fs.mkdirSync(d, { recursive: true });
  for (let i = 0; i < p.slides.length; i++)
    await shot(pg, slideHTML(p.slides[i], i, p.slides.length), path.join(d, `slide-${String(i + 1).padStart(2, '0')}.png`));
  fs.writeFileSync(path.join(d, 'legenda.md'), `# ${p.id} · ${p.title}\n**${fmtDate(p.date)}** · Carrossel (${p.slides.length} slides) · Pilar: ${p.pillar}\n\n## Legenda\n${p.caption}\n\n${p.hashtags}\n`);
}

(async () => {
  fs.mkdirSync(TMP, { recursive: true }); fs.mkdirSync(OUT, { recursive: true });
  const b = await chromium.launch();
  const pg = await b.newPage({ viewport: { width: 1100, height: 1950 } });
  for (const p of C.posts) {
    if (only.length && !only.includes(p.id) && !only.includes('posts')) continue;
    process.stdout.write(`${p.id} ${p.type} ${p.title} … `);
    if (p.type === 'reel') await buildReel(pg, p); else await buildCarousel(pg, p);
    console.log('ok');
  }
  if (!only.length || only.includes('hl')) {
    for (const h of C.highlights) {
      const d = path.join(HL, h.id); fs.mkdirSync(d, { recursive: true });
      await shot(pg, hlCoverHTML(h), path.join(d, 'capa.png'));
      for (let i = 0; i < h.stories.length; i++) await shot(pg, storyHTML(h, h.stories[i], i), path.join(d, `story-${i + 1}.png`));
    }
    await shot(pg, `<div class="hl" style="background:#F7F2EA"><img src="${LOGO}" style="width:640px"></div>`, path.join(HL, 'foto-perfil-provisoria.png'));
    console.log('destaques ok');
  }
  // Calendário
  const cal = C.posts.map(p => `| ${p.id} | ${fmtDate(p.date)} | ${p.type === 'reel' ? '🎬 Reel' : '🖼️ Carrossel'} | ${p.pillar} | ${p.title} | \`${path.relative(ROOT, dirOf(p))}\` |`).join('\n');
  fs.writeFileSync(path.join(ROOT, 'CALENDARIO.md'), `# Calendário editorial · 12 semanas\n\nSegunda = Reel · Quarta = Carrossel técnico · Sexta = Dúvida da família\n\n| # | Data | Formato | Pilar | Tema | Pasta |\n|---|---|---|---|---|---|\n${cal}\n`);
  await b.close();
})();
