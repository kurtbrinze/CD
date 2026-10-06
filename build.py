#!/usr/bin/env python3
"""Arma la PWA "Envíos al CD" en la carpeta dist/.

Las herramientas viven tal cual en src/tools/*.html. Para actualizar una,
reemplazá su archivo ahí y corré:  python build.py
"""
import json, shutil, datetime, pathlib
ROOT = pathlib.Path(__file__).parent
SRC, DIST = ROOT / 'src', ROOT / 'dist'
TOOLS = ['ingreso', 'entregas', 'comprobador', 'garita']
version = datetime.datetime.now().strftime('%Y%m%d-%H%M')

tools = {t: (SRC / 'tools' / f'{t}.html').read_text(encoding='utf-8') for t in TOOLS}
# JSON seguro para incrustar dentro de <script>: sin "<" literal
payload = json.dumps(tools, ensure_ascii=False).replace('<', '\\u003c').replace('\u2028', '\\u2028').replace('\u2029', '\\u2029')
shell = (SRC / 'shell.html').read_text(encoding='utf-8')
shell = shell.replace('/*__TOOLS__*/', payload, 1).replace('/*__VERSION__*/', version, 1)

if DIST.exists(): shutil.rmtree(DIST)
(DIST / 'icons').mkdir(parents=True)
(DIST / 'index.html').write_text(shell, encoding='utf-8')
(DIST / 'sw.js').write_text((SRC / 'sw.js').read_text(encoding='utf-8').replace('__VERSION__', version), encoding='utf-8')
shutil.copy(SRC / 'manifest.webmanifest', DIST)
for p in (SRC / 'icons').glob('*.png'): shutil.copy(p, DIST / 'icons')
print('Versión', version, '→', DIST)
