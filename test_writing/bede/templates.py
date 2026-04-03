"""
templates.py — HTML templates for post and index pages.

Edit the nav/footer here to match the main site's markup exactly.
Both templates reference the main site's stylesheet so styling stays in sync.
"""

from datetime import date, datetime


def fmt_date(d:datetime) -> str:
    """Format a date/datetime object to a readable string."""
    if d is None:
        return ""
    if isinstance(d, (date, datetime)):
        return d.strftime("%Y-%m-%d")  # e.g. "September 12, 2024"
    return str(d)


# ---------------------------------------------------------------------------
# Shared layout
# ---------------------------------------------------------------------------

def _layout(title: str, description: str, body: str) -> str:
    """Wrap content in the main site's layout shell."""
    desc_tag = f'<meta name="description" content="{description}">' if description else ""
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel=icon href=/favicon.png>
  <title>{title} — James Atkin</title>
  {desc_tag}
  <meta property="og:title" content="{title}">
  <meta property="og:description" content="{description}">

  <!-- Main site stylesheet — single source of truth for design tokens -->
  <!-- Theme CSS - Includes Bootstrap -->
  <link rel="stylesheet" href="/css/creative.css"  />
  <!-- Blog-specific styles (post__* classes, code highlighting, etc.) -->
  <link rel="stylesheet" href="/test_writing/static/writing.css">
  <!-- Syntax highlighting — Kimbie Light theme, background overridden in writing.css -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/styles/kimbie-light.min.css">
</head>
<body>

  <!-- =====================================================================
       NAV — copy from your main site and keep in sync
       ===================================================================== -->
  <!-- NAV — matches main site markup, anchor links point back to / -->
  <div class="header" id="header" role="banner">
    <a href="/" class="header-link">
      <span>James Atkin</span>
    </a>
    <div class="right-hand-nav" role="navigation">
      <a href="/#portfolio" class="header-link writing-link" rel="noopener noreferrer">
        <div class="title">Projects</div>
      </a>
      <div class="nav-divider"></div>
      <a href="/writing/" class="header-link writing-link" rel="noopener noreferrer">
        <div class="title">Writing</div>
      </a>
    </div>
  </div>

  <!-- =====================================================================
       PAGE CONTENT
       ===================================================================== -->
  <main class="site-main">
    {body}
  </main>

  <!-- =====================================================================
       FOOTER — copy from your main site and keep in sync
       ===================================================================== -->
  <!-- Footer -->
  <footer class="py-5" id="footer">
      <div class="container">
          <div class="small text-center" id="footer-text"
              >&copy; JAMES ATKIN <span id="year"></span
          ></div>
      </div>
  </footer>
  <script src="insertCurrentYear.js"></script>
  <!-- Syntax highlighting init -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/highlight.min.js"></script>
  <script>hljs.highlightAll();</script>

</body>
</html>"""


# ---------------------------------------------------------------------------
# Post page
# ---------------------------------------------------------------------------

def render_post(post: dict) -> str:
    """Render a single post page."""
    tags_html = ""
    if post.get("tags"):
        tag_items = "".join(
            f'<li class="post-meta__tag">{tag}</li>' for tag in post["tags"]
        )
        tags_html = f'<ul class="post-meta__tags">{tag_items}</ul>'

    body = f"""
    <article class="post">
      <header class="post__header">
        <h1 class="post__title">{post["title"]}</h1>
        <div class="post-meta">
          <time class="post-meta__date" datetime="{post["date"]}">{fmt_date(post["date"])}</time>
          {tags_html}
        </div>
        {"<p class='post__description'>" + post["description"] + "</p>" if post["description"] else ""}
      </header>

      <div class="post__body">
        {post["body"]}
      </div>

      <footer class="post__footer">
        <a class="post__back-link" href="/writing/">← All posts</a>
      </footer>
    </article>
    """

    return _layout(post["title"], post["description"], body)


# ---------------------------------------------------------------------------
# Index page
# ---------------------------------------------------------------------------

def render_index(posts: list[dict]) -> str:
    """Render the /writing/ index listing all posts."""
    if not posts:
        items_html = '<p class="writing-index__empty">No posts yet.</p>'
    else:
        items = []
        for post in posts:
            desc = f'<p class="writing-index__description">{post["description"]}</p>' if post["description"] else ""
            items.append(f"""
        <li class="writing-index__item">
          <a class="writing-index__link" href="/writing/posts/{post["slug"]}/">
            <span class="writing-index__title">{post["title"]}</span>
            <time class="writing-index__date" datetime="{post["date"]}">{fmt_date(post["date"])}</time>
          </a>
          {desc}
        </li>""")
        items_html = f'<ul class="writing-index__list">{"".join(items)}</ul>'

    body = f"""
    <section class="writing-index">
      <h1 class="writing-index__heading">Writing</h1>
      {items_html}
    </section>
    """

    return _layout("Writing", "Articles and notes by James Atkin.", body)
