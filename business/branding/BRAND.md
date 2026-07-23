# SkillCo Brand Identity

## Brand Essence

**Tagline:** *Turn Skills Into Companies*

**Mission:** Make entrepreneurship as simple as learning a skill. One process: develop it, design it, ship it, run it.

**Vision:** The App Store for work — a marketplace where every skill becomes a product, and every creator becomes a founder.

---

## Brand Personality

| Trait | Expression |
|-------|------------|
| **Empowering** | We turn individuals into entrepreneurs |
| **Systematic** | One clear process, every time |
| **Premium** | High-end quality, no amateur hour |
| **Accessible** | Complex made simple |
| **Future-Forward** | AI-native from day one |

**Voice:** Confident but not arrogant. Technical but approachable. We speak like a brilliant mentor who happens to be your friend.

---

## Logo System

### Primary Mark
A stylized "S" formed by two interlocking gears/cogs — representing the transformation of raw skill into operational company.

### Logo Variants
1. **Primary:** Full logo (mark + wordmark)
2. **Secondary:** Mark only (icon use)
3. **Wordmark:** "SkillCo" text only
4. **Monochrome:** Single-color version for reduced environments

### Logo Usage
- Minimum clear space: Height of the "S" on all sides
- Minimum size: 24px height for digital, 0.5" for print
- Never stretch, rotate, or add effects

---

## Color System

### Primary Palette

| Name | Hex | RGB | Usage |
|------|-----|-----|-------|
| **Midnight** | `#0A0A0B` | 10, 10, 11 | Backgrounds, primary dark |
| **Slate** | `#18181B` | 24, 24, 27 | Cards, secondary surfaces |
| **Graphite** | `#27272A` | 39, 39, 42 | Elevated surfaces |

### Accent Palette

| Name | Hex | RGB | Usage |
|------|-----|-----|-------|
| **Electric Violet** | `#8B5CF6` | 139, 92, 246 | Primary accent, CTAs |
| **Vivid Purple** | `#A78BFA` | 167, 139, 250 | Hover states, highlights |
| **Soft Lavender** | `#C4B5FD` | 196, 181, 253 | Subtle accents |

### Supporting Colors

| Name | Hex | RGB | Usage |
|------|-----|-----|-------|
| **Snow** | `#FAFAFA` | 250, 250, 250 | Primary text on dark |
| **Mist** | `#A1A1AA` | 161, 161, 170 | Secondary text |
| **Success** | `#22C55E` | 34, 197, 94 | Positive states |
| **Warning** | `#F59E0B` | 245, 158, 11 | Attention states |
| **Error** | `#EF4444` | 239, 68, 68 | Error states |

### Gradient

```css
/* Primary gradient - for hero elements */
background: linear-gradient(135deg, #8B5CF6 0%, #3B82F6 100%);

/* Mesh gradient - for backgrounds */
background: radial-gradient(ellipse at 20% 30%, rgba(139, 92, 246, 0.15) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 70%, rgba(59, 130, 246, 0.1) 0%, transparent 50%);
```

---

## Typography

### Font Stack

| Role | Font | Fallback | Weight |
|------|------|----------|--------|
| **Display** | Clash Display | system-ui | 600-700 |
| **Headings** | Plus Jakarta Sans | Inter, system-ui | 500-700 |
| **Body** | Plus Jakarta Sans | Inter, system-ui | 400-500 |
| **Mono** | JetBrains Mono | Menlo, monospace | 400-500 |

### Type Scale

```css
--text-xs: 0.75rem;    /* 12px */
--text-sm: 0.875rem;   /* 14px */
--text-base: 1rem;     /* 16px */
--text-lg: 1.125rem;   /* 18px */
--text-xl: 1.25rem;    /* 20px */
--text-2xl: 1.5rem;    /* 24px */
--text-3xl: 1.875rem;  /* 30px */
--text-4xl: 2.25rem;   /* 36px */
--text-5xl: 3rem;      /* 48px */
--text-6xl: 3.75rem;   /* 60px */
--text-7xl: 4.5rem;    /* 72px */
```

### Heading Styles

- **H1 (Hero):** Clash Display, 72px, 700, -0.02em tracking
- **H2 (Section):** Plus Jakarta Sans, 48px, 600, -0.015em tracking
- **H3 (Subsection):** Plus Jakarta Sans, 30px, 600, normal tracking
- **H4 (Card title):** Plus Jakarta Sans, 20px, 600, normal tracking

---

## Iconography

- **Style:** Phosphor Icons (Light weight) or custom line icons
- **Stroke:** 1.5px consistent weight
- **Size:** 20px default, 24px for navigation, 16px for inline
- **Color:** Inherit from text or accent

---

## Imagery

### Photography Style
- Abstract technology imagery
- Clean workspaces with minimal objects
- Gradient light effects
- No obvious stock photo aesthetics

### Illustration Style
- Geometric, abstract shapes
- Gradient fills (violet → blue spectrum)
- Floating 3D elements with soft shadows
- Glass/frosted effects

---

## Motion Principles

1. **Purposeful:** Every animation serves a function
2. **Swift:** Quick but not jarring (200-400ms typical)
3. **Smooth:** Custom cubic-bezier easing, never linear
4. **Subtle:** Enhance, don't distract

### Standard Easing
```css
--ease-out: cubic-bezier(0.32, 0.72, 0, 1);
--ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);
```

---

## Domain

**Primary:** skillco.work
**Pattern:** [product].skillco.work for sub-products

---

## Taglines & Copy

**Primary:** Turn Skills Into Companies

**Alternatives:**
- From skill to ship in one process
- The App Store for work
- Build once. Run forever.
- Your skill. Your company. Our platform.

---

## Design System Tokens (CSS)

```css
:root {
  /* Colors */
  --color-midnight: #0A0A0B;
  --color-slate: #18181B;
  --color-graphite: #27272A;
  --color-violet: #8B5CF6;
  --color-vivid: #A78BFA;
  --color-lavender: #C4B5FD;
  --color-snow: #FAFAFA;
  --color-mist: #A1A1AA;
  
  /* Spacing */
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-6: 1.5rem;
  --space-8: 2rem;
  --space-12: 3rem;
  --space-16: 4rem;
  --space-24: 6rem;
  --space-32: 8rem;
  
  /* Radii */
  --radius-sm: 0.5rem;
  --radius-md: 0.75rem;
  --radius-lg: 1rem;
  --radius-xl: 1.5rem;
  --radius-2xl: 2rem;
  --radius-full: 9999px;
  
  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(0,0,0,0.5);
  --shadow-md: 0 4px 12px rgba(0,0,0,0.5);
  --shadow-lg: 0 8px 24px rgba(0,0,0,0.5);
  --shadow-glow: 0 0 32px rgba(139, 92, 246, 0.3);
}
```
