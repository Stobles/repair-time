Repair Time Design System

1. Overview
   This document captures the verified design tokens, typography, layout rules and reusable UI from the Repair Time Figma file. Measurements are in Figma pixels. The UI Kit defines reusable components; the Макет page contains Desktop, Tablet and Mobile layouts.

Sources: Figma UI Kit · Main layouts · Desktop reference board

See the [live UI Kit inventory](ui-kit-inventory.md) for the latest component layer bindings, measured states and Astro usage. That inspection adds to the original audit below.

The Figma MCP inspection was limited by the Starter-plan call quota. Values below are included only where they were verified. Not defined in Figma means the property was absent from the inspected source or could not be verified during this audit. 2. Design Principles

- Use orange as the primary brand color and primary action. Outline and Dark buttons provide secondary alternatives.
- Use Manrope for headings and titles. Body, navigation and utility text use the named styles listed in Typography.
- Use repeated cards for advantages, process steps, tariffs and reviews. Portfolio content places imagery above details on Tablet and Mobile.
- Keep contact and measurement actions accessible alongside phone and messenger contact options.

3. Colors
   3.1. Primitives
   The Primitives collection contains 27 color variables in Mode 1. Original Figma variable paths and values are preserved below.
   Figma group Variable HEX
   brand brand/orange-50 #FFF7ED
   brand brand/orange-100 #FFEDD5
   brand brand/orange-200 #FED7AA
   brand brand/orange-500 #FF5722
   brand brand/orange-600 #EA580C
   brand brand/orange-700 #C2410C
   brand brand/orange-800 #9A3412
   stone stone/600 #52525B
   stone stone/800 #27272A
   stone stone/900 #18181B
   stone stone/950 #09090B
   slate slate/50 #F8FAFC
   slate slate/100 #F1F5F9
   slate slate/200 #E2E8F0
   slate slate/400 #94A3B8
   slate slate/500 #64748B
   slate slate/700 #334155
   slate slate/900 #0F172A
   slate slate/white #FFFFFF
   functional functional/rating #F59E0B
   functional functional/success #10B981
   functional functional/telegram #229ED9
   functional functional/whatsapp #047857
   emerald emerald/50 #ECFDF5
   emerald emerald/200 #A7F3D0
   emerald emerald/800 #047857
   yellow yellow/400 #FDBA74

3.2. Semantics
The Semantic collection contains 35 variables in Mode 1. Each token aliases a primitive from Primitives.
Semantic token Primitive alias HEX Usage
text/accent brand/orange-500 #FF5722 Brand accent text
text/accent-dark brand/orange-700 #C2410C Dark accent text
text/disabled slate/200 #E2E8F0 Disabled text
text/inverse slate/white #FFFFFF Text on inverse surfaces
text/muted slate/400 #94A3B8 Muted text
text/primary stone/900 #18181B Primary text
text/secondary slate/700 #334155 Secondary text
text/success emerald/800 #047857 Success text
text/tertiary slate/500 #64748B Tertiary text
background/accent brand/orange-500 #FF5722 Accent surface
background/accent-subtle brand/orange-50 #FFF7ED Subtle accent surface
background/base slate/white #FFFFFF Base surface
background/inactive slate/100 #F1F5F9 Inactive surface
background/inverse slate/900 #0F172A Inverse surface
background/subtle slate/50 #F8FAFC Subtle surface
background/success emerald/50 #ECFDF5 Success surface
border/accent brand/orange-500 #FF5722 Accent border
border/accent-subtle brand/orange-100 #FFEDD5 Subtle accent border
border/black slate/900 #0F172A Dark border
border/default slate/200 #E2E8F0 Default border
border/strong slate/400 #94A3B8 Strong border
border/success emerald/200 #A7F3D0 Success border
button/dark slate/900 #0F172A Dark button default fill
button/dark-active slate/700 #334155 Dark button active fill
button/dark-hover stone/950 #09090B Dark button hover fill
button/disabled slate/200 #E2E8F0 Disabled button fill
button/outline slate/white #FFFFFF Outline button default fill
button/outline-active slate/200 #E2E8F0 Outline button active fill
button/outline-hover slate/50 #F8FAFC Outline button hover fill
button/primary brand/orange-500 #FF5722 Primary button default fill
button/primary-active brand/orange-800 #9A3412 Primary button active fill
button/primary-hover brand/orange-700 #C2410C Primary button hover fill
shadow/grey slate/400 #94A3B8 Grey shadow color
shadow/light-grey slate/200 #E2E8F0 Light grey shadow color
shadow/yellow yellow/400 #FDBA74 Yellow shadow color

No separate semantic theme mode or local paint styles were verified in Figma. 4. Typography
4.1. Font Families
Font family Verified usage
Manrope Headings and titles across Desktop, Tablet and Mobile; Tablet body styles; Button Medium, Button Small, Badge, Tab
Golos Text Most Desktop body styles, Desktop captions and navigation, Tablet/Caption SemiBold, Placeholder
Inter Desktop/Body ExtraSmall, Button Large

Typography is authored as local Figma text styles; the Typography variable collection has no entries. Font hosting and fallback stacks are Not defined in Figma.
4.2. Text Styles
All 40 local text styles are listed below using their original names. Original means the source text case is unchanged; Auto is Figma's automatic line-height setting. All styles have text decoration NONE.
Desktop
Figma style Family Weight Size Line height Letter spacing Text case
Desktop/H1 Manrope ExtraBold (800) 44 px 48 px -1.1 px Original
Desktop/H2 Manrope ExtraBold (800) 36 px 40 px -1 px Original
Desktop/H3 Manrope ExtraBold (800) 30 px 36 px -0.75 px Original
Desktop/H4 Manrope Bold (700) 22 px 33 px 0% Original
Desktop/Title Large Manrope Bold (700) 18 px 27 px 0% Original
Desktop/Title Medium Manrope ExtraBold (800) 16 px 24 px 0% Original
Desktop/Title Small Manrope Bold (700) 14 px 21 px 0% Original
Desktop/Title ExtraSmall Manrope Bold (700) 13 px 19 px 0% Original
Desktop/Body Large Golos Text Regular (400) 16 px 26 px 0% Original
Desktop/Body Regular Golos Text Regular (400) 15 px 24 px 0% Original
Desktop/Body Medium Golos Text Regular (400) 14 px 21 px 0% Original
Desktop/Body Small Bold Golos Text Bold (700) 13 px 18 px 0% Original
Desktop/Body Small Golos Text Regular (400) 13 px 21 px 0% Original
Desktop/Body ExtraSmall Inter Regular (400) 12 px 18 px 0% Original
Desktop/Caption ExtraBold Golos Text ExtraBold (800) 12 px 18 px 0% Original
Desktop/Caption SemiBold Golos Text SemiBold (600) 12 px 18 px 0% Original
Desktop/Caption Medium Golos Text Medium (500) 12 px 18 px 0% Original
Desktop/Navigation Golos Text SemiBold (600) 13 px 19.5 px 0% Original

Tablet
Figma style Family Weight Size Line height Letter spacing Text case
Tablet/H1 Manrope ExtraBold (800) 30 px 37 px -0.75 px Original
Tablet/H2 Manrope ExtraBold (800) 24 px 32 px 0 px Original
Tablet/H3 Manrope ExtraBold (800) 20 px 28 px 0 px Original
Tablet/H4 Manrope ExtraBold (800) 18 px 24 px 0 px Original
Tablet/Title Large Manrope ExtraBold (800) 16 px 20 px 0 px Original
Tablet/Title Medium Manrope Bold (700) 14 px 18 px 0 px Original
Tablet/Title Small Manrope Bold (700) 12 px 16 px 0 px Original
Tablet/Title ExtraSmall Manrope Bold (700) 10 px 15 px 0.6 px Title Case
Tablet/Body Large Manrope Regular (400) 14 px 22 px 0 px Original
Tablet/Body Regular Manrope Regular (400) 12 px 16 px 0 px Original
Tablet/Body Medium Manrope Regular (400) 12 px 19.5 px 0 px Original
Tablet/Body Small Manrope Regular (400) 11 px 16.5 px 0 px Original
Tablet/Caption SemiBold Golos Text SemiBold (600) 10 px 15 px 0 px Uppercase

Mobile
Figma style Family Weight Size Line height Letter spacing Text case
Mobile/H1 Manrope ExtraBold (800) 28 px 36 px -0.7 px Original
Mobile/H2 Manrope Bold (700) 20 px 28 px 0 px Original
Mobile/H3 Manrope Bold (700) 18 px 26 px 0 px Original
Mobile/Title Large Manrope Bold (700) 14 px 20 px 0.35 px Title Case

Shared styles
Figma style Family Weight Size Line height Letter spacing Text case
Button Medium Manrope Bold (700) 12 px 18 px 0% Original
Badge, Tab Manrope Bold (700) 12 px 16 px 0 px Original
Button Small Manrope Bold (700) 11 px 18 px 0% Original
Button Large Inter Bold (700) 13 px 19 px 0% Original
Placeholder Golos Text Regular (400) 14 px Auto 0% Original

5. Layout
   5.1. Spacing
   The Spacing collection contains the following values in Mode 1.
   Variable Value
   4 4 px
   8 8 px
   12 12 px
   16 16 px
   24 24 px
   32 32 px
   48 48 px
   64 64 px

5.2. Containers
These values are based on the main homepage reference frames. Global CSS max-width and fluid sizing rules are Not defined in Figma.
Viewport Figma frame width Content width Horizontal padding
Desktop 1280 px 1184 px 48 px
Tablet 768 px 720 px 24 px
Mobile 390 px 350 px 20 px

5.3. Grid
The following are observed page arrangements, not shared Figma grid styles.
Section Desktop Tablet Mobile
Portfolio Visual and details side by side (7/5 column split) Visual above details Visual above details
Advantages 4 columns, 24 px gap 2 columns, 12 px gap 1 column, 12 px vertical gap
Work process 3 columns, 24 px gap 2 columns, 12 px gap 1 column, 12 px vertical gap
Tariffs 3 columns, 32 px gap 1 column, 16 px vertical gap 1 column, 16 px vertical gap
Reviews 3 columns, 24 px gap 2 columns, 12 px gap 1 column, 16 px vertical gap
Contact 2 columns, 48 px gap Form and contact cards stacked, 24 px gap Form and contact strip stacked, 16 px gap

Shared grid styles and settings beyond these observed arrangements are Not defined in Figma.
5.4. Breakpoints
The inspected homepage frames are Desktop 1280 px, Tablet 768 px and Mobile 390 px. These are reference canvas widths, not verified CSS breakpoint thresholds. Minimum/maximum media-query values and intermediate responsive rules are Not defined in Figma.
5.5. Radius
The Radius collection contains the following values in Mode 1.
Variable Value
none 0 px
sm 4 px
md 8 px
lg 12 px
xl 16 px
2xl 24 px
full 999 px

Some component geometry differs from the shared scale; for example, the Outline button radius is 6 px.
5.6. Shadows & Borders

- Shadows: semantic shadow color aliases are listed in Semantics. No local effect styles or verified shadow geometry (type, offset, blur, spread, opacity) were available in this audit.
- Borders: semantic border colors are listed in Semantics. The enabled Outline button uses a solid 1 px inside stroke. A shared stroke-width scale was not verified.

6. Components
   The UI Kit contains component sets Button, Textfield, Badge and Tab, plus standalone Input, Dropdown and Checkbox components. The page layouts also contain composed patterns such as cards, FAQ accordion, navigation and a measurement-request modal. UI Kit components
   6.1. Buttons
   Button is the reusable action component. The set contains 36 variants across Type, Size and State.
   Property Type Options Default
   Type Variant Primary, Outline, Dark Primary
   Size Variant Large, Medium, Small Large
   State Variant Default, Hovered, Active, Disabled Default
   Has Left Icon Boolean true, false true
   Has Right Icon Boolean true, false true
   Left Icon Instance swap Icon master Icons/Arrow Right
   Right Icon Instance swap Icon master Icons/Arrow Right

Size Height Label style Outline padding (vertical / horizontal) Gap Outline radius
Large 51 px Button Large 16 / 28 px 10 px 6 px
Medium 42 px Button Medium 12 / 24 px 8 px 6 px
Small 34 px Button Small 8 / 16 px 6 px 6 px

The dimensions above are from the UI Kit; padding, gap and radius were verified for Outline. The label is a text layer, not an exposed component property. A Focus variant and exposed label property are Not defined in Figma.
Type Default fill Hovered fill Active fill Disabled fill
Primary button/primary button/primary-hover button/primary-active button/disabled
Outline button/outline button/outline-hover button/outline-active button/disabled
Dark button/dark button/dark-hover button/dark-active button/disabled

Outline uses text/primary and border/default in Default and Hovered, border/strong in Active, and text/muted with no stroke in Disabled. Refer to Semantics for token values. Primary and Dark token names are listed above, but their individual layer bindings were not fully verified.

Responsive examples: Desktop buttons use 51, 42 and 34 px heights; the Tablet hero CTA is 48 px high; the Mobile expanded-menu CTA is 48 px high and spans the content width. A formal viewport-to-button-size mapping is Not defined in Figma.
6.2. Form Controls
Component Purpose Verified size / appearance Variants and states
Input Single-line text or phone entry UI Kit master: 75 px high Default and a separate Phone Input Focus example. Master state variants are Not defined in Figma.
Dropdown Single-choice selection UI Kit master: 190 px; homepage instance: 75 px Select example is shown; named open/selected variants are Not defined in Figma.
Textfield Multiline project details 120 px high Property 1=Default only; other states are Not defined in Figma.
Checkbox Legal agreement 33 px high including accompanying text Standalone master and canvas instance; named selection/state variants are Not defined in Figma.

Tablet and Mobile forms stack their fields. The Desktop form places two Input fields side by side with a 16 px gap. Hovered, Active, Disabled, validation states and full exposed property definitions were not verified.
6.3. Badges & Tabs
Component Variants / properties Size States and responsive behavior
Badge Type: Dark, Brand, Green, Light Dark/Brand: 24 px high; Green/Light: 26 px high Property defaults, state variants and responsive mapping are Not defined in Figma. Used for promotions, features and status.
Tab Type: Active, Inactive 39 px high Active/Inactive indicate selection. Hovered, pressed, Focus and Disabled states are Not defined in Figma. Tablet and Mobile category rows are described as horizontally scrollable.

The shared text style Badge, Tab is documented in Shared text styles.
6.4. Cards
The following card patterns appear in the reference board and homepage layouts. They are composed frames; reusable component properties and interaction states were not verified.
Pattern Purpose Responsive arrangement
Tariff Compare packages, prices, inclusions and CTA Three plans on Desktop; adapted stacked layout on Tablet and Mobile
Feature / Process Present benefits and numbered project stages 4/3 columns depending on section on Desktop; fewer columns on Tablet; stacked on Mobile
Review Present customer feedback Review card example shown in the UI reference board
Portfolio Project image, details and actions Side-by-side on Desktop; visual above details on Tablet and Mobile
Engineer Portrait, company details, credentials and trust markers Two-column Desktop section; more compact stacked layouts on Tablet and Mobile
Contact Lead form and direct contact details Two columns on Desktop; stacked on Tablet and Mobile

See Grid for the verified column counts and gaps.
6.5. Accordion
The FAQ accordion consists of a question, number, chevron and expandable answer area. Expanded and collapsed examples are present; the first item is shown expanded in the inspected layouts.
Viewport / reference Width Expanded item height Collapsed item height Item gap
Desktop standalone FAQ 1040 px 273 px 98 px 16 px
Tablet homepage 720 px 187 px 58 px 12 px
Mobile homepage 350 px 277 px 73 px 12 px

Formal component properties, simultaneous-open behavior, transition timing and Hovered, pressed, Focus or Disabled styles are Not defined in Figma.
6.6. Navigation

- Header: Desktop uses a horizontal header; Tablet includes quick actions and a menu control; Mobile uses a compact header with a separately designed expanded-menu frame.
- Category tabs: Desktop displays a row; Tablet and Mobile rows are described as horizontally scrollable. Overflow and keyboard behavior are Not defined in Figma.
- Consultation banner: Desktop and Tablet examples show contact actions alongside the FAQ. A Mobile variant and reusable component properties are Not defined in Figma.
- Slider controls: Hero and portfolio layouts show slider/gallery controls. Reusable variants, state styling and interaction timing are Not defined in Figma.
  6.7. Modals & Dialogs
  The Figma file contains a Desktop measurement-request modal example.
  Property Verified value
  Modal container 672 × 842 px
  Accent top bar 8 px high
  Horizontal content inset 48 px
  Form body width 574 px
  Name / phone fields 279 px each, 16 px gap
  Close control 40 × 40 px

The form stacks the property selector, message area, submit action and privacy note below the name/phone row. Tablet and Mobile modal layouts, closed/submission states, reusable properties, dismissal behavior and focus handling are Not defined in Figma. 7. Icons & Imagery
Icons
The Icons frame contains four reusable icon components.
Icon Dimensions Usage
Icons/Arrow Right 16 × 16 px Default button icon
Icons/Calculator 12 × 12 px Calculation action
Icons/Phone 12 × 12 px Phone contact action
Icons/Send 15 × 12 px Send action

Local vectors are also used for chevrons, menu and close controls, and messenger marks. A shared icon style, stroke specification, source library and responsive icon sizing are Not defined in Figma.
Imagery

- Hero and portfolio areas use project photography with overlay content. Desktop and Mobile hero examples include a Gradient layer; the Tablet example includes Overlay+OverlayBlur.
- Portfolio imagery sits beside project details on Desktop and above the details on Tablet and Mobile.
- Company sections use portrait imagery.
  Image source library, export rules, crop settings, gradient stops and blur values are Not defined in Figma.

8. Implementation Guidelines
   Tailwind CSS
   The project uses Tailwind CSS 4 through @tailwindcss/vite, with its stylesheet entry at src/styles/global.css. Keep primitive HEX values and semantic CSS aliases together, then expose the required aliases to Tailwind through @theme inline. Use the values in this document as the source for color, spacing, radius and typography tokens. Do not invent breakpoint thresholds; confirm them before implementing responsive utility breakpoints.
   React and Astro
   Keep the existing Astro-first architecture: use Astro for page structure and static content, and React for reusable interactive controls that need client-side state or event handling. Hydrate React components with an appropriate Astro client:\* directive. Preserve accessible names, keyboard interaction and visible focus states.
   shadcn/ui
   Project guidelines prefer shadcn/ui foundations where available, but the repository inspected for this audit has no shadcn/ui setup or generated primitives. When using shadcn/ui for controls such as dialogs, selects or accordions, preserve its accessibility behavior and map component variants to the verified Figma semantic tokens. Do not introduce a separate styling system or invent visual states that are not supported by the design.
   Verification Gaps
   The Figma MCP Starter-plan quota prevented some detailed property reads. The following details remain unverified and should be checked in Figma before implementation where needed:

- Full layer-level fills, strokes and effects, especially for Primary/Dark buttons, form controls, badges, tabs, cards, navigation, accordion and modal.
- Complete exposed properties for form controls, Badge, Tab and icon components.
- Shared layout-grid definitions, fluid sizing rules and exact responsive breakpoint thresholds.
- Formal interaction states and responsive variants where only composed page examples were available.
- Image crop/export settings, gradient stops, overlay blur values and icon stroke specifications.
