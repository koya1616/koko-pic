# KokoPic Color Palette

This document outlines the limited color palette used in the KokoPic application. We use a total of 5 colors: white, black, and 3 additional colors.

## Color Definitions

| Color Name | Hex Code | Usage |
|------------|----------|-------|
| White | `#ffffff` | Backgrounds, cards, clean surfaces |
| Black | `#000000` | Text, icons, strong contrasts |
| Indigo | `#4f46e5` | Primary brand color, buttons, headers, active elements |
| Green | `#22c55e` | Success states, completion, positive actions |
| Orange | `#f59e0b` | In-progress states, warnings, attention-grabbing elements |

## Extended Color Variants

For better UI implementation, we also define darker variants of our main colors:

| Color Name | Hex Code | Usage |
|------------|----------|-------|
| Indigo 600 | `#4338ca` | Hover states for indigo elements |
| Indigo 700 | `#3730a3` | Active/focus states for indigo elements |
| Green 600 | `#16a34a` | Hover states for green elements |
| Orange 600 | `#d97706` | Hover states for orange elements |
| Gray 50 | `#f8fafc` | Light backgrounds |
| Gray 700 | `#334155` | Secondary text |
| Gray 900 | `#0f172a` | Primary text (dark) |

## Usage Guidelines

### Primary Colors
- **White**: Use for backgrounds, cards, and clean surfaces. Provides contrast and readability.
- **Black/Gray 900**: Use for primary text and important information that needs to stand out.
- **Indigo**: Use for primary actions, headers, navigation elements, and anything that needs to represent the brand.
- **Green**: Use for success messages, completed tasks, positive feedback, and confirmation actions.
- **Orange**: Use for in-progress states, warnings, attention-grabbing elements, and intermediate statuses.

### Application Examples
- **Headers and Branding**: Use indigo for primary branding elements
- **Buttons**: 
  - Primary actions: indigo with white text
  - Success/completion: green with white text
- **Status Indicators**:
  - Open/inactive: indigo
  - In-progress: orange
  - Completed: green
- **Backgrounds**: Use white for main content areas, light gray for subtle sections
- **Text**: Use black or gray 900 for primary text, gray 700 for secondary text

### Accessibility
All color combinations in this palette meet WCAG AA accessibility standards for contrast ratios. When combining colors, ensure sufficient contrast between background and text elements.

### CSS Variables
The following CSS variables are defined in `src/App.css` for consistent usage:

```css
:root {
	--color-white: #ffffff;
	--color-black: #000000;
	--color-indigo-500: #4f46e5;
	--color-indigo-600: #4338ca;
	--color-indigo-700: #3730a3;
	--color-green-500: #22c55e;
	--color-green-600: #16a34a;
	--color-orange-500: #f59e0b;
	--color-orange-600: #d97706;
	--color-gray-50: #f8fafc;
	--color-gray-700: #334155;
	--color-gray-900: #0f172a;
}
```

### Tailwind Classes
The Tailwind configuration has been extended to include these colors. You can use them with standard Tailwind syntax:

- `text-indigo-500`, `bg-indigo-500`, `border-indigo-500`
- `text-green-500`, `bg-green-500`, `border-green-500`
- `text-orange-500`, `bg-orange-500`, `border-orange-500`
- `bg-gray-50`, `text-gray-700`, `text-gray-900`, etc.