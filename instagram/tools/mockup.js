// Prepara a mídia leve da simulação do perfil: node instagram/tools/mockup.js
const { execFileSync } = require('child_process');
const fs = require('fs'); const path = require('path');
const ROOT = path.resolve(__dirname, '..');
const C = require(path.join(ROOT, 'content.js'));
const M = path.join(ROOT, 'simulacao'); const MED = path.join(M, 'media');
fs.rmSync(MED, { recursive: true, force: true }); fs.mkdirSync(MED, { recursive: true });
const ff = a => execFileSync('ffmpeg', ['-y', '-loglevel', 'error', ...a]);
const jpg = (src, dst, w) => ff(['-i', src, '-vf', `scale=${w}:-2`, '-q:v', '4', dst]);
const dirs = fs.readdirSync(path.join(ROOT, 'posts'));
const media = { posts: {}, highlights: {} };
for (const p of C.posts) {
  const d = path.join(ROOT, 'posts', dirs.find(x => x.startsWith(p.id + '-')));
  const o = path.join(MED, p.id); fs.mkdirSync(o);
  if (p.type === 'reel') {
    jpg(path.join(d, 'capa.png'), path.join(o, 'capa.jpg'), 540);
    ff(['-i', path.join(d, 'reel.mp4'), '-vf', 'scale=720:-2', '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '27', '-c:a', 'aac', '-b:a', '96k', '-movflags', '+faststart', path.join(o, 'reel.mp4')]);
    media.posts[p.id] = { thumb: `media/${p.id}/capa.jpg`, video: `media/${p.id}/reel.mp4`,
      roteiro: fs.readFileSync(path.join(d, 'roteiro.md'), 'utf8') };
  } else {
    const slides = fs.readdirSync(d).filter(f => f.endsWith('.png')).sort();
    media.posts[p.id] = { slides: slides.map((f, i) => { jpg(path.join(d, f), path.join(o, `${i + 1}.jpg`), 720); return `media/${p.id}/${i + 1}.jpg`; }) };
    media.posts[p.id].thumb = media.posts[p.id].slides[0];
  }
  process.stdout.write(p.id + ' ');
}
for (const h of C.highlights) {
  const d = path.join(ROOT, 'destaques', h.id); const o = path.join(MED, 'hl-' + h.id); fs.mkdirSync(o);
  jpg(path.join(d, 'capa.png'), path.join(o, 'capa.jpg'), 200);
  const st = fs.readdirSync(d).filter(f => f.startsWith('story')).sort();
  media.highlights[h.id] = { cover: `media/hl-${h.id}/capa.jpg`, stories: st.map((f, i) => { jpg(path.join(d, f), path.join(o, `${i + 1}.jpg`), 720); return `media/hl-${h.id}/${i + 1}.jpg`; }) };
}
fs.copyFileSync(path.resolve(ROOT, '../site/assets/avatar-fernanda.jpg'), path.join(MED, 'avatar.jpg'));
fs.copyFileSync(path.resolve(ROOT, '../site/assets/logo.svg'), path.join(MED, 'logo.svg'));
fs.writeFileSync(path.join(M, 'data.js'), 'window.CONTENT=' + JSON.stringify(C) + ';\nwindow.MEDIA=' + JSON.stringify(media) + ';\n');
console.log('\nsimulação pronta');
