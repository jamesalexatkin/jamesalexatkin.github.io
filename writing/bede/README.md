# Bede ♝

Minimal static blog writer for jamesatk.in/writing.

Converts Markdown → HTML using a shared layout and CSS-classed components.

## Structure

```
bede/
├── build.py          # Entry point — run this to build
├── renderer.py       # Custom Mistune renderer (all HTML has post__* classes)
├── templates.py      # Layout, post page, and index page templates
├── requirements.txt
```

Output goes to `writing/posts` which mirrors the `/writing/posts` path on the live site.

## Authoring a post

Create a `.md` file in `posts/`. Frontmatter fields:

```yaml
---
title: "My Post Title"
date: 2025-01-15
description: A short summary shown on the index and in meta tags.
tags: [python, hardware] # optional
draft: true # set to omit from build
---
```

## Running locally

```bash
pip install -r requirements.txt
python .\writing\bede\build.py
# Open writing/index.html in a browser
```

## Styling

`writing.css` contains all `post__*` and `writing-index__*` BEM classes.
Design tokens (colours, fonts) are expected as CSS variables from your main
`style.css`, e.g. `--color-text`, `--color-accent`, `--font-serif`, `--font-mono`.

If your main stylesheet doesn't define these yet, hardcode values in
`writing.css` and migrate to variables later.

## Adding a new element type

To customise how any Markdown element renders, add or override a method
in `renderer.py`. Each method returns a plain HTML string. The naming
convention is `post__<element>` for the CSS class.
