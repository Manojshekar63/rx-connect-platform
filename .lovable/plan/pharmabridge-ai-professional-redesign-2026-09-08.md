# PharmaBridge AI Professional Redesign

## Goal
Transform the existing interface into a presentation-ready healthcare platform using the selected **Editorial Magazine** direction: crisp clinical colors, Instrument Serif headlines, Work Sans body copy, strong hierarchy, and confident data-led storytelling.

## Visual system
- Lock the selected palette: clinical white, deep navy, medical blue, teal, and restrained orange.
- Replace the current rounded glass-heavy look with sharper editorial surfaces, fine rules, purposeful whitespace, and limited glass effects where depth is useful.
- Load Instrument Serif and Work Sans across the product, with editorial display typography reserved for major headings and clean sans-serif typography for controls and data.
- Keep light and dark modes, with a carefully matched dark editorial palette and accessible contrast.
- Standardize corners, borders, shadows, icon treatments, chart colors, and interaction states through shared design tokens.

## Public experience
- Rebuild the homepage opening to closely match the selected prototype: editorial navigation, oversized “Bridging the Supply Gap” statement, platform status, and a four-audience grid for Customers, Hospitals, Pharmaceutical Companies, and Administrators.
- Integrate the existing healthcare-network artwork as a strong visual proof point lower in the opening flow rather than returning to the old split-card composition.
- Restyle the statistics, platform capabilities, workflow, AI intelligence, supply-chain proof, analytics, testimonials, and final call to action as varied magazine-style sections rather than repeated cards.
- Redesign the footer as a concise editorial index while preserving the existing platform links and compliance information.
- Preserve all existing destinations and make the mobile version retain the same hierarchy with a compact navigation menu.

## Sign-in and registration flow
- Carry the editorial identity into Login, Register, Forgot Password, and OTP Verification.
- Refine form hierarchy, role selection, trust cues, validation-ready states, and navigation without adding real authentication behavior.
- Preserve demo dashboard access from the sign-in screen.

## Role dashboards
- Restyle the shared dashboard shell first so Customer, Hospital, Pharmaceutical, and Administrator views inherit one professional system.
- Use a restrained command-center layout: compact navigation, clear page headers, crisp metric blocks, editorial panels, legible tables, and consistent charts.
- Update shared cards, panels, status labels, empty/loading/error states, dialogs, and forms so every dashboard feels cohesive.
- Preserve current mock data, role-specific content, interactions, and page structure; this pass changes presentation only.

## Motion and responsiveness
- Use subtle staged entrances, number reveals, chart animation, section transitions, and precise hover feedback.
- Respect reduced-motion preferences and avoid continuous or distracting animation.
- Verify the homepage, public forms, and all four dashboards at desktop and mobile sizes, including menu behavior, text wrapping, tables, dialogs, and dark mode.

## Quality checks
- Confirm every existing page still loads and every current link points to a real page.
- Check for visual overlap, clipping, contrast, and inconsistent spacing across screen sizes.
- Confirm metadata remains unique and appropriate for each page.
- Verify the final preview has no build, runtime, console, or network errors.

## Technical notes
- Keep the existing React/TanStack architecture, route structure, mock-data layer, Motion animations, Lucide icons, and shared UI controls.
- Implement the locked colors and typography as semantic tokens in the global design system; no hardcoded page-level colors.
- Refactor shared presentation components where needed so the redesign remains consistent and maintainable.
