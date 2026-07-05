import os
import shutil
import requests
from bs4 import BeautifulSoup, Comment
from urllib.parse import urlparse, parse_qs


WIKI = "http://127.0.0.1:8080"

def format_images(html):
    soup = BeautifulSoup(html, "html.parser")

    for img in soup.find_all("img"):
        src = img.get("src")

        if not src:
            continue

        if src.startswith("http://") or src.startswith("https://"):
            continue

        if not src.startswith("/images/"):
            continue

        url = WIKI + src

        # Mirror MediaWiki's directory structure
        destination = src.lstrip("/")

        os.makedirs(os.path.dirname(destination), exist_ok=True)

        if not os.path.exists(destination):
            print(f"Downloading {src}")

            r = requests.get(url)

            if r.status_code == 200:
                with open(destination, "wb") as f:
                    f.write(r.content)
            else:
                print(f"Failed: {url}")
                continue

        # HTML can keep the same path
        img["src"] = src

    return str(soup)

def page_to_url(title):
    return "/" + title.replace(" ", "_") + "/"

def format_url(html):
    soup = BeautifulSoup(html, "html.parser")

    for a in soup.find_all("a", href=True):
        href = a["href"]

        # -------- File pages --------

        # http://127.0.0.1:8080/index.php/File:Photo.jpg
        if href.startswith(WIKI + "/index.php/File:"):
            filename = href.split("File:", 1)[1]

            img = a.find("img")
            if img and img.get("src"):
                a["href"] = img["src"]
            else:
                a["href"] = "/images/" + filename

        # /index.php/File:Photo.jpg
        elif href.startswith("/index.php/File:"):
            filename = href.split("File:", 1)[1]

            img = a.find("img")
            if img and img.get("src"):
                a["href"] = img["src"]
            else:
                a["href"] = "/images/" + filename

        # -------- Red links --------

        elif "index.php?title=" in href:
            parsed = urlparse(href)
            params = parse_qs(parsed.query)

            if "title" in params:
                a["href"] = page_to_url(params["title"][0])

        # -------- Normal page links --------

        elif href.startswith(WIKI + "/index.php/"):
            title = href[len(WIKI + "/index.php/"):]
            a["href"] = page_to_url(title)

        elif href.startswith("/index.php/"):
            title = href[len("/index.php/"):]
            a["href"] = page_to_url(title)

    return str(soup)

def get_pages():
    pages = []
    apcontinue = None

    while True:
        params = {
            "action": "query",
            "list": "allpages",
            "aplimit": "max",
            "format": "json"
        }

        if apcontinue:
            params["apcontinue"] = apcontinue

        r = requests.get(f"{WIKI}/api.php", params=params)
        data = r.json()

        for page in data["query"]["allpages"]:
            pages.append(page["title"])

        if "continue" not in data:
            break

        apcontinue = data["continue"]["apcontinue"]

    return pages


def export_page(title):
    page_name = title.replace(" ", "_")

    html = requests.get(
        f"{WIKI}/index.php/{page_name}?action=render"
    ).text

    soup = BeautifulSoup(html, "html.parser")

    # Remove MediaWiki parser comments
    for comment in soup.find_all(
            string=lambda t: isinstance(t, Comment)):
        comment.extract()

    wrapper = soup.find("div", class_="mw-parser-output")

    if wrapper:
        body = "".join(str(child) for child in wrapper.contents)
    else:
        body = str(soup)

    # Rewrite links
    body = format_url(body)
    body = format_images(body)

    frontmatter = f"""---
title: {title}
layout: layouts/base.njk
permalink: {page_to_url(page_name)}
---

"""

    filename = f"docs/{page_name}.html"

    os.makedirs(os.path.dirname(filename), exist_ok=True)

    with open(filename, "w", encoding="utf-8") as f:
        f.write(frontmatter)
        f.write(body)

    print(f"✓ {title}")


def main():
    # Clean previous export
    if os.path.exists("docs"):
        shutil.rmtree("docs")

    if os.path.exists("images"):
        shutil.rmtree("images")

    os.makedirs("docs", exist_ok=True)
    os.makedirs("images", exist_ok=True)

    pages = get_pages()

    print(f"Found {len(pages)} pages")

    for page in pages:
        export_page(page)

    print("\nExport complete!")

if __name__ == "__main__":
    main()
