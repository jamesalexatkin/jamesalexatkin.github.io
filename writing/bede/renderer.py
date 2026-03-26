"""
renderer.py — Custom Mistune renderer
Each HTML element is emitted with a BEM-style class so CSS can target
blog content without leaking styles to the rest of the site, and without
needing high-specificity selectors.

Class naming convention:  post__<element>  (e.g. post__h2, post__blockquote)
Code blocks also get a  language-<lang>  class for syntax highlighter hooks.
"""

import mistune


class BlogRenderer(mistune.HTMLRenderer):

    # -------------------------------------------------------------------------
    # Headings
    # -------------------------------------------------------------------------

    def heading(self, text: str, level: int, **attrs) -> str:
        # Slug the text for anchor links so headings are linkable
        slug = text.lower().replace(" ", "-").replace("'", "")
        return (
            f'<h{level} class="post__h{level}" id="{slug}">'
            f'<a class="post__heading-anchor" href="#{slug}">{text}</a>'
            f'</h{level}>\n'
        )

    # -------------------------------------------------------------------------
    # Paragraphs & inline text
    # -------------------------------------------------------------------------

    def paragraph(self, text: str) -> str:
        return f'<p class="post__p">{text}</p>\n'

    def strong(self, text: str) -> str:
        return f'<strong class="post__strong">{text}</strong>'

    def emphasis(self, text: str) -> str:
        return f'<em class="post__em">{text}</em>'

    def strikethrough(self, text: str) -> str:
        return f'<del class="post__del">{text}</del>'

    # -------------------------------------------------------------------------
    # Links & images
    # -------------------------------------------------------------------------

    def link(self, text: str, url: str, title: str = None) -> str:
        title_attr = f' title="{title}"' if title else ""
        # Mark external links so CSS (or JS) can style/handle them differently
        external = url.startswith("http")
        extra = ' class="post__link post__link--external" rel="noopener noreferrer" target="_blank"' if external \
           else ' class="post__link"'
        return f'<a href="{url}"{title_attr}{extra}>{text}</a>'

    def image(self, alt: str, url: str, title: str = None) -> str:
        title_attr = f' title="{title}"' if title else ""
        caption = f'<figcaption class="post__figcaption">{alt}</figcaption>' if alt else ""
        return (
            f'<figure class="post__figure">'
            f'<img class="post__img" src="{url}" alt="{alt}"{title_attr} loading="lazy">'
            f'{caption}'
            f'</figure>\n'
        )

    # -------------------------------------------------------------------------
    # Lists
    # -------------------------------------------------------------------------

    def list(self, text: str, ordered: bool, **attrs) -> str:
        tag = "ol" if ordered else "ul"
        cls = "post__ol" if ordered else "post__ul"
        return f'<{tag} class="{cls}">{text}</{tag}>\n'

    def list_item(self, text: str, **attrs) -> str:
        return f'<li class="post__li">{text}</li>\n'

    # -------------------------------------------------------------------------
    # Blockquote
    # -------------------------------------------------------------------------

    def block_quote(self, text: str) -> str:
        return f'<blockquote class="post__blockquote">{text}</blockquote>\n'

    # -------------------------------------------------------------------------
    # Code
    # -------------------------------------------------------------------------

    def block_code(self, code: str, **attrs) -> str:
        lang = (attrs.get("info") or "").strip().split()[0] if attrs.get("info") else ""
        lang_class = f" language-{lang}" if lang else ""
        # data-lang puts the language label in CSS via attr() if you want it
        data_lang = f' data-lang="{lang}"' if lang else ""
        return (
            f'<pre class="post__pre{lang_class}"{data_lang}>'
            f'<code class="post__code{lang_class}">'
            f'{mistune.escape(code)}'
            f'</code></pre>\n'
        )

    def codespan(self, code: str) -> str:
        return f'<code class="post__codespan">{mistune.escape(code)}</code>'

    # -------------------------------------------------------------------------
    # Horizontal rule & line break
    # -------------------------------------------------------------------------

    def thematic_break(self) -> str:
        return '<hr class="post__hr">\n'

    def linebreak(self) -> str:
        return '<br class="post__br">\n'

    # -------------------------------------------------------------------------
    # Table (requires table plugin)
    # -------------------------------------------------------------------------

    def table(self, text: str) -> str:
        return f'<div class="post__table-wrapper"><table class="post__table">{text}</table></div>\n'

    def table_head(self, text: str) -> str:
        return f'<thead class="post__thead"><tr class="post__tr">{text}</tr></thead>\n'

    def table_body(self, text: str) -> str:
        return f'<tbody class="post__tbody">{text}</tbody>\n'

    def table_row(self, text: str) -> str:
        return f'<tr class="post__tr">{text}</tr>\n'

    def table_cell(self, text: str, **attrs) -> str:
        align = attrs.get("align") or ""
        align_attr = f' style="text-align:{align}"' if align else ""
        tag = "th" if attrs.get("is_head") else "td"
        cls = "post__th" if attrs.get("is_head") else "post__td"
        return f'<{tag} class="{cls}"{align_attr}>{text}</{tag}>\n'
