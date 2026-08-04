# Avoid Common AI UI Slop Patterns

## 1. Badge Overload

**Problem**

- Badges appear on every card without a clear purpose.
- Every item is labeled "New", "Popular", "Featured", etc.
- Badges are used as decoration rather than information.

**Avoid**

- Use badges only when they communicate meaningful information.
- Limit to one badge per card whenever possible.
- Never use badges to fill empty space.

---

## 2. Card Everywhere

**Problem**

- Every element is wrapped inside a card.
- Cards are nested inside other cards.
- Dashboards become a collection of floating boxes.

**Avoid**

- Use whitespace to separate content.
- Prefer open layouts when borders are unnecessary.
- Use cards only to group distinct pieces of content.

---

## 3. Excessive Border Radius

**Problem**

- Everything uses large border radii.
- Buttons, inputs, badges, avatars, and cards all look overly rounded.

**Avoid**

- Keep border radius consistent.
- Limit to two radius values across the interface.
- A default radius of 8–12px is usually sufficient.

---

## 4. Shadow Addiction

**Problem**

- Every component has a shadow.
- Shadows are too large or too frequent.
- Shadows are used instead of proper layout structure.

**Avoid**

- Prefer borders before shadows.
- Use shadows only to communicate elevation.
- Limit shadows to one or two elevation levels.

---

## 5. Gradient Addiction

**Problem**

- Gradient backgrounds.
- Gradient buttons.
- Gradient cards.
- Gradient text.

**Avoid**

- Use at most one primary gradient.
- Do not apply gradients to every element.

---

## 6. Too Many Colors

**Problem**

- Every card has a different color.
- Icons use unrelated colors.
- Multiple competing accent colors.

**Avoid**

- Build primarily with neutral colors.
- Use a single accent color.
- Use color to communicate meaning, not decoration.

---

## 7. Icon Spam

**Problem**

- Every heading has an icon.
- Every button has an icon.
- Icons or emojis appear everywhere.

**Avoid**

- Use icons only when they improve recognition.
- Avoid unnecessary decorative icons.

---

## 8. Uneven Spacing

**Problem**

- Random padding.
- Inconsistent gaps.
- Inconsistent margins.

**Avoid**

- Follow a consistent spacing scale.

Example:

- 4
- 8
- 12
- 16
- 24
- 32
- 48

---

## 9. Poor Visual Hierarchy

**Problem**

- Everything is large.
- Everything is bold.
- Every element competes for attention.

**Avoid**

- Use one primary heading.
- Limit typography to three hierarchy levels.

---

## 10. Giant Hero Sections

**Problem**

- Hero sections occupy the full viewport.
- Excessive vertical padding.
- Large amounts of empty space.

**Avoid**

- Let height follow content.
- Focus on the primary call to action.

---

## 11. Floating Components

**Problem**

- Components are poorly aligned.
- Cards appear randomly placed.

**Avoid**

- Use a grid system.
- Align everything to a consistent container.

---

## 12. Inconsistent Component Sizes

**Problem**

- Buttons vary in height.
- Inputs vary in size.
- Cards have inconsistent dimensions.

**Avoid**

- Standardize component sizing.

Example:

- Buttons: 44–48px height
- Inputs: 44–48px height

---

## 13. Decoration Without Purpose

**Problem**

- Blur effects.
- Glow effects.
- Mesh gradients.
- Noise textures.
- Floating decorative blobs.

**Avoid**

- Every decorative element should improve usability or focus.

---

## 14. Border Overload

**Problem**

- Borders everywhere.
- Nested borders.
- Dividers between every element.

**Avoid**

- Prefer whitespace first.
- Use borders only when they improve clarity.

---

## 15. Ignoring UI States

**Problem**

- Only the happy path is designed.

**Missing**

- Loading
- Empty
- Error
- Success

---

## 16. Fake Complexity

**Problem**

- Fake statistics.
- Meaningless charts.
- Decorative progress bars.

**Avoid**

- Display real information.
- Remove visuals that do not add value.

---

## 17. Competing CTAs

**Problem**

- Every button appears primary.
- Multiple competing accent colors.

**Avoid**

- Use only one primary action per section.

---

## 18. Long Forms

**Problem**

- Every field is shown at once.

**Avoid**

- Group related fields.
- Use progressive disclosure.

---

## 19. Divider Overuse

**Problem**

- Dividers appear after every item.

**Avoid**

- Use spacing before dividers.
- Reserve dividers for major content groups.

---

## 20. Generic SaaS Layout

**Problem**

- Hero → Stats → Features → Pricing → FAQ.
- Every product looks the same.

**Avoid**

- Start from the user journey.
- Design around user goals, not common templates.

---

# Typography Smells

- Too many font sizes.
- Too many font weights.
- Excessive center-aligned text.
- Overly long headings.
- Tight line height.
- Paragraphs that are too wide.

---

# Layout Smells

- Missing content containers.
- No maximum content width.
- Sections placed too close together.
- Inconsistent grid usage.
- Oversized sidebars.
- Random card widths.

---

# Component Smells

- Excessive outlines.
- Overly aggressive hover effects.
- Animations everywhere.
- Inconsistent border radius.
- Mixed icon styles.
- Inconsistent component padding.

---

# UX Smells

- Missing loading states.
- Missing error states.
- Missing keyboard focus.
- Missing hover states.
- Missing disabled states.
- Missing empty states.

---

# Accessibility Smells

- Low contrast.
- Placeholder text used as labels.
- Small touch targets.
- Hidden focus indicators.
- Color used as the only indicator.
- Missing accessible labels.

---

# AI Design Rules

- Remove before adding.
- Prefer whitespace over borders.
- Prefer borders over shadows.
- Prefer a single accent color.
- Prefer a single primary CTA.
- Prefer fewer cards.
- Prefer simpler layouts.
- Prefer readable typography.
- Prefer consistency over creativity.
- Every visual element must justify its existence.
