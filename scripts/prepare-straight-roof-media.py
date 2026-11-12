"""Prepare the client's existing straight-roof renders for the website (Pillow)."""
import argparse
import hashlib
import json
from pathlib import Path

from PIL import Image, ImageOps

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('source', type=Path, help='Folder containing the original renderfinal PNGs')
args = parser.parse_args()
output = Path(__file__).resolve().parents[1] / 'public/assets/techo-recto'
output.mkdir(parents=True, exist_ok=True)
selection = {
    'fachada.webp': 'renderfinal1.png',
    'recorrido.webp': 'renderfinal12.png',
    'acceso.webp': 'renderfinal5.png',
    'plazoleta.webp': 'renderfinal8.png',
    'vista-general.webp': 'renderfinal10.png',
}
records = []
for target, original in selection.items():
    source = args.source / original
    with Image.open(source) as image:
        prepared = ImageOps.fit(image.convert('RGB'), (1920, 1080), Image.Resampling.LANCZOS)
        prepared.save(output / target, 'WEBP', quality=88, method=6)
    records.append({
        'file': target, 'source': original,
        'sourceSha256': hashlib.sha256(source.read_bytes()).hexdigest(),
        'sha256': hashlib.sha256((output / target).read_bytes()).hexdigest(),
        'width': 1920, 'height': 1080,
    })
(output / 'PROVENANCE.json').write_text(json.dumps({
    'origin': 'Original architectural renders supplied by the client',
    'processing': 'Local resize/crop and WebP encoding only. No generative editing.',
    'design': 'Straight roof matching the current 3D model',
    'files': records,
}, indent=2) + '\n', encoding='utf-8')
print(f'Prepared {len(records)} straight-roof images.')
