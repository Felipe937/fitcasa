---
name: awesome-design-md
description: Use, extract, and enforce DESIGN.md design system specifications based on the VoltAgent/awesome-design-md standard (Google Stitch convention). Guides the adoption, creation, and audit of visual design languages from world-class tech brands (Linear, Vercel, Stripe, Apple, Figma, Claude, etc.) or tailored project design tokens.
---

# Awesome DESIGN.md — Design System Skill

## Overview

`DESIGN.md` is an open standard introduced by Google Stitch and popularized by the `VoltAgent/awesome-design-md` ecosystem. It is a plain-text Markdown document that encapsulates the complete visual design system of a web application or brand. While `AGENTS.md` instructs AI coding agents on *how* to build, `DESIGN.md` instructs design and coding agents on *how the UI should look, feel, and behave*.

This skill provides:
1. **Adoption**: Guidelines for applying curated `DESIGN.md` files from 70+ top tech companies (Linear, Vercel, Stripe, Apple, Figma, Claude, Airbnb, Notion, etc.).
2. **Generation**: Systematic generation of robust, tokenized `DESIGN.md` files for any project.
3. **Enforcement & Audit**: Auditing existing frontend code (React, HTML, CSS, Tailwind) against active `DESIGN.md` specifications.

---

## The DESIGN.md Specification Standard

Every valid `DESIGN.md` must follow a structured two-layer hierarchy:
1. **Machine-Readable YAML Frontmatter**: Precise tokens, color hex codes, font stacks, and layout constraints.
2. **Human- and Agent-Readable Markdown Body**: Design rationale, atmospheric guidelines, component behaviors, and anti-patterns.

### Canonical Schema

```markdown
---
version: 1.0
name: [Brand or App Name]-design-specification
description: [High-level visual identity summary and atmospheric mood]
colors:
  canvas: "#ffffff"             # Main background
  canvas-subtle: "#f9fafb"      # Secondary background / card surfaces
  canvas-elevated: "#ffffff"    # Modals / popovers / dropdowns
  ink: "#111827"                # Primary text / high contrast
  ink-secondary: "#4b5563"      # Secondary text / descriptions
  ink-muted: "#9ca3af"          # Placeholders / disabled states
  primary: "#0f766e"            # Core brand color
  primary-hover: "#0d5f58"      # Interactive hover state
  primary-on: "#ffffff"         # Text on primary background
  border: "#e5e7eb"             # Hairlines and container borders
  border-strong: "#d1d5db"      # Active inputs and dividers
  success: "#16a34a"
  warning: "#d97706"
  error: "#dc2626"
typography:
  display-font: "Outfit, system-ui, sans-serif"
  body-font: "Inter, -apple-system, BlinkMacSystemFont, sans-serif"
  mono-font: "JetBrains Mono, monospace"
  scale:
    xs: "0.75rem"
    sm: "0.875rem"
    base: "1rem"
    lg: "1.125rem"
    xl: "1.25rem"
    2xl: "1.5rem"
    3xl: "2rem"
    4xl: "2.75rem"
layout:
  max-width: "1200px"
  reading-width: "65ch"
  radius:
    sm: "0.375rem"
    md: "0.5rem"
    lg: "0.75rem"
    full: "9999px"
  shadows:
    sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)"
    md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)"
    lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)"
---
```

---

## Curated Design Archetypes from `awesome-design-md`

When styling or restyling an application, select from these battle-tested archetypes:

### 1. Linear (Dark Precision & Craft)
- **Palette**: Deep pitch black canvas (`#08090a`), obsidian card backgrounds (`#121316`), slate borders (`#222326`), radiant purple/violet or neutral silver accents.
- **Atmosphere**: Dense, technical, ultra-crisp 1px hair-lines, keyboard-first, subtle gradient glows on active elements.
- **Typography**: Clean sans-serif with tight letter-spacing (`-0.02em`) on headings and monospace for identifiers.

### 2. Vercel (Monochrome Minimalist & Mesh Accent)
- **Palette**: Pure white or pitch black canvas, pure monochrome typography (`#000000` / `#ffffff`), with vivid mesh gradients (cyan `#00dfd8` to magenta `#ff0080`) restricted solely to hero banners and active badges.
- **Atmosphere**: High whitespace, geometric sans, sharp technical precision, zero unnecessary decoration.

### 3. Stripe (Vibrant Financial Infrastructure)
- **Palette**: Soft cool gray canvas (`#f6f9fc`), rich navy headings (`#0a2540`), slate body (`#425466`), electric indigo primary (`#635bff`), soft tinted pastel surface cards.
- **Atmosphere**: Authoritative, friendly, accessible, rich isometric/isometric-styled diagrams, rounded geometry (`border-radius: 8px`).

### 4. Apple (Editorial Clean & Humanist)
- **Palette**: Pristine whites, neutral grays (`#f5f5f7`), pure deep black text (`#1d1d1f`), translucent blur headers (`backdrop-filter: blur(20px)`).
- **Atmosphere**: Cinematic imagery, generous whitespace, large fluid typography with balanced optical weights.

---

## Core Agent Workflows

### Workflow 1: Adopting a Curated `DESIGN.md`

1. When a user requests to build UI styled after a brand (e.g., *"Make it look like Linear"* or *"Use the Vercel design system"*):
   - Check the repository or fetch from `VoltAgent/awesome-design-md` (`https://raw.githubusercontent.com/VoltAgent/awesome-design-md/main/design-md/<brand>/DESIGN.md`).
   - Extract the color tokens, typography, and component styling rules.
   - Map them to the project's CSS variables or Tailwind configuration.

### Workflow 2: Generating a Project-Specific `DESIGN.md`

1. **Analyze the Project Mission**:
   - Determine target domain (e.g., healthcare, developer tool, fintech, educational, e-commerce).
   - Set density level: Low (Spacious / Editorial) vs Medium (SaaS App) vs High (Dashboard / Instrument).
2. **Define the Color Calibration**:
   - Single distinct accent color (saturation <= 80%).
   - Explicit surface scales: Canvas, Surface, Border, Ink.
   - Banned pattern: Generic saturated neon gradients and purple "AI slop" glows.
3. **Draft the `DESIGN.md`**:
   - Create the file at the project root (`/DESIGN.md`).
   - Document all tokens and component states (hover, focus-visible, active, disabled).

### Workflow 3: Auditing UI for `DESIGN.md` Compliance

When reviewing frontend components:
- **Token Check**: Verify that no hardcoded arbitrary hex values are used if a token exists (`var(--color-...)` or theme classes).
- **Focus Check**: All interactive elements have `:focus-visible` with matching ring tokens.
- **Typography Check**: Ensure hierarchy follows scale guidelines; headings use `text-wrap: balance` and appropriate tracking.
- **Responsive Check**: Grid containers must use `auto-fit` with sensible `minmax()` instead of rigid column counts.

---

## Anti-Patterns & Guardrails

- ❌ **No AI Slop:** Never use generic purple/blue neon glows or floating particle backgrounds unless explicitly asked.
- ❌ **No Contrast Violations:** All text on surfaces must achieve at least WCAG 2.1 AA (4.5:1 for normal text, 3:1 for large text).
- ❌ **No Arbitrary Spacing:** Stick strictly to the spacing ladder (`var(--espacio-*)` or `4px`, `8px`, `16px`, `24px`, `32px`, `48px`).
- ❌ **No Mixed Themes:** Don't fluctuate between warm and cool grays within the same view.
