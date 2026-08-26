#!/usr/bin/env python3

import json
from pathlib import Path

ROOT = Path(".")
DATA_FILE = ROOT / "_data" / "drafts.json"

with open(DATA_FILE, "r", encoding="utf-8") as f:
    drafts = json.load(f)

drafts_by_name = {
    d["shortName"].strip(): d
    for d in drafts
}

def process_directory(lang):
    directory = ROOT / "drafts" / lang

    for md_file in directory.glob("*.md"):
        short_name = md_file.stem.strip()
        draft = drafts_by_name.get(short_name)

        if not draft:
            print(f"SKIP: {md_file} — no entry in drafts.json")
            continue

        if lang == "hi":
            title = draft.get("hiTitle") or draft["shortName"]
            description = draft.get("hiDesc", "")
            nav_key = draft.get("hiNav") or f"draft-hi-{short_name}"
            parent = "drafts-hi"
        else:
            title = draft.get("enTitle") or draft["shortName"]
            description = draft.get("enDesc", "")
            nav_key = draft.get("enNav") or f"draft-en-{short_name}"
            parent = "drafts-en"

        front_matter = f"""---
title: "{title.replace('"', '\\"')}"
description: "{description.replace('"', '\\"').replace(chr(10), ' ')}"
eleventyNavigation:
  key: "{nav_key}"
  parent: "{parent}"
  title: "{title.replace('"', '\\"')}"
---

"""

        content = md_file.read_text(encoding="utf-8")

        # Don't add front matter twice.
        if content.lstrip().startswith("---"):
            print(f"SKIP: {md_file} — already has front matter")
            continue

        md_file.write_text(front_matter + content, encoding="utf-8")
        print(f"OK:   {md_file}")


process_directory("hi")
process_directory("en")
