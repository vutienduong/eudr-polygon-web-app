# Design System Documentation: The Geo-Spatial Anchor

## 1. Overview & Creative North Star
**Creative North Star: The Sovereign Ledger**
This design system moves beyond the generic "Enterprise SaaS" template to create a high-end, editorial experience for agricultural compliance. It rejects the clutter of traditional dashboards in favor of **The Sovereign Ledger**—a visual metaphor that combines the precision of a scientific atlas with the authoritative weight of a legal ledger.

We achieve this through **Organic Brutalism**: a layout philosophy that uses rigid, data-heavy structures (the "Brutalism") softened by an earthy, forest-inspired palette and generous, intentional white space (the "Organic"). Instead of standard grids, we utilize overlapping panels and sophisticated tonal layering to make the complex EUDR data feel curated, transparent, and immutable.

---

## 2. Colors & Surface Philosophy
The palette is grounded in the deep greens of the canopy and the slate grays of industrial logistics.

### The Palette (Material Design Tokens)
- **Primary (The Forest):** `#00261b` — Used for core brand moments and authoritative actions.
- **Secondary (The Logistics):** `#515f74` — Used for supporting data and secondary interactions.
- **Surface (The Canvas):** `#f8f9ff` — A crisp, clean white-tinted base that ensures high legibility.
- **Tertiary (The Alert):** `#3a1411` — Used sparingly for critical compliance flags.

### The "No-Line" Rule
Standard UI relies on 1px borders to separate content. **In this system, 1px solid borders are strictly prohibited for sectioning.** Boundaries must be defined through:
1.  **Background Color Shifts:** Use `surface-container-low` (#eff4ff) sections sitting on a `surface` (#f8f9ff) background.
2.  **Tonal Transitions:** Define areas by shifting from `surface-container-lowest` (#ffffff) to `surface-container-highest` (#d3e4fe).

### Glass & Gradient Implementation
To elevate the "Premium Enterprise" feel, floating map controls and overlay panels must use **Glassmorphism**. 
- Apply `surface` colors at 80% opacity with a `20px` backdrop-blur. 
- **Signature CTA Texture:** For primary action buttons, use a subtle linear gradient from `primary` (#00261b) to `primary_container` (#0b3d2e) at 135 degrees. This adds "visual soul" and depth that flat color cannot replicate.

---

## 3. Typography
We utilize **Inter** across all scales to maintain a "Technocratic Editorial" aesthetic. The hierarchy is designed to make dense supply chain data readable at a glance.

- **Display (The Statement):** `display-lg` (3.5rem) and `display-md` (2.75rem). Used for high-level KPIs like "Total Hectares Validated."
- **Headline (The Section):** `headline-sm` (1.5rem) with tighter tracking (-0.02em). This creates a sophisticated, bold header for major data modules.
- **Body (The Data):** `body-md` (0.875rem) is the workhorse. It provides maximum legibility for data tables and map coordinates.
- **Label (The Metadata):** `label-sm` (0.6875rem) in All Caps with +0.05em letter spacing. Use this for status timestamps and "EUDR Compliant" tags to give them a "stamped" official look.

---

## 4. Elevation & Depth
We convey hierarchy through **Tonal Layering** rather than shadows. 

### The Layering Principle
Depth is achieved by "stacking" surface tiers. 
- **Base Level:** `surface` (#f8f9ff).
- **Secondary Level:** `surface-container-low` (#eff4ff) for sidebar navigation or filter groups.
- **Primary Content Level:** `surface-container-lowest` (#ffffff) for the main data cards. This creates a "soft lift" that feels architectural.

### Ambient Shadows & Ghost Borders
When an element must float (e.g., a map tooltip):
- **Ambient Shadow:** Use the `on-surface` color (#0b1c30) at 6% opacity with a `32px` blur and `8px` Y-offset.
- **The Ghost Border:** If accessibility requires a stroke, use `outline-variant` (#c0c8c3) at **15% opacity**. Never use 100% opaque borders.

---

## 5. Components

### The Compliance Chip
Status labels must feel like "Official Seals." 
- **Validated:** Background `primary_fixed` (#bcedd7), Text `on_primary_fixed` (#002116).
- **In Progress:** Background `secondary_container` (#d5e3fc), Text `on_secondary_container` (#57657a).
- **Critical/Non-Compliant:** Background `error_container` (#ffdad6), Text `on_error_container` (#93000a).
- *Styling:* `md` (0.375rem) roundedness; no border.

### Buttons
- **Primary:** Gradient fill (Primary to Primary-Container), `md` (0.375rem) corner radius. Use `title-sm` typography.
- **Secondary:** `surface-container-high` (#dce9ff) background. No border.

### Data Tables & Lists
- **The "No-Divider" Rule:** Forbid the use of horizontal rules (`<hr>`). Separate rows by using alternating `surface` and `surface-container-low` backgrounds, or simply generous vertical spacing (16px+ between items).
- **Alignment:** Use tabular lining figures for numbers to ensure coordinates and land area measurements align vertically for quick scanning.

### Step-by-Step Compliance Forms
Forms should not feel like "Inputs" but like "Interrogations." Use **Step-by-Step Pathing**:
- Active steps use a `primary` (#00261b) left-accent bar (4px width).
- Completed steps use a `primary_fixed` (#bcedd7) background shift to indicate success.

---

## 6. Do’s and Don’ts

### Do
- **Do** use `surface-container-highest` to highlight the most important "Action Required" data in a sea of information.
- **Do** treat maps as the "hero" element, allowing panels to overlap the map edges with glassmorphism blurs.
- **Do** use `label-sm` for technical metadata (e.g., "Lat: 45.123, Long: -12.456") to maintain a scientific, data-driven tone.

### Don't
- **Don’t** use pure black (#000000) for text; always use `on-surface` (#0b1c30) to maintain tonal harmony with the deep greens.
- **Don’t** use "Drop Shadows" on cards; use background color shifts to define depth.
- **Don’t** use high-contrast dividers; if content needs separation, use white space from the `xl` (0.75rem) scale.
- **Don’t** use fully rounded (pill) buttons for primary actions; stay with the `md` (0.375rem) or `lg` (0.5rem) scale to maintain a professional, "Enterprise" posture.