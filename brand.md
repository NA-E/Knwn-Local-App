# Brand Guidelines - Known Local

## Overview
Known Local is an internal ops platform for a YouTube content agency. The design aesthetic is clean, warm, and utilitarian — built for a team that lives in this tool daily. It prioritises clarity and calm over flash. No gradients, no heavy shadows, no decorative UI. Warm off-white backgrounds, a near-black sidebar, and a single amber accent used sparingly.

---

## Color System

### CSS Custom Properties
All colors are defined as CSS variables. Always use the variable name — never hardcode hex values directly.

```css
/* Backgrounds */
--bg: #F7F6F1;           /* Warm off-white — page/app background */
--bg-panel: #FFFFFF;     /* Card and panel surfaces */

/* Sidebar */
--sidebar: #141412;      /* Sidebar background */
--sidebar-hover: #1E1E1B;
--sidebar-active: #262622;

/* Borders */
--border: #E6E3DC;       /* Standard borders */
--border-light: #EDEAE2; /* Subtle dividers */

/* Text */
--text-1: #1A1916;       /* Primary text */
--text-2: #78756C;       /* Secondary / muted text */
--text-3: #A8A59D;       /* Placeholder / meta text */

/* Accent */
--accent: #C8782A;       /* Warm amber — use sparingly */
--accent-bg: #FEF0DE;    /* Accent tint background */
```

### Color Usage Rules
- `--bg` is the page background — never use white for the page itself
- `--bg-panel` is for cards, modals, dropdowns, and any elevated surface
- `--accent` is reserved for links, active indicators, and sparse highlights — NOT for buttons or decorative fills
- Do not use Inter, Roboto, or Arial. Do not introduce purple gradients. Do not use colorful filled buttons.

---

## Typography

### Font Families
```css
/* UI font — load from Google Fonts */
font-family: 'Sora', sans-serif;
/* weights: 300, 400, 500, 600, 700 */

/* Monospace — for task IDs and code-like values */
font-family: 'JetBrains Mono', monospace;
```

### Type Scale & Usage

| Element | Size | Weight | Color | Notes |
|---|---|---|---|---|
| Page headings | 18–20px | 600 | `--text-1` | |
| Section headings | 14–15px | 600 | `--text-1` | |
| Body / table cells | 13–14px | 400 | `--text-1` | |
| Secondary body | 13px | 400 | `--text-2` | |
| Table headers | 10.5px | 600 | `--text-3` | uppercase, letter-spacing 0.08em |
| Section labels | 10px | 600 | `--text-3` | uppercase, letter-spacing 0.14em |
| Task IDs | 10–11px | 400 | `--text-3` | JetBrains Mono |
| Sidebar nav items | 12.5px | 400 | — | |
| Sidebar section labels | 9.5px | 600 | — | uppercase |
| Meta / placeholder text | 12px | 400 | `--text-3` | |

### Typography Rules
- Table headers: always uppercase with `letter-spacing: 0.08em`
- Section labels: always uppercase with `letter-spacing: 0.14em`
- Task/project IDs: always JetBrains Mono at 10–11px
- Never use font weights below 300 or above 700
- Do not mix typefaces within a single component

---

## Spacing & Layout

### Border Radius
```css
/* Buttons */      border-radius: 6px;
/* Cards */        border-radius: 8px;
/* Panels */       border-radius: 10px;
/* Badges */       border-radius: 4px;
/* Full round */   border-radius: 9999px;  /* tags, status pills */
```

### Shadows
The design does not use heavy shadows. Use only subtle elevation cues.

```css
/* Card / panel shadow */
box-shadow: 0 1px 3px rgba(26, 25, 22, 0.06), 0 1px 2px rgba(26, 25, 22, 0.04);

/* Dropdown / popover */
box-shadow: 0 4px 16px rgba(26, 25, 22, 0.10);

/* Modal */
box-shadow: 0 8px 32px rgba(26, 25, 22, 0.12);
```

No `shadow-xl`, no `shadow-2xl`, no colored shadows.

---

## Status Badges

Used for client status. Text and background are always paired — do not mix across statuses.

```css
/* Active */
color: #1A6B40;
background: #D9F5E8;

/* Onboarding */
color: #78580A;
background: #FEF3D0;

/* Inactive / Disengaged */
color: #68655E;
background: #EEEBE3;
```

**Badge specs:** font-size 11px, font-weight 500, padding 2px 8px, border-radius 4px, no border.

---

## Design Status Dots

Small 7×7px filled circles shown on project cards to indicate design asset status. No text label.

```css
/* Not started */  background: #D2CFC6;
/* In progress */  background: #C8782A;  /* accent color */
/* Completed */    background: #1A6B40;
```

Usage: `width: 7px; height: 7px; border-radius: 50%;`

---

## Buttons

Two button variants only. Do not introduce new button styles.

### btn-dark (primary actions)
```css
background: var(--text-1);   /* #1A1916 */
color: #FFFFFF;
border: none;
border-radius: 6px;
padding: 7px 14px;
font-size: 13px;
font-weight: 500;
cursor: pointer;
transition: opacity 0.15s;
```
Hover: `opacity: 0.85`

### btn-ghost (secondary actions)
```css
background: transparent;
color: var(--text-1);
border: 1px solid var(--border);
border-radius: 6px;
padding: 7px 14px;
font-size: 13px;
font-weight: 500;
cursor: pointer;
transition: background 0.15s;
```
Hover: `background: var(--bg)`

### Button Rules
- Never use `--accent` as a button background
- Never use gradient fills on buttons
- Icon-only buttons: `padding: 6px`, same border radius rules apply

---

## Sidebar

```css
/* Container */
background: var(--sidebar);          /* #141412 */
width: 220px;
height: 100vh;
position: fixed;

/* Nav item — default */
color: rgba(255, 255, 255, 0.55);
font-size: 12.5px;
padding: 7px 12px;
border-radius: 6px;
transition: background 0.15s, color 0.15s;

/* Nav item — hover */
background: var(--sidebar-hover);    /* #1E1E1B */
color: rgba(255, 255, 255, 0.85);

/* Nav item — active */
background: var(--sidebar-active);   /* #262622 */
color: #FFFFFF;

/* Section label */
font-size: 9.5px;
font-weight: 600;
text-transform: uppercase;
letter-spacing: 0.12em;
color: rgba(255, 255, 255, 0.30);
padding: 0 12px;
margin: 16px 0 6px;
```

---

## Tables

Tables are a primary UI pattern. Follow this spec precisely.

```css
/* Table wrapper */
background: var(--bg-panel);
border: 1px solid var(--border);
border-radius: 10px;
overflow: hidden;

/* Header row */
background: var(--bg);
border-bottom: 1px solid var(--border);

/* Header cell */
font-size: 10.5px;
font-weight: 600;
text-transform: uppercase;
letter-spacing: 0.08em;
color: var(--text-3);
padding: 10px 16px;
white-space: nowrap;

/* Body row */
border-bottom: 1px solid var(--border-light);
transition: background 0.1s;

/* Body row — hover */
background: #FAFAF7;

/* Body row — last child */
border-bottom: none;

/* Body cell */
font-size: 13px;
color: var(--text-1);
padding: 12px 16px;
vertical-align: middle;
```

---

## Cards & Panels

```css
/* Standard card */
background: var(--bg-panel);
border: 1px solid var(--border);
border-radius: 8px;
padding: 20px;

/* Panel (larger container, e.g. sidebar section, modal) */
background: var(--bg-panel);
border: 1px solid var(--border);
border-radius: 10px;
padding: 24px;
```

Cards do not have hover lift effects. Cards are static containers. Interactive items inside cards may have hover states.

---

## Kanban Columns

Used for the production pipeline boards.

```css
/* Column wrapper */
background: var(--bg);
border: 1px solid var(--border);
border-radius: 8px;
padding: 12px;
min-width: 260px;

/* Column header */
font-size: 11px;
font-weight: 600;
text-transform: uppercase;
letter-spacing: 0.10em;
color: var(--text-2);
margin-bottom: 10px;

/* Project card within column */
background: var(--bg-panel);
border: 1px solid var(--border);
border-radius: 8px;
padding: 12px 14px;
margin-bottom: 8px;
cursor: pointer;
transition: border-color 0.15s, box-shadow 0.15s;

/* Project card — hover */
border-color: var(--accent);
box-shadow: 0 2px 8px rgba(200, 120, 42, 0.10);
```

---

## Modals

```css
/* Overlay */
position: fixed;
inset: 0;
background: rgba(26, 25, 22, 0.55);
z-index: 50;
display: flex;
align-items: center;
justify-content: center;

/* Modal card */
background: var(--bg-panel);
border: 1px solid var(--border);
border-radius: 10px;
padding: 28px;
width: 100%;
max-width: 520px;
box-shadow: 0 8px 32px rgba(26, 25, 22, 0.12);

/* Modal header */
font-size: 16px;
font-weight: 600;
color: var(--text-1);
margin-bottom: 20px;
padding-bottom: 16px;
border-bottom: 1px solid var(--border);

/* Modal footer */
display: flex;
justify-content: flex-end;
gap: 8px;
margin-top: 24px;
padding-top: 16px;
border-top: 1px solid var(--border);
```

---

## Form Fields

```css
/* Input / Select / Textarea */
width: 100%;
padding: 8px 12px;
font-family: 'Sora', sans-serif;
font-size: 13px;
color: var(--text-1);
background: var(--bg-panel);
border: 1px solid var(--border);
border-radius: 6px;
outline: none;
transition: border-color 0.15s;

/* Focus */
border-color: var(--accent);
box-shadow: 0 0 0 3px rgba(200, 120, 42, 0.12);

/* Placeholder */
color: var(--text-3);

/* Label */
font-size: 12px;
font-weight: 500;
color: var(--text-2);
margin-bottom: 6px;
display: block;
```

---

## Icons

Use Lucide React as the primary icon library. It ships with shadcn/ui.

- Standard size: `16×16` or `18×18`
- Sidebar icons: `16×16`
- Inline / table icons: `14×14`
- Stroke width: `1.5` (default Lucide)
- Color: inherit from text, use `currentColor`
- Never fill icons unless the design explicitly calls for it

---

## What NOT to Do

- No Inter, Roboto, or Arial — use Sora for UI text
- No purple, blue, or green gradients anywhere in the app
- No heavy drop shadows (`shadow-xl`, `shadow-2xl`)
- No colorful filled buttons — `--accent` is for links and highlights only
- No glassmorphism or `backdrop-filter: blur` effects
- No card hover lift animations (`translateY`)
- No border-radius above 10px on app surfaces (badges/pills excepted)
- No animations beyond simple `transition` (no spring physics, no keyframe flourishes)
- Do not use `--accent-bg` as a general surface color — it is only for tinted highlight areas

---

## Design Philosophy

The app is a daily work tool. Team members spend hours in it. The goal is zero visual fatigue: warm neutrals that don't strain the eyes, enough contrast to scan quickly, and no decorative UI that competes with content. Every design decision should pass the test: "does this make the data easier to read, or is it just decoration?"

---

**Version:** 1.0
**Last Updated:** 2026-04-02
