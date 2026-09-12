#!/usr/bin/env python3
"""Check generated internal links and search targets before publishing."""

import re
import sys
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urljoin, urlsplit

root = Path(sys.argv[1] if len(sys.argv) > 1 else "_site").resolve()
origin = "https://hongtaoxuu.github.io"
errors = set()


def check_url(raw, source):
    url = urlsplit(urljoin(origin + "/" + source.relative_to(root).as_posix(), raw))
    if url.scheme not in ("http", "https") or url.netloc != urlsplit(origin).netloc:
        return
    target = root / unquote(url.path).lstrip("/")
    if target.is_dir():
        target /= "index.html"
    if not target.is_file():
        errors.add(f"{source.relative_to(root)} -> {url.path}")


class Links(HTMLParser):
    def __init__(self, source):
        super().__init__()
        self.source = source

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        for key in ("href", "src", "data-zoom-src"):
            if attrs.get(key):
                check_url(attrs[key], self.source)
        if attrs.get("srcset") and not attrs["srcset"].startswith("data:"):
            for candidate in attrs["srcset"].split(","):
                if candidate.strip():
                    check_url(candidate.split()[0], self.source)
        for target in attrs.get("aria-controls", "").split():
            if target not in ids[self.source]:
                errors.add(f"{self.source.relative_to(root)} -> missing aria-controls target {target}")


pages = list(root.rglob("*.html"))
if not pages:
    sys.exit(f"No generated HTML in {root}")
ids = {}
for page in pages:
    text = page.read_text(encoding="utf-8")
    ids[page] = set(re.findall(r'\bid=["\']([^"\']+)', text))
    Links(page).feed(text)

search = root / "assets/js/search-data.js"
if search.exists():
    for target in re.findall(r'window\.location\.href\s*=\s*["\']([^"\']+)', search.read_text()):
        check_url(target, search)

for item in ("blog", "projects", "books", "temp"):
    if (root / item).exists():
        errors.add(f"Unexpected published directory: {item}")
for name in ("sitemap.xml", "feed.xml"):
    path = root / name
    if path.exists() and re.search(r"/(blog|projects|books|temp)/", path.read_text()):
        errors.add(f"Demo or private content in {name}")

if errors:
    sys.exit("Site validation failed:\n" + "\n".join(sorted(errors)))
print(f"Validated {len(pages)} HTML pages, image sources, disclosure targets, and search links.")
