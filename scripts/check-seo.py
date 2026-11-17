"""Check what crawlers receive in the production artifact, without running JavaScript."""
import json
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlparse
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1] / 'dist/girardot-express-angular/browser'
ORIGIN = 'https://girardotexpress.com.co'


class Page(HTMLParser):
    def __init__(self, source):
        super().__init__()
        self.meta, self.canonical, self.schemas = {}, [], []
        self.h1 = 0
        self.schema = None
        self.feed(source)

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == 'meta':
            self.meta[attrs.get('name', attrs.get('property'))] = attrs.get('content', '')
        if tag == 'link' and attrs.get('rel') == 'canonical':
            self.canonical.append(attrs.get('href'))
        if tag == 'h1':
            self.h1 += 1
        if tag == 'script' and attrs.get('type') == 'application/ld+json':
            self.schema = ''

    def handle_data(self, data):
        if self.schema is not None:
            self.schema += data

    def handle_endtag(self, tag):
        if tag == 'script' and self.schema is not None:
            self.schemas.append(json.loads(self.schema))
            self.schema = None


robots = (ROOT / 'robots.txt').read_text(encoding='utf-8')
assert f'Sitemap: {ORIGIN}/sitemap.xml' in robots
assert 'Allow: /' in robots
sitemap = ET.parse(ROOT / 'sitemap.xml')
urls = [node.text for node in sitemap.findall('.//{http://www.sitemaps.org/schemas/sitemap/0.9}loc')]
assert len(urls) == len(set(urls)) == 5
assert f'{ORIGIN}/privacidad/' not in urls
for url in urls:
    assert url.startswith(ORIGIN + '/')
    page = Page((ROOT / urlparse(url).path.strip('/') / 'index.html').read_text(encoding='utf-8'))
    assert page.canonical == [url], (url, page.canonical)
    assert page.meta['og:url'] == url
    assert page.meta['og:image'].startswith(ORIGIN + '/')
    assert page.meta['description'] and page.h1 == 1
    assert 'noindex' not in page.meta.get('robots', '')
    assert page.meta['google-site-verification']
    assert any(schema.get('@type') == 'WebSite' and schema['url'] == ORIGIN + '/' for schema in page.schemas)
    print('OK', url)
privacy = Page((ROOT / 'privacidad/index.html').read_text(encoding='utf-8'))
assert 'noindex' in privacy.meta['robots'], 'The draft privacy notice must remain excluded.'
assert '/espacios-comerciales  /proyecto/  301' in (ROOT / '_redirects').read_text()
print('OK: sitemap, robots, public canonical URLs, verification tag and private draft exclusion')
