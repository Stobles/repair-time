# Architecture

## 1. Overview

The project follows a lightweight layered architecture inspired by Feature-Sliced Design (FSD).

The architecture consists of four main layers:

- **Pages** — website routes and page composition.
- **Sections** — visual sections that compose pages.
- **Features** — self-contained functional blocks of the website.
- **Shared** — reusable components, utilities and resources.

The main principles are separation of concerns, clear layer boundaries, reusability and minimal unnecessary abstractions.

## 2. Project Structure

```text
src/
├── pages/
│
├── sections/
│   ├── Hero/
│   ├── Services/
│   ├── Portfolio/
│   └── ...
│
├── features/
│   ├── portfolio/
│   ├── pricing/
│   ├── contact-form/
│   └── ...
│
└── shared/
    ├── ui/
    ├── lib/
    ├── types/
    └── styles/
```

### 2.1. Pages

Responsible for website routing and page composition.

Contains:

- Astro pages corresponding to website routes.
- Composition of sections into complete pages.
- Page-specific metadata and SEO configuration.
- Page-specific data fetching when necessary.

Pages should not contain reusable sections or feature-specific implementations.

### 2.2. Sections

Responsible for composing visual sections of website pages.

Contains:

- Sections such as Hero, Services, Portfolio, Testimonials and FAQ.
- Composition of Features and Shared components.
- Section-specific layout and presentation.

Sections should be independent of specific pages. A section can receive data through props or load its content in Astro frontmatter by calling a feature API function. Feature API functions own the Directus requests and pass presentation data to UI components through props.

### 2.3. Features

Responsible for self-contained functional blocks of the website.

Examples:

- `portfolio` — project data, project cards, category filtering and related interactions.
- `pricing` — pricing plans, tariff data and related functionality.
- `contact-form` — form fields, validation, submission and feedback states.

A feature may contain:

- `api/` — feature-specific API requests.
- `components/` — feature-specific components.
- `hooks/` — feature-specific React hooks.
- `model/` — state management and business logic.
- `types/` — feature-specific TypeScript types.
- `index.ts` — public API of the feature.

Create only the directories required by the feature. Not every feature needs all of them.

Features should have a clearly defined responsibility and expose their functionality through a public API. Avoid unnecessary dependencies between features.

### 2.4. Shared

Contains reusable resources that are not tied to a specific feature, section or page.

- **`ui/`** — the project's UI Kit. Use shadcn/ui as its foundation and Tailwind CSS for styling. Contains reusable UI components, variants and visual states. Feature-specific components must not be placed here.
- **`lib/`** — shared utilities, Directus client, connection configuration and common API helpers.
- **`types/`** — TypeScript types and interfaces shared across multiple features or layers.
- **`styles/`** — global CSS, design tokens, CSS variables and base styles.

Keep feature-specific logic and types inside their respective features.

## 3. Layer Dependencies

The project follows a unidirectional dependency structure:

```text
Pages
  ↓
Sections
  ↓
Features
  ↓
Shared
```

Allowed dependencies:

| Layer    | Can depend on              |
| -------- | -------------------------- |
| Pages    | Sections, Features, Shared |
| Sections | Features, Shared           |
| Features | Shared                     |
| Shared   | External libraries only    |

Rules:

- Layers must not depend on layers below them in the dependency hierarchy.
- Access features through their public APIs, not internal files.
- Features must not depend directly on other features.
- Shared must remain independent of application-specific layers.
- Avoid circular dependencies.

## 4. Data Flow

Directus is the primary CMS and source of website content.

- Server-side application code reads environment variables from `shared/lib/env.ts`. It validates the configuration with Zod and reads Directus secrets through Astro's server-only environment API.
- The shared server-only client lives in `shared/lib/directus/Directus.ts` and uses the schema in `DirectusSchema.ts`. Feature API functions reuse this client.
- Feature-specific API requests belong in the corresponding feature's `api/` directory.
- Page-specific requests may be handled directly in Astro pages when they do not belong to a reusable feature.
- Data should be fetched on the server or at build time whenever possible.
- Transform external data before passing it to presentation components when necessary.
- Pass data through props rather than making UI components directly dependent on Directus.

Hero reads published slides at build time. Set both `DIRECTUS_URL` and the read-only `DIRECTUS_TOKEN` to enable CMS content. The build uses the local slides when both values are empty and fails when only one is set or a configured Directus request fails. The GitHub Pages build reads the URL from an Actions variable and the token from an Actions secret. It needs a reachable Directus instance and public HTTPS asset URLs for the Hero media folder. Run a new build to publish CMS edits.

## 5. Rendering Strategy

Astro is responsible for page rendering and static site generation. React is used for interactive components that require client-side functionality.

- Prefer Astro components for static content and page composition.
- Use React components when client-side state or event handling is required.
- Use the minimum necessary Astro hydration directive.
- Prefer build-time data fetching for static website content.
- Avoid unnecessary client-side JavaScript and hydration.
