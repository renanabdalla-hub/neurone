# Narração PT-BR (voz neural). Uso: python3 tts.py "texto" saida.mp3 [voz]
import sys, os, ssl, certifi
ca = os.environ.get("TTS_CA", "/root/.ccr/ca-bundle.crt")
if os.path.exists(ca):
    certifi.where = lambda: ca
import asyncio, edge_tts
async def main(text, out, voice):
    await edge_tts.Communicate(text, voice, rate="-4%").save(out)
asyncio.run(main(sys.argv[1], sys.argv[2], sys.argv[3] if len(sys.argv) > 3 else "pt-BR-ThalitaMultilingualNeural"))
