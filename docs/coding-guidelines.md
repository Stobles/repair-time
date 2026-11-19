# Coding Guidelines

## 1. General Principles

- Readability and maintainability.
- Code reuse and avoiding duplication.
- Prefer simple solutions over unnecessary abstractions.
- Follow existing project conventions.

## 2. Naming & File Conventions

- **Files and folders:** Use PascalCase for file and folder names. Separate words by capitalization without spaces or separators (e.g. `UserProfile.tsx`, `ContactForm/`).
- **Components:** Use PascalCase, following the same convention as file names. Choose names that clearly describe the component's purpose (e.g. `Header`, `ServiceCard`, `ContactForm`).
- **Functions:** Use camelCase (e.g. `getUserData`, `formatPrice`).
- **Types and interfaces:** Use PascalCase, following the same naming convention as files and components (e.g. `UserProfile`, `ContactFormProps`).
- **Variables:** Use camelCase (e.g. `userData`, `isLoading`).
- **Imports:** Place all imports at the top of the file.

## 3. Astro & React

- **Astro by default:** Use Astro components for static content and page structure.
- **React when needed:** Use React components only for interactive elements that require client-side state or event handling.
- **Hydration:** Use the minimum required Astro client directive (`client:load`, `client:visible`, etc.). Avoid unnecessary client-side hydration.
- **Component composition:** Prefer small, focused, reusable components over large components with multiple responsibilities.
- **Props:** Pass data through component props instead of hardcoding values.
- **Component structure:** Keep component logic, markup and styles organized and easy to understand.
- **Server-side rendering:** Prefer server-side data fetching and rendering whenever client-side execution is not required.

## 4. TypeScript

- **Strict typing:** Keep TypeScript strict mode enabled.
- **Avoid `any`:** Do not use `any`. Prefer explicit types, `unknown` or proper type narrowing.
- **Types and interfaces:** Use PascalCase for type and interface names.
- **Type reuse:** Reuse existing types instead of defining duplicate or equivalent types.
- **Props typing:** Define explicit types for component props.
- **Type safety:** Avoid unnecessary type assertions and non-null assertions. Handle potentially undefined values explicitly.
- **Inference:** Let TypeScript infer types when the inferred type is clear. Avoid redundant type annotations.

## 5. Styling & UI Components

- **Tailwind CSS:** Use Tailwind utility classes for component styling.
- **Design tokens:** Use the project's design tokens for colors, typography, spacing and other visual properties. Avoid arbitrary values when a design token exists.
- **shadcn/ui:** Reuse and customize existing shadcn/ui components instead of creating duplicate implementations.
- **Component variants:** Use consistent component variants and props for different visual states or appearances.
- **Styling consistency:** Avoid duplicating style definitions and conflicting utility classes.
- **Responsive design:** Follow the breakpoints, container sizes and grid rules defined in `design-system.md`.
- **Global styles:** Keep global styles and shared design tokens in their designated files. Avoid unnecessary global CSS.
- **Conditional classes:** Use a consistent approach for combining conditional Tailwind classes.
- **Component Reuse:** Before creating a new UI component, check whether an existing component in `shared/ui/` already provides the required functionality. Reuse or extend existing components whenever possible. Do not create duplicate components or new variants without a clear reason.

## 7. Accessibility & Performance

- **Semantic HTML:** Use appropriate semantic HTML elements instead of generic elements when possible.
- **Accessibility:** Provide accessible labels, alternative text and appropriate ARIA attributes where needed.
- **Keyboard navigation:** Ensure interactive elements are accessible and usable with a keyboard.
- **Focus states:** Preserve visible focus indicators for interactive elements.
- **Images:** Provide appropriate image dimensions, formats and alternative text. Use optimized image assets.
- **JavaScript:** Avoid unnecessary client-side JavaScript and hydration.
- **Rendering:** Prefer static rendering and avoid unnecessary client-side rendering.
- **Dependencies:** Avoid adding dependencies when existing project functionality is sufficient.
- **Performance:** Optimize images, fonts and other assets. Avoid unnecessary resource loading.
