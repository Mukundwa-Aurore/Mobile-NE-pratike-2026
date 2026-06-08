---
name: Kigali Tech Lexicon
colors:
  surface: '#f9f9ff'
  surface-dim: '#cfdaf2'
  surface-bright: '#f9f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f0f3ff'
  surface-container: '#e7eeff'
  surface-container-high: '#dee8ff'
  surface-container-highest: '#d8e3fb'
  on-surface: '#111c2d'
  on-surface-variant: '#42474f'
  inverse-surface: '#263143'
  inverse-on-surface: '#ecf1ff'
  outline: '#727780'
  outline-variant: '#c2c7d1'
  surface-tint: '#2d6197'
  primary: '#00355f'
  on-primary: '#ffffff'
  primary-container: '#0f4c81'
  on-primary-container: '#8ebdf9'
  inverse-primary: '#a0c9ff'
  secondary: '#006b5f'
  on-secondary: '#ffffff'
  secondary-container: '#62fae3'
  on-secondary-container: '#007165'
  tertiary: '#313436'
  on-tertiary: '#ffffff'
  tertiary-container: '#474b4d'
  on-tertiary-container: '#b8bbbc'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d2e4ff'
  primary-fixed-dim: '#a0c9ff'
  on-primary-fixed: '#001c37'
  on-primary-fixed-variant: '#07497d'
  secondary-fixed: '#62fae3'
  secondary-fixed-dim: '#3cddc7'
  on-secondary-fixed: '#00201c'
  on-secondary-fixed-variant: '#005047'
  tertiary-fixed: '#e0e3e5'
  tertiary-fixed-dim: '#c4c7c9'
  on-tertiary-fixed: '#191c1e'
  on-tertiary-fixed-variant: '#444749'
  background: '#f9f9ff'
  on-background: '#111c2d'
  surface-variant: '#d8e3fb'
typography:
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
  phonetic-display:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 24px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  margin-page: 20px
  gutter-card: 16px
  padding-search: 12px 16px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 24px
---

## Brand & Style
The design system is built for a modern dictionary application that balances authoritative linguistic data with a vibrant, tech-forward energy. The brand personality is "The Professional Companion"—reliable and precise, yet pulsing with a contemporary "Kigali Tech" aesthetic that feels fresh and innovative.

The visual style leverages **Corporate Modernism** infused with **Glassmorphism** and high-vibrancy accents. It prioritizes clarity and speed, ensuring the user feels empowered rather than overwhelmed. Whitespace is used strategically to reduce cognitive load during intensive research, while energetic teal highlights provide a sense of movement and progress. The interface aims for a "native-plus" feel, adhering to platform ergonomics while maintaining a distinct, sophisticated identity.

## Colors
This design system utilizes a foundation of **Deep Sapphire Blue** (#0F4C81) to establish trust and professional authority. This is balanced by **Energetic Teal** (#2DD4BF) accents, used sparingly for interactive elements, call-to-actions, and progress indicators to inject a tech-centric vitality.

The background uses a tiered system of off-whites and cool greys to create a soft, non-fatiguing reading environment. Secondary actions and inactive states utilize muted sapphire tones, while semantic colors (error, success) are tuned to maintain the high-vibrancy profile of the palette.

## Typography
**Inter** is the core typeface for this design system, chosen for its exceptional legibility on mobile screens and its systematic, neutral character. 

The hierarchy is strictly enforced to ensure that complex dictionary entries remain scannable. **Headline-LG** is reserved for the primary word entry. **Label-SM** in uppercase is used for "Part of Speech" tags to provide immediate visual anchors. **Phonetic-display** utilizes a lighter weight and italicization to distinguish pronunciation data from definitions. Paragraph spacing is generous (1.5x font size) to prevent "wall-of-text" fatigue in long definitions.

## Layout & Spacing
The layout follows a **Fluid Grid** model optimized for handheld devices. It utilizes a base 4px unit to ensure consistent vertical rhythm. 

Standard page margins are set to 20px to provide a comfortable frame on modern smartphones. Card-based results use 16px internal padding. For information density, the "Search Results" view uses a tight vertical stack (8px) between items, while the "Definition Detail" view uses a more relaxed stack (24px) between distinct grammatical sections (e.g., Noun vs. Verb).

## Elevation & Depth
Depth is expressed through **Tonal Layers** and **Ambient Shadows**. This design system avoids harsh borders in favor of soft, diffused shadows that indicate interactivity.

1.  **Level 0 (Background):** Solid off-white (#F8FAFC).
2.  **Level 1 (Cards):** Pure white surface with a 4% opacity sapphire shadow (20px blur, 4px Y-offset).
3.  **Level 2 (Search Bar):** Subtle inner-glow or high-contrast border when active to pull it forward.
4.  **Glassmorphism:** Bottom navigation bars and top headers use a 20px backdrop blur with 85% opacity white background to maintain context of the content scrolling beneath them.

## Shapes
The shape language is **Rounded**, reflecting an approachable and "tech-native" feel. 

Standard components (Cards, Input Fields) use a 0.5rem (8px) radius. Larger container elements like bottom sheets or prominent "Word of the Day" banners use `rounded-xl` (24px) to create a distinct, modern silhouette. Buttons are consistently `rounded-lg` (16px) to provide a friendly, touch-target-friendly appearance without being fully circular.

## Components
-   **Search Bar:** A prominent, full-width input with a subtle Sapphire tint in the background. It includes a leading "Search" icon in Teal and a trailing "Microphone" icon for voice input.
-   **Word Cards:** Clean containers for search results. They feature the word in `headline-md`, followed by a Teal `label-sm` for the part of speech, and a single-line preview of the definition.
-   **Part-of-Speech Chips:** Small, low-contrast Teal background with Deep Sapphire text. Used to categorize definitions quickly.
-   **Audio Player Button:** A circular button with a Teal outline and a Sapphire "Play" icon, used next to phonetic data.
-   **Definition Lists:** Uses a custom bullet point—a small Teal square—to align with the "Kigali Tech" geometric aesthetic.
-   **Action Buttons:** Primary buttons are solid Deep Sapphire with white text. Secondary actions (e.g., "Save to Bookmarks") use a ghost style with a Teal outline.