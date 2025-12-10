# Good Doc 2025 Typography Migration Guide

## Type Scale (Hospital-Grade 2025)

| Token | Size | Weight | Line Height | Letter Spacing | Usage |
|-------|------|--------|-------------|----------------|-------|
| Display | clamp(32px, 2.8vw, 40px) | 700 | 1.2 | 0 | Hero/landing headers only |
| H1 | clamp(24px, 1.5vw, 28px) | 700 | 1.3 | 0 | Page titles |
| H2 | clamp(20px, 1.0vw, 22px) | 600 | 1.3 | 0 | App title in top bar |
| H3 | clamp(18px, 0.8vw, 20px) | 600 | 1.35 | 0 | Section headers, card titles |
| Body | 16px | 400 | 1.5 | 0.1px | Body copy, table cells |
| Body-Strong | 16px | 600 | 1.5 | 0.1px | Emphasized text |
| Small | 14px | 400 | 1.5 | 0.1px | Compact content, table cells |
| Label | 13px | 600 | 1.4 | 0 | Button labels, table headers |
| Caption | 12px | 500 | 1.4 | 0.2px | Metadata, timestamps |

## CSS Variables

```css
:root {
  --gd-font-family: "Inter var", "SF Pro Text", "Segoe UI", "Roboto", "Arial", sans-serif;
  
  --gd-fs-display: clamp(2rem, 2.8vw, 2.5rem);
  --gd-fs-h1: clamp(1.5rem, 1.5vw, 1.75rem);
  --gd-fs-h2: clamp(1.25rem, 1.0vw, 1.375rem);
  --gd-fs-h3: clamp(1.125rem, 0.8vw, 1.25rem);
  --gd-fs-body: 1rem;
  --gd-fs-small: 0.875rem;
  --gd-fs-label: 0.8125rem;
  --gd-fs-caption: 0.75rem;
  
  --gd-lh-display: 1.2;
  --gd-lh-h1: 1.3;
  --gd-lh-h2: 1.3;
  --gd-lh-h3: 1.35;
  --gd-lh-body: 1.5;
  --gd-lh-small: 1.5;
  --gd-lh-label: 1.4;
  --gd-lh-caption: 1.4;
  
  --gd-ls-heading: 0;
  --gd-ls-body: 0.1px;
  --gd-ls-caption: 0.2px;
}
```

## Tailwind Classes

| New Class | Description | Old Classes to Replace |
|-----------|-------------|----------------------|
| `text-display` | Hero/display text | `text-4xl`, `text-3xl` |
| `text-h1` | Page titles | `text-2xl`, `text-xl font-bold` |
| `text-h2` | Section headers | `text-xl`, `text-lg font-semibold` |
| `text-h3` | Card titles | `text-lg`, `text-base font-semibold` |
| `text-body` | Body copy (16px) | `text-base` |
| `text-body-strong` | Emphasized body | `text-base font-semibold` |
| `text-small` | Compact text (14px) | `text-sm` |
| `text-label` | Labels/buttons (13px) | `text-xs font-semibold` |
| `text-caption` | Metadata (12px) | `text-xs` |

## Utility Classes

| Class | Usage |
|-------|-------|
| `.typo-display` | Full display style |
| `.typo-h1` | Full H1 style |
| `.typo-h2` | Full H2 style |
| `.typo-h3` | Full H3 style |
| `.typo-body` | Full body style |
| `.typo-body-strong` | Full body-strong style |
| `.typo-small` | Full small style |
| `.typo-label` | Full label style |
| `.typo-caption` | Full caption style |
| `.tabular-nums` | Tabular numbers for data |

## Component Mapping

### Page Titles
```tsx
// Before
<h1 className="text-lg font-semibold text-foreground">Page Title</h1>

// After
<h1 className="text-h1 text-foreground">Page Title</h1>
```

### Section Headers
```tsx
// Before
<h2 className="text-base font-medium">Section</h2>

// After
<h2 className="text-h3 text-foreground">Section</h2>
```

### Table Headers
```tsx
// Before
<th className="text-sm font-medium text-muted-foreground">Header</th>

// After
<th className="text-label text-muted-foreground">Header</th>
```

### Table Cells
```tsx
// Before (main content)
<td className="text-sm text-foreground">Content</td>

// After
<td className="text-small text-foreground">Content</td>
```

```tsx
// Before (sub-content)
<td className="text-xs text-muted-foreground">Sub-content</td>

// After
<td className="text-caption text-muted-foreground">Sub-content</td>
```

### Buttons
```tsx
// Before
<Button className="text-xs font-semibold">Action</Button>

// After
<Button className="text-label">Action</Button>
```

### Badges
```tsx
// Before
<Badge className="text-xs">Status</Badge>

// After
<Badge className="text-caption">Status</Badge>
```

### Form Labels
```tsx
// Before
<label className="text-sm font-medium">Label</label>

// After
<label className="text-label">Label</label>
```

### Input/Placeholder
```tsx
// Before
<Input className="text-sm placeholder:text-sm" />

// After
<Input className="text-small placeholder:text-small" />
```

### Metadata/Timestamps
```tsx
// Before
<span className="text-xs text-muted-foreground">Jan 15, 2025</span>

// After
<span className="text-caption text-muted-foreground">Jan 15, 2025</span>
```

## Find/Replace Map

| Find | Replace |
|------|---------|
| `text-4xl` | `text-display` |
| `text-3xl` | `text-display` |
| `text-2xl` | `text-h1` |
| `text-xl font-bold` | `text-h1` |
| `text-xl font-semibold` | `text-h2` |
| `text-xl` | `text-h2` |
| `text-lg font-semibold` | `text-h2` or `text-h3` |
| `text-lg font-medium` | `text-h3` |
| `text-lg` (headings) | `text-h3` |
| `text-base font-semibold` | `text-body-strong` |
| `text-base` | `text-body` |
| `text-sm font-semibold` | `text-label` |
| `text-sm font-medium` | `text-small font-medium` |
| `text-sm` | `text-small` |
| `text-xs font-semibold` | `text-label` |
| `text-xs font-medium` | `text-caption font-medium` |
| `text-xs` | `text-caption` |

## Accessibility Notes

- Minimum body size: 16px (1rem)
- No text below 12px (0.75rem)
- All text maintains AA contrast ratio
- Respects user zoom/scaling preferences
- Uses relative units for scalability
