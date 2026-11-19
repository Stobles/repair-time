# Repair Time UI Kit inventory

[Figma UI Kit](https://www.figma.com/design/dBMwik04jLJeBySwQ3Hvp3/Untitled--1-?node-id=24-11) · [Макет](https://www.figma.com/design/dBMwik04jLJeBySwQ3Hvp3/Untitled--1-?node-id=0-1) · [Design system audit](design-system.md)

The live Figma inspection enumerated both pages and the seven top-level frames on Макет. On UI Kit, it read the component and icon boards, all 36 Button combinations, the form controls, the Badge and Tab sets, and the checked and unchecked Checkbox examples. The Desktop, Tablet, Mobile, expanded mobile menu, FAQ, measurement modal and desktop reference board on Макет are usage references.

## Tokens

| Collection | Verified source and use |
| --- | --- |
| Colors | One mode with 27 primitives and 35 semantic aliases. The [design system audit](design-system.md) lists the full names, values and alias relationships. The live read also resolved the aliases used on the component board. The Green badge uses a literal `#D1FAE5` fill and `#A7F3D0` stroke. |
| Typography | 40 local styles, no entries in the Typography variable collection. Families are Manrope, Golos Text and Inter. The audit lists the full weights, sizes, line heights and tracking. The Tab layers use Desktop/Title ExtraSmall (Manrope 700, 13/19), despite the shared style named Badge, Tab (Manrope 700, 12/16). |
| Spacing and radius | One mode. Spacing 4, 8, 12, 16, 24, 32, 48 and 64 px. Radius 0, 4, 8, 12, 16, 24 and 999 px. Component-local values below come from measured layer properties. |
| Effects and strokes | Each pressed Button has a 2 px spread, zero-offset, zero-blur shadow in its respective semantic shadow color. Other effects below are layer-local. The current inspection did not independently enumerate local paint and effect styles. No shared stroke-width scale was verified. |
| Layout | Desktop 1280/1184, Tablet 768/720 and Mobile 390/350 px, frame/content width. Exact breakpoints, intermediate sizing rules and a viewport-to-component-variant mapping are unavailable. |

## UI Kit page

| Master | Verified properties and states | Verified dimensions and styling |
| --- | --- | --- |
| Button `59:93` | Type Primary (default), Outline, Dark. Size Large (default), Medium, Small. State Default, Hovered, Active, Disabled. Both icon flags default to true and both independent instance swaps default to Arrow Right. The label is a text layer. | All types share a 6 px radius and centered auto layout. Large: 51 px, padding 16/28 px, gap 10 px, Button Large. Medium: 42 px, padding 12/24 px, gap 8 px, Button Medium. Small: 34 px, padding 8/16 px, gap 6 px, Button Small. Each sample icon instance is 12⅔ px. Width follows content. |
| Input `70:79` | Exposed Label. Default master. A separate Phone Input Focus design is on Макет `7:326`. | Caption SemiBold, text/secondary, 6 px gap, 51 px field and 75 px total. The field is white with 6 px radius, 1 px inside border/strong and 16 px padding. Placeholder uses Golos Text Regular 14 px, automatic line height and text/tertiary. |
| Dropdown `70:104` | Exposed Label and Open. Open defaults to true on the board; collapsed instances appear on Макет. | Same label, gap, 51 px trigger, radius and border as Input. Trigger value uses Body Medium and text/primary, with a 21 px chevron box. The open example is 190 px overall, including a 109 px option list, two 54 px rows and a divider. Options have 14/24 Golos Text, 16 px horizontal inset within the list’s 10 px inset. |
| Textfield `72:83` | Exposed Label, one Default variant. | Same label, 6 px gap and placeholder as Input. Base, border/strong and 6 px radius. The 96 px textarea uses 12/16 px padding and gives 120 px overall. |
| Checkbox `70:187` | Exposed Label and Checked, checked by default on the board. An unchecked instance is shown separately. | 18 px indicator, 4 px radius, border/default when unchecked, background/accent and a white check when checked. Label starts 24 px from the control’s left edge and uses Desktop/Body ExtraSmall and text/tertiary. Sample row is 33 px with two 18 px text lines, so the web row can grow. |
| Badge `76:96` | Type Dark (default), Brand, Green, Light. Decorative marks such as ✓ are part of the sample label text. | All use Badge, Tab typography, 6 px radius and 4/10 px padding. Dark (inverse/white) and Brand (accent/inverse) have no stroke and total 24 px. Green (literal fill, success text and 1 px success border) and Light (accent-subtle, accent-dark text and 1 px accent-subtle border) total 26 px. |
| Tab `77:120` | Type Active (default), Inactive. No hover, focus or disabled variants were verified. | Both are 39 px high, with 10/20 px padding, Desktop/Title ExtraSmall and content-dependent widths. Active has 10 px radius, accent fill and inverse text. Inactive has 12 px radius, base fill, secondary text and 1 px inside border/strong. |
| Icons `65:407` | Arrow Right, Calculator, Phone, Send. Other local vectors appear for checkbox, dropdown, accordion and close. | Master frames are 16 × 16, 12 × 12, 12 × 12 and 15 × 12 px respectively. The implementation uses matching symbols from Lucide, so the vector paths and strokes differ from the Figma exports. |

### Button layer bindings

| Type | Default | Hovered | Active | Disabled |
| --- | --- | --- | --- | --- |
| Primary | button/primary | button/primary-hover | button/primary-active + shadow/yellow | button/disabled |
| Outline | button/outline + border/default | button/outline-hover + border/default | button/outline-active + border/strong + shadow/light-grey | button/disabled, no stroke |
| Dark | background/inverse | button/dark-hover | button/dark-active + shadow/grey | button/disabled |

Enabled Primary labels use background/base and their icons use text/inverse (both resolve to white). Dark uses text/inverse. Outline uses text/primary. All disabled labels and icons use text/muted. The Outline stroke is a 1 px inside stroke. The UI Kit does not define a focus variant or prototype actions for the 36 Button masters.

## Reusable patterns on Макет

- FAQ `2:13` and `2:32` show an outlined 16 px-radius desktop disclosure, with a number, question, 40 px chevron control and a slot for the answer. Expanded uses a 35% accent border, two shadows and an accent chevron surface. Desktop has 28 px summary insets. Tablet and Mobile use 12 px corners, border/default, a light shadow and 12 px list gaps. Their exact inner layer styling and mapping to CSS thresholds are unavailable.
- Measurement dialog `2:1316` uses a 672 × 842 px example, 24 px radius, a 1 px border, an 8 px accent gradient, 48 px content insets, a 24 px content gap and a 40 px close control inset 20 px. Its desktop form is 574 px wide. The example backdrop includes a 60% slate overlay and a blur. Narrow dialog layouts, animation and submission states are unavailable.
- The homepage uses adjacent name and phone fields with a 16 px desktop gap and stacks them in narrower reference layouts. Category tabs scroll horizontally on Tablet and Mobile. Card layouts, headers, the consultation banner and slider controls are composed page frames without inspected reusable master APIs. The UI Kit covers the underlying controls. The asset crop, export settings and gradients for page imagery were outside the component inventory.

## Web behavior and gaps

- Buttons use browser hover, press and disabled behavior. Hover colors transition over 300 ms. Controls have visible keyboard focus. The telephone input uses the accent stroke and ring from the focused reference at the UI Kit master size. The reference’s 44 px field, leading icon and separate caption belong to that composition.
- Dropdown uses the shadcn Radix Dropdown Menu pattern with radio items and non-modal behavior, so the page remains scrollable. The list fades, scales and slides in from the trigger. A native form field supplies submission and required validation. Tabs use Radix and overflow follows available width.
- Checkbox starts unchecked for user consent. Accordion grouping is caller-controlled. Accordion expands over 200 ms using the content’s intrinsic height where supported, with a fade fallback. The shadcn Radix Dialog manages modality, focus and Escape dismissal. The desktop pattern shells use content-driven sizing. Animations respect reduced-motion settings.
- Formal validation styling, input states beyond the separate phone focus example, alternate dialog layouts, responsive variant mappings and exact icon paths remain unavailable.

## Astro usage

```astro
---
import { Button } from "@/shared/ui/button";
import { Dropdown } from "@/shared/ui/Dropdown";
import Input from "@/shared/ui/Input.astro";
import { Tabs } from "@/shared/ui/Tabs";
import { EstimateButton } from "@/widgets/EstimateButton";

const options = [
  { value: "flat", label: "Квартира или апартаменты" },
  { value: "other", label: "Другое" },
];
const categories = [
  { value: "all", label: "Все проекты", panel: "panelAll" },
  { value: "flats", label: "Квартиры", panel: "panelFlats" },
] as const;
---

<Button variant="outline" size="medium" href="/projects" leftIcon={false}>
  Смотреть проекты
</Button>

<EstimateButton client:load label="Вызвать инженера" title="Заявка на замер">
  <Input id="phone" label="Телефон" name="phone" type="tel" autocomplete="tel" required />
  <Dropdown client:load id="property" label="Тип объекта" name="property" {options} defaultValue="flat" />
</EstimateButton>

<Tabs client:load label="Категории проектов" items={categories}>
  <div slot="panelAll">Все проекты</div>
  <div slot="panelFlats">Проекты квартир</div>
</Tabs>
```

Use unique IDs for fields. Pass a stable, non-empty value for each dropdown option and tab. Hydrate `Dropdown`, `Tabs` and `EstimateButton`. Compose the shared `Dialog`, `DialogTrigger` and `DialogContent` inside the same React island. Set `leftIcon` or `rightIcon` to `false` to remove it or to an icon name to swap it. In React trees, `Button` also accepts a custom icon element and supports shadcn’s `asChild` with a React child.

The stylesheet loads all three design fonts locally through Fontsource, including Cyrillic subsets.
