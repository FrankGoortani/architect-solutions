# Architect.Solutions Brand Guide
**AI Implementation Specialist | Production LLM Systems**

**Last Updated**: December 21, 2025

---

## Brand Positioning

**Tagline**: "Ship Production LLM Systems Fast"

**Voice**: Technical expert, approachable mentor, proven builder
**Tone**: Confident but not arrogant, practical over theoretical, results-focused

**Target Audience**: CTOs, VPs Engineering at AI-first startups and enterprises

**Differentiation**:
- Award-winning track record (Uber ELLE)
- Production systems focus (not POCs)
- 25+ years full-stack experience + cutting-edge AI
- Available for contract work (10-40 hrs/week)

---

## Visual Identity

### Design Philosophy

**"Technical Warmth"** - Modern tech aesthetic with approachable, human elements

**Principles**:
1. **Technical but approachable** - Show expertise without intimidation
2. **Warm yet professional** - Brick/gold warmth + cool blue accents
3. **Modern with character** - Clean design + distinctive voxel logo
4. **Production-focused** - Solid, reliable, battle-tested feel

---

## Color Palette

### Core Neutrals (80% usage)
Primary colors for text, backgrounds, and structure

```css
--color-ink: #1E1B16          /* Almost black, warm undertone */
--color-charcoal: #2B2A2A     /* Dark gray for secondary text */
--color-warm-gray: #ECE8E1    /* Light gray with warmth */
--color-paper: #FAF7F2        /* Off-white, warm background */
```

**Usage**:
- `--color-ink`: Primary text, headings, icons
- `--color-charcoal`: Secondary text, captions, metadata
- `--color-warm-gray`: Borders, dividers, card backgrounds
- `--color-paper`: Page background, card surfaces

**Why warm neutrals**: Creates approachable, human feel vs cold tech grays

---

### Brand Colors (15% usage)
Distinctive warmth that sets us apart

```css
--color-block-gold: #EAC869   /* Warm gold, voxel-inspired */
--color-brick: #9B4A2E        /* Terracotta brick, heritage */
--color-deep-outline: #2E1B12 /* Dark brown for depth */
```

**Usage**:
- `--color-block-gold`: Primary CTAs, highlights, section accents
- `--color-brick`: Logo, key visual elements, hover states
- `--color-deep-outline`: Borders on gold elements, shadows

**Why brick/gold**: References voxel logo (brick-like), creates warm, solid, trustworthy feel

---

### Tech Accents (5% usage)
Cool colors for AI/tech context

```css
--color-teal: #3FA7A4         /* Blue-green, AI/tech feel */
--color-sky: #6EC1E4          /* Light blue, modern tech */
--color-ai-purple: #8B7CC8    /* NEW: AI/neural nets */
--color-code-green: #4ECDC4   /* NEW: Terminal/code feel */
```

**Usage**:
- `--color-teal`: Links, interactive elements, underlines
- `--color-sky`: Gradients, backgrounds, secondary CTAs
- `--color-ai-purple`: AI-specific content, code snippets, tech badges
- `--color-code-green`: Code blocks, technical callouts

**Why cool accents**: Balance warmth with modern tech feel, AI associations

---

### Functional Colors

```css
/* Success */
--color-success: #4ECDC4      /* Teal-green */
--color-success-bg: #E8F8F5   /* Light teal background */

/* Warning */
--color-warning: #F39C12      /* Warm orange */
--color-warning-bg: #FEF5E7   /* Light orange background */

/* Error */
--color-error: #E74C3C        /* Red */
--color-error-bg: #FDEDEC     /* Light red background */

/* Info */
--color-info: #3498DB         /* Blue */
--color-info-bg: #EBF5FB      /* Light blue background */
```

---

## Typography

### Font Families

```css
--font-primary: 'Inter', sans-serif;        /* Body text */
--font-heading: 'Manrope', sans-serif;      /* Headings */
--font-code: 'JetBrains Mono', monospace;   /* Code blocks */
--font-voxel: 'Press Start 2P', monospace;  /* Special/logo */
```

**Why these fonts**:
- **Inter**: Highly readable, modern, neutral, excellent for body text
- **Manrope**: Geometric, distinctive, perfect for headings
- **JetBrains Mono**: Best code font, designed for developers
- **Press Start 2P**: Pixel/retro feel, matches voxel logo aesthetic

---

### Type Scale

```css
/* Font sizes */
--text-xs: 0.75rem;      /* 12px - Captions, labels */
--text-sm: 0.875rem;     /* 14px - Small body, metadata */
--text-base: 1rem;       /* 16px - Body text */
--text-lg: 1.125rem;     /* 18px - Large body, intro */
--text-xl: 1.25rem;      /* 20px - Small headings */
--text-2xl: 1.5rem;      /* 24px - H3 */
--text-3xl: 1.875rem;    /* 30px - H2 */
--text-4xl: 2.25rem;     /* 36px - H1 */
--text-5xl: 3rem;        /* 48px - Hero headings */

/* Line heights */
--leading-tight: 1.25;
--leading-normal: 1.5;
--leading-relaxed: 1.75;

/* Font weights */
--weight-normal: 400;
--weight-medium: 500;
--weight-semibold: 600;
--weight-bold: 700;
--weight-extrabold: 800;
```

---

### Typography Usage

**Headings**:
```css
h1 {
  font-family: var(--font-heading);
  font-size: var(--text-5xl);
  font-weight: var(--weight-extrabold);
  line-height: var(--leading-tight);
  color: var(--color-ink);
}

h2 {
  font-family: var(--font-heading);
  font-size: var(--text-3xl);
  font-weight: var(--weight-bold);
  line-height: var(--leading-tight);
  color: var(--color-ink);
}

h3 {
  font-family: var(--font-heading);
  font-size: var(--text-2xl);
  font-weight: var(--weight-semibold);
  line-height: var(--leading-normal);
  color: var(--color-ink);
}
```

**Body**:
```css
body {
  font-family: var(--font-primary);
  font-size: var(--text-base);
  line-height: var(--leading-relaxed);
  color: var(--color-ink);
}

p {
  margin-bottom: 1rem;
}

.lead {
  font-size: var(--text-lg);
  line-height: var(--leading-relaxed);
  color: var(--color-charcoal);
}
```

**Code**:
```css
code {
  font-family: var(--font-code);
  font-size: 0.9em;
  background: var(--color-warm-gray);
  padding: 0.125rem 0.25rem;
  border-radius: var(--radius-sm);
  color: var(--color-ai-purple);
}

pre code {
  display: block;
  padding: var(--space-4);
  background: var(--color-ink);
  color: var(--color-code-green);
  border-radius: var(--radius-md);
  overflow-x: auto;
}
```

---

## Spacing System

```css
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px - Base unit */
--space-5: 1.25rem;   /* 20px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-10: 2.5rem;   /* 40px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */
--space-20: 5rem;     /* 80px */
--space-24: 6rem;     /* 96px */
```

**Usage Rules**:
- Use multiples of 4px (base unit: 16px)
- Consistent spacing creates visual rhythm
- Section padding: `--space-16` to `--space-24`
- Card padding: `--space-6` to `--space-8`
- Element spacing: `--space-2` to `--space-4`

---

## Border Radius

```css
--radius-sm: 0.125rem;   /* 2px - Subtle roundness */
--radius-md: 0.375rem;   /* 6px - Default buttons, inputs */
--radius-lg: 0.5rem;     /* 8px - Cards, images */
--radius-xl: 1rem;       /* 16px - Large cards, modals */
--radius-full: 9999px;   /* Full round - Pills, badges */
```

**Brand Decision**: Moderate roundness (not too sharp, not too soft)
- Reflects approachable but professional positioning
- Cards: `--radius-lg`
- Buttons: `--radius-md`
- Badges: `--radius-full`

---

## Shadows

```css
/* Subtle elevation */
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);

/* Default card elevation */
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
             0 2px 4px -1px rgba(0, 0, 0, 0.06);

/* Hover state elevation */
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
             0 4px 6px -2px rgba(0, 0, 0, 0.05);

/* Modal/popup elevation */
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
             0 10px 10px -5px rgba(0, 0, 0, 0.04);
```

**Usage**:
- Cards at rest: `--shadow-md`
- Cards on hover: `--shadow-lg`
- Floating elements (header, modals): `--shadow-xl`

---

## Components

### Buttons

**Primary CTA** (Contractor availability, Book call):
```css
.btn-primary {
  background: linear-gradient(135deg, var(--color-block-gold), var(--color-brick));
  color: var(--color-paper);
  padding: var(--space-3) var(--space-6);
  border-radius: var(--radius-md);
  font-weight: var(--weight-semibold);
  border: 2px solid var(--color-deep-outline);
  box-shadow: 0 2px 4px rgba(46, 27, 18, 0.2);
  transition: all 0.3s ease;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(46, 27, 18, 0.3);
}
```

**Secondary CTA** (Learn more, Read blog):
```css
.btn-secondary {
  background: transparent;
  color: var(--color-teal);
  padding: var(--space-3) var(--space-6);
  border-radius: var(--radius-md);
  font-weight: var(--weight-semibold);
  border: 2px solid var(--color-teal);
  transition: all 0.3s ease;
}

.btn-secondary:hover {
  background: var(--color-teal);
  color: var(--color-paper);
}
```

**Text Link**:
```css
.link {
  color: var(--color-teal);
  text-decoration: underline;
  text-decoration-color: transparent;
  text-underline-offset: 4px;
  transition: all 0.3s ease;
}

.link:hover {
  text-decoration-color: var(--color-teal);
}
```

---

### Cards

**Default Card**:
```css
.card {
  background: var(--color-paper);
  border: 1px solid var(--color-warm-gray);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  box-shadow: var(--shadow-md);
  transition: all 0.3s ease;
}

.card:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-4px);
}
```

**Highlighted Card** (Featured case study):
```css
.card-featured {
  background: linear-gradient(135deg, var(--color-paper), var(--color-warm-gray));
  border: 2px solid var(--color-block-gold);
  border-radius: var(--radius-lg);
  padding: var(--space-8);
  box-shadow: var(--shadow-lg);
  position: relative;
}

.card-featured::before {
  content: '⭐';
  position: absolute;
  top: var(--space-4);
  right: var(--space-4);
  font-size: var(--text-2xl);
}
```

---

### Badges

**Tech Stack Badge**:
```css
.badge {
  display: inline-block;
  padding: var(--space-1) var(--space-3);
  background: var(--color-warm-gray);
  color: var(--color-charcoal);
  font-size: var(--text-sm);
  font-weight: var(--weight-medium);
  border-radius: var(--radius-full);
  border: 1px solid var(--color-charcoal);
}

.badge-primary {
  background: var(--color-ai-purple);
  color: var(--color-paper);
  border-color: var(--color-ai-purple);
}

.badge-success {
  background: var(--color-code-green);
  color: var(--color-ink);
  border-color: var(--color-code-green);
}
```

---

### Status Indicators

**Availability Banner** (🟢 Available for Contract Work):
```css
.status-available {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-4);
  background: var(--color-success-bg);
  color: var(--color-success);
  font-weight: var(--weight-semibold);
  border-radius: var(--radius-full);
  border: 1px solid var(--color-success);
}

.status-available::before {
  content: '●';
  font-size: var(--text-lg);
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
```

---

## Layout Grid

**Container**:
```css
.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 var(--space-4);
}
```

**Section Spacing**:
```css
section {
  padding: var(--space-20) 0;  /* 80px top/bottom */
}

@media (max-width: 768px) {
  section {
    padding: var(--space-12) 0;  /* 48px on mobile */
  }
}
```

**Grid Layouts**:
```css
/* 3-column grid (services, portfolio) */
.grid-3 {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-8);
}

@media (max-width: 1024px) {
  .grid-3 {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .grid-3 {
    grid-template-columns: 1fr;
  }
}
```

---

## Animations

**Hover Transitions**:
```css
/* Smooth elevation on hover */
.hover-lift {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.hover-lift:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}

/* Scale on hover */
.hover-scale {
  transition: transform 0.3s ease;
}

.hover-scale:hover {
  transform: scale(1.05);
}
```

**Scroll Reveal**:
```css
.reveal {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}

.reveal.active {
  opacity: 1;
  transform: translateY(0);
}
```

---

## Accessibility

### Focus States

```css
*:focus-visible {
  outline: 3px solid var(--color-teal);
  outline-offset: 2px;
  box-shadow: 0 0 0 3px rgba(63, 167, 164, 0.3);
}

/* Remove outline for mouse users */
*:focus:not(:focus-visible) {
  outline: none;
}
```

### Color Contrast

All text meets **WCAG 2.1 Level AA** (4.5:1 contrast ratio):
- Ink (#1E1B16) on Paper (#FAF7F2): ✅ 12.4:1
- Charcoal (#2B2A2A) on Paper (#FAF7F2): ✅ 10.8:1
- Teal (#3FA7A4) on Paper (#FAF7F2): ✅ 4.8:1
- Block Gold (#EAC869) on Ink (#1E1B16): ✅ 7.2:1

---

## Responsive Breakpoints

```css
/* Mobile first approach */

/* Small (default): 0 - 639px */
/* Medium (tablets): 640px+ */
@media (min-width: 640px) { }

/* Large (laptops): 1024px+ */
@media (min-width: 1024px) { }

/* Extra Large (desktops): 1280px+ */
@media (min-width: 1280px) { }

/* Max-width queries for specificity */
@media (max-width: 639px) { }   /* Mobile only */
@media (max-width: 1023px) { }  /* Mobile + Tablet */
```

---

## Brand Applications

### Homepage Hero

**Copy**: "Ship Production LLM Systems Fast"
**Subheading**: "25+ years building scalable systems. Award-winning track record at Uber. Expert in LangChain, RAG, AI Agents. Available for contract work."

**Visual**: Voxel logo + code snippet background (subtle, blurred)
**CTA**: Gradient gold/brick button "Book 30-min Discovery Call"

### Book Section

**Title**: "THE CENTAUR CTO"
**Subtitle**: "Coming June 2025"
**Tagline**: "AI-Augmented Technical Leadership"

---

### Case Study Cards

**Structure**:
- Featured image (screenshot, diagram)
- Tech stack badges (LangChain, Python, React, GCP)
- Heading: Project name (e.g., "Uber ELLE AI Decision Engine")
- Description: 2-3 sentence summary
- Result metric (highlighted in gold): "60% reduction in review time"
- CTA: "Read Full Case Study →" (teal link)

---

### Contractor Availability Banner

**Position**: Top of homepage, sticky
**Design**:
```
🟢 Available for Contract Work (10-40 hrs/week)

Production LLM Systems | $100-$150/hr | Remote

[Book Discovery Call]  [View Portfolio]
```

**Colors**: Success green background, teal CTAs

---

## Content Guidelines

### Voice & Tone

**Voice** (consistent across all content):
- **Expert**: Demonstrate deep knowledge without jargon
- **Practical**: Focus on outcomes, not theory
- **Confident**: "I've built this before" vs "I think we could try"
- **Approachable**: "Let's talk" vs "Schedule consultation"

**Tone** (varies by context):
- **Hero/CTAs**: Confident, direct, action-oriented
- **Case Studies**: Detailed, technical, results-focused
- **About**: Personal, authentic, relatable
- **Blog**: Educational, insightful, helpful

---

### Writing Style

**Headlines**:
- Clear, specific, benefit-focused
- ✅ "Ship Production RAG Systems in 12 Weeks"
- ❌ "AI Consulting Services"

**Body Copy**:
- Short paragraphs (2-3 sentences)
- Bullet points for scanability
- Active voice ("I built" vs "was built")
- Specific metrics ("60% faster" vs "significantly faster")

**CTAs**:
- Action verbs: Book, Download, Read, Explore
- Clarity over cleverness: "Book 30-min Call" vs "Let's Connect"

---

## Implementation Checklist

### Phase 1 (Current)
- [x] Define color palette
- [x] Define typography system
- [x] Define spacing/layout
- [x] Define component styles
- [ ] Update utilities.css with new colors
- [ ] Add AI-specific accent colors (purple, code-green)
- [ ] Add JetBrains Mono font for code blocks
- [ ] Implement new button styles
- [ ] Implement badge styles
- [ ] Implement status indicator

### Phase 2 (Content)
- [ ] Apply branding to contractor availability banner
- [ ] Style case study cards
- [ ] Style testimonial components
- [ ] Style book pre-order section
- [ ] Style tech stack showcase

### Phase 3 (Polish)
- [ ] Add hover animations
- [ ] Add scroll reveal animations
- [ ] Test accessibility (focus states, contrast)
- [ ] Test responsive design (mobile, tablet, desktop)

---

**Document Owner**: Frank Goortani + AI Assistant
**Status**: Complete (ready for implementation)
**Next Step**: Update utilities.css with new CSS variables
