#!/usr/bin/env python3
"""
build.py — Static blog builder for jamesatk.in/writing
Converts Markdown posts to HTML using a shared layout and component renderer.
"""

import os
import shutil
from pathlib import Path
from datetime import datetime

import frontmatter
import mistune

from renderer import BlogRenderer
from templates import render_post, render_index

# ---------------------------------------------------------------------------
# Paths
# ---------------------------------------------------------------------------

# POSTS_DIR = Path("writing-builder/posts")          # Source: Markdown files
# OUTPUT_DIR = Path("dist/writing")  # Output: mirrors /writing/ on GH Pages

BASE_WRITING_DIR = Path(__file__).parent.parent

POSTS_DIR = BASE_WRITING_DIR / "posts"
"""Source Markdown files."""
OUTPUT_DIR = BASE_WRITING_DIR

# ---------------------------------------------------------------------------
# Build
# ---------------------------------------------------------------------------

def parse_post(path: Path) -> dict:
    """Parse a Markdown file and return metadata + rendered HTML body."""
    post = frontmatter.load(path)

    renderer = BlogRenderer()
    md = mistune.create_markdown(
        renderer=renderer,
        plugins=["strikethrough", "table", "footnotes"],
    )

    return {
        "slug":        path.stem,
        "title":       post.get("title", path.stem.replace("_", " ").title()),
        "date":        post.get("date", None),
        "description": post.get("description", ""),
        "tags":        post.get("tags", []),
        "draft":       post.get("draft", False),
        "body":        md(post.content),
    }


def build():
    print(f"♝  Starting Bede build\n")
    
    # Parse all non-draft posts
    md_files = sorted(POSTS_DIR.glob("*/*.md"), reverse=True)
    print(f"Found {len(md_files)} Markdown files in {POSTS_DIR}:")
        
    posts = []
    for md_file in md_files:
        post = parse_post(md_file)
        post["slug"] = md_file.parent.name  # e.g. "mot_du_jour"
        if post["draft"]:
            print(f"  [skip] {md_file.name} (draft)")
            continue
        posts.append(post)
        print(f" ✍️  [build] {md_file.name}")

    # Sort by date descending
    posts.sort(key=lambda p: p["date"] or datetime.min, reverse=True)

    # Write individual post pages
    for post in posts:
        out_path = POSTS_DIR / post["slug"] / "index.html"
        out_path.parent.mkdir(parents=True, exist_ok=True)
        out_path.write_text(render_post(post), encoding="utf-8")

    # Write index page
    index_path = OUTPUT_DIR / "index.html"
    index_path.write_text(render_index(posts), encoding="utf-8")

    print(f"\n✅ Built {len(posts)} posts → {OUTPUT_DIR}/")


if __name__ == "__main__":
    build()
