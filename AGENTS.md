# Project Instructions

## 1. Project Overview

A business website for a construction and renovation
company specializing in residential and commercial
renovation.

The website provides information about the company,
its services, completed projects and contact details.

## 2. Tech Stack

- Astro — main framework and static site generation
- React — interactive UI components
- TypeScript — type safety
- Tailwind CSS — styling
- Directus — headless CMS
- PostgreSQL — database
- Docker Compose — local CMS infrastructure

## 3. Project Structure

- `src/components/` — reusable components
- `src/layouts/` — page layouts
- `src/pages/` — website pages and routes
- `src/styles/` — global styles and design tokens
- `src/lib/` — utilities and integrations
- `public/` — static assets
- `docs/` — project documentation

## 4. Documentation

Consult the following documents when working
on related tasks:

- [Architecture](docs/architecture.md)
  — application structure and technical decisions.

- [Design System](docs/design-system.md)
  — visual rules, tokens and UI components and their description.

- [Coding Guidelines](docs/coding-guidelines.md)
  — code style and implementation rules.

## 5. General Rules

- Follow the documented project architecture.
- Reuse existing components whenever possible.
- Follow the design system.
- Avoid unnecessary dependencies.
- Do not duplicate existing functionality.
- Keep components modular and maintainable.
- Do not modify project configuration without
  a clear reason.

## 6. Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## 7. Documentation Lookup

- Use Context7 to retrieve up-to-date documentation when working
  with project technologies and libraries.
- Prefer official documentation over secondary sources.
- Do not rely on outdated API knowledge or assumptions when
  documentation is available.
- Verify library APIs, configuration options and usage patterns
  before implementing them.
- Use Context7 when you need to understand an API, library
  configuration, specific library behavior or verify whether
  an implementation approach is still актуальным.
- Do not use Context7 for every code change. Use it when
  documentation lookup is actually necessary.

## 8. Implementation Rules

### 8.1. UI Components

- Always check the existing UI Kit before implementing a new UI component.
- Reuse existing UI Kit components instead of creating duplicate implementations.
- Use shadcn/ui components for common UI patterns whenever available.
- Do not implement custom alternatives to existing shadcn/ui components.
- Do not recreate component behavior manually when an existing library already provides it.
- If a required component is missing, check the official shadcn/ui documentation before implementing it from scratch.
- Keep reusable UI components in the UI Kit rather than duplicating them across pages or layouts.

### 8.2. Styling

- Use Tailwind CSS for all component styling.
- Use Tailwind responsive utilities for all responsive layouts and styles.
- Do not use inline styles or CSS Modules for component styling.
- Do not create separate CSS files for individual components.
- Keep global styles, design tokens and CSS variables in the designated global styles directory.
- Follow the existing design tokens and avoid hardcoding values when corresponding tokens are available.

### 8.3. Component Architecture

- Extract reusable UI elements into separate React components when they have independent responsibilities or need to be reused.
- Avoid duplicating component markup and functionality.
- Keep components focused on a single responsibility.
- Do not create unnecessary abstractions or split components without a clear reason.
- Follow the existing project structure when creating new components.

### 8.4. Design Implementation

- Treat the provided Figma design as the source of truth for visual implementation.
- Preserve the original layout, spacing, typography, colors, dimensions and responsive behavior.
- Do not introduce visual changes or alternative design decisions without a clear reason.
- Before implementing a component, inspect the existing design system and UI Kit for relevant styles and components.

### 8.5. Before Finishing

- Verify that existing UI Kit components were reused wherever applicable.
- Verify that no unnecessary custom implementations of existing library components were introduced.
- Verify that all component styling and responsive behavior use Tailwind CSS.
- Verify that the implementation follows the project documentation.

**IMPORTANT**: Always follow SOLID rules
