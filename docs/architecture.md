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

Hero reads published slides at build time. Set both `DIRECTUS_URL` and the read-only `DIRECTUS_TOKEN` to enable CMS content. The build uses local slides when both values are empty or no slides are published and fails when only one is set or a configured read fails. The deployed site needs public HTTPS asset URLs for the Hero media folder. Run a new build to publish CMS edits.

The home page reads FAQ entries at build time from `faq_items`, ordered by `sort` and `id`. Run `npm run directus:setup:faq` before building against a new Directus environment. The command uses the same `.env` credentials as callback setup and accepts an alternative env file as its first argument. It creates **Частые вопросы**, fills an empty collection with the six local entries, and grants the site's existing reader access. Edit the questions and answers in Directus Studio, drag rows to reorder them, and rebuild to publish changes. Builds without Directus or with an empty FAQ collection use the local entries.

The home page also reads active `property_types` at build time and passes the choices to the contact form and both callback dialogs. Rebuild to publish changes to the choices. With no configured Directus or no active choices, the site offers the existing phone and messenger contacts.

The home page reads **Отзывы** from `reviews` at build time, ordered by `sort` and `id`. Run `npm run directus:setup:reviews -- --seed` before the first build against a configured Directus environment to provision the collection, grant access to the existing read token, and import the three local reviews into an empty collection. The setup uses the same `.env` credentials as FAQ setup and accepts an alternative env file. Run without `--seed` for schema and access setup alone. Edit, delete, or reorder reviews in Studio and rebuild to publish the changes. An empty collection or a build without Directus uses the local reviews, and a configured read error stops the build.

The home page reads **Стоимость работ** from `pricing_items`, ordered by `sort` and `id`. Run `npm run directus:setup:pricing -- --seed` before the first build against a configured Directus environment. This provisions the collection, grants read access to the existing site token, and imports the three local pricing cards into an empty collection. The setup uses the same `.env` credentials as FAQ setup and accepts an alternative env file. Edit prices, units, and the ordered **Список работ** in Studio, then rebuild to publish changes. An empty collection or a build without Directus uses the local cards, and a configured read or validation error stops the build. Each card requires a positive whole-ruble price, a unit, and at least one work item with a label.

The home page reads published **Проекты портфолио** from `portfolio_projects` at build time. Run `npm run directus:setup:portfolio` before building against a configured Directus environment. The command uses the same `.env` credentials as FAQ setup, accepts an alternative env file as its first argument, and provisions the collections, public photo folder, and site-reader permissions. Rerunning preserves project records and existing public file rules.

In Studio, fill in **Название** and **Описание**, add project images to **Портфолио (публичные фото)**, and write alt text in each file's **Описание**. Files in this folder can be downloaded publicly even while the project is a draft. Drag photos to reorder them. The first photo appears in the preview. Use **Текст превью** for a short detail such as the area or duration. **Характеристики** supports ordered name/value pairs and optional highlighting. Set the status to **Опубликован** and rebuild to update the site.

When no projects are published or Directus is unconfigured, portfolio uses local examples. Configured read errors or incomplete published records stop the build. Deployed pages need browser-accessible HTTPS asset URLs, as with Hero media.

The contact form POSTs to `api/callback-requests` under the site's base path. The on-demand Astro route validates the fields with Zod, checks the selected property type against current Directus data, and creates a record using the optional server-only `DIRECTUS_CALLBACK_TOKEN`. The browser receives a confirmation or error code. Collection access stays private.

Run `npm run directus:setup:section-visibility` before building with a configured CMS. The script uses the same credentials and optional env-file argument as FAQ setup. It creates the **Видимость секций** singleton, enables all sections on first setup, and grants the site's token read access. Rerunning preserves editor settings. Staff who manage visibility need read access to the singleton and update access to its toggle fields.

In Directus Studio, open **Видимость секций**, change the switches, and save. Rebuild and deploy the site to publish the changes. A disabled section is omitted from the home page and its navigation, and its content is not fetched. Use the switch to hide a section. Empty content collections show local examples in enabled sections. The contacts section, its navigation link, and the callback form are always shown. Estimate buttons link to `#contacts`. Rerun setup to hide the legacy contacts switch in Studio. With no configured Directus, all sections are enabled by default. A failed settings request stops a configured build.

Run `npm run directus:setup:advantages` before building with Directus. In Studio, open **Преимущества** to edit the heading and the four fixed cards. Each card uses one icon at all breakpoints. Use the **Преимущества — иконки** folder for public icon files. Setup uploads the initial SVGs and initializes a new singleton. Rerunning preserves editor changes. Builds without Directus and empty singletons display the local content. A cleared icon field uses the original local icon. Rebuild and deploy to publish edits.

Run `npm run directus:setup:company-details` before building with Directus. The setup accepts the same credentials and optional env-file argument as FAQ setup. It creates the **Данные компании** singleton, fills its contact fields from the current site defaults on first setup, and grants read access to the site token. Rerunning preserves edits. Administrators can edit the record in Studio. For other editors, assign **Company details editor** to their existing Studio role or user account. The public role has no access to the collection.

In Directus Studio, enter the primary phone, email, and separate Telegram and WhatsApp numbers. Use international phone numbers starting with `+`. **ИНН** and **ОГРНИП** are optional text fields. When filled in, they must contain exactly 12 and 15 digits, respectively. Studio shows which length is required if either field fails validation. The footer shows **Тестовые реквизиты** until **ФИО предпринимателя**, **ИНН**, and **ОГРНИП** are all provided. Astro reads the singleton once while generating the home page and passes ready-to-use links to its components. Save in Studio, run `npm run build` with the site’s Directus credentials, and deploy the new build to publish changes. Builds without Directus use local contact defaults. A configured build fails if the record cannot be read or contains invalid values.

### 4.1. Set up callback requests in Directus

1. Run `docker compose up -d` for the local CMS. Set `DIRECTUS_URL`, `DIRECTUS_TOKEN`, and the existing `ADMIN_EMAIL` and `ADMIN_PASSWORD` in the ignored `.env`.
2. Run `npm run directus:setup:callbacks`. The setup creates **Заявки → Заявки с сайта** and **Заявки → Типы объектов**, adds missing initial choices, configures privileges, and saves the write token to `.env`. Rerunning preserves existing choices, requests, and the service token.
3. In Directus Studio, use an administrator account or a staff policy with read access to both collections to open requests. Grant staff update access to `property_types` if they manage the choices. Deactivate a used type to hide it from the form. Existing requests retain their relation.
4. The setup accepts an alternative env file as its first argument. Use `--schema-only` to provision collections and seed records without configuring accounts or writing a token. For manual setup, give the read token `Read` access to active types and the write token `Create` access to `name`, `phone`, `property`, and `message` on `callback_requests`. Keep both collections closed to the public role.
5. When upgrading a collection that still has `consent`, run `npm run directus:setup:callbacks -- --remove-consent` as part of deploying the updated site. This drops the column and its stored values. The site checks consent when validating the form.

### 4.2. Run the website

- For development, start Astro with `npm run dev -- --background` and open the URL printed by Astro.
- For production, run `npm ci`, `npm run build`, then `npm start`. Supply Directus credentials at runtime through the process environment or an ignored `.env`. The Node adapter serves the static pages and handles the callback POST. Set the production `site` and `base` in Astro before building for a new domain or path.
- On the VPS, run the Node process under a service manager behind an HTTPS reverse proxy. Forward the original host and HTTPS protocol and limit POSTs to the callback route per client IP. For example, on nginx use a `limit_req_zone` at 5 requests per minute, a short burst, and `limit_req_status 429` for the callback location. Set `client_max_body_size 32k` on that location.
- GitHub Actions validates a CMS-free build. Host the production build on a server with Node to accept requests.

## 5. Rendering Strategy

Astro is responsible for page rendering and static site generation. React is used for interactive components that require client-side functionality.

- Prefer Astro components for static content and page composition.
- Use React components when client-side state or event handling is required.
- Use the minimum necessary Astro hydration directive.
- Prefer build-time data fetching for static website content.
- Avoid unnecessary client-side JavaScript and hydration.
