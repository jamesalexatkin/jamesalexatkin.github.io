# CSS Guidelines

## BEM Naming

Use BEM (Block, Element, Modifier) for all component styles.

```scss
// Block: independent component
.component-name { }

// Element: part of a block (double underscore)
.component-name__element { }

// Modifier: variation of block or element (double dash)
.component-name--variant { }
.component-name__element--variant { }
```

**Rules:**
- Lowercase with hyphens only (no camelCase)
- One level of nesting: `.block__element`, not `.block__element__subelement`
- Modifiers represent states/variations, not layout

**When NOT to use BEM:**
- Page-level sections (`.about`, `.intro`, `.projects`)
- Generic reset/base styles (body, html)
- Layout wrappers in `_layout/`

---

## Directory Organization

- **`base/`** — Foundation styles (element resets, fonts, typography, custom properties)
- **`layout/`** — Page structure (header, navigation, main content, sections, responsive)
- **`components/`** — Reusable UI components following BEM naming
- **`pages/`** — Page-specific styles (pomodoro, weather, vellum, etc.)
- **Root** — `creative.scss` (main orchestrator), `_variables.scss` (CSS tokens), `_global.scss` (overrides)

Import order in `creative.scss`: abstracts → vendors → base → layout → global → components → pages

---

## CSS Custom Properties

All tokens in `variables.scss` under `:root`:

**Colors:**
- `--deep-black`: Main text/borders
- `--body-color`: Body text
- `--body-background-color`: Page background
- `--cloudy`: Muted/secondary text
- `--link-color`: Link default
- `--link-hover`: Link hover state

**Typography:**
- `--font-family-serif`: Display font (Bell MT)
- `--font-family-monospace`: Code/labels (PT Mono)

**Spacing:**
- `--border-amount`: Standard border width (1px)

**Use in SCSS:**
```scss
.component {
    color: var(--deep-black);
    border: var(--border-amount) solid var(--link-color);
}
```

---

## Adding New Components

1. **Create file** in `scss/components/_component-name.scss`
2. **Use BEM structure:**
   ```scss
   .component-name {
       /* block styles */
   }
   
   .component-name__element {
       /* element styles */
   }
   
   .component-name--variant {
       /* modifier styles */
   }
   ```
3. **Import** in `scss/creative.scss` in components section
4. **Update HTML** with matching class names
5. **Update JavaScript** if needed for dynamic classes
6. **Commit** with message: `"add component-name component"`

---

## Page-Specific Styles

- **Pomodoro, Vellum, Weather:** BEM naming within each file
- Keep page-specific imports at end of `creative.scss`
- Avoid duplicating base/component styles across pages

---

## Testing Changes

After SCSS edits:
1. Verify compiled CSS has no errors: `just build`
2. Check target pages still render correctly
3. Use browser DevTools to inspect specific classes
4. Commit only when verified

---

## Common Patterns

**Dark Mode (Unused)**
- Vestigial dark mode code in `utilities/_dark-mode.scss` — remove if needed

**Responsive Layouts**
- Media queries in `_layout/_responsive.scss`
- Use Bootstrap grid classes (col-lg-4, col-sm-6) where applicable

**Icon Buttons**
- Use `.icon-btn` with FontAwesome icons
- Variants: `.icon-btn--color-{1-4}`, `.icon-btn--dark`
