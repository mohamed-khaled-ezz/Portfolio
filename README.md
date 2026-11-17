# Mohamed Khaled — Flutter Developer Portfolio

A responsive personal portfolio for Mohamed Khaled, a Junior Flutter Developer based in Cairo, Egypt. The site highlights his skills, experience, certificates, and selected mobile app projects in a neon graffiti-inspired visual style.

## Features

- Responsive layout with desktop and mobile navigation
- Project details dialog with configurable GitHub, demo, and screenshot links
- Contact form that opens a prefilled message in the visitor's email app
- Animated page transitions and scroll effects, with reduced-motion support
- Works without a build step or package installation

## Tech Stack

- HTML, CSS, and vanilla JavaScript
- GSAP and ScrollTrigger for optional animations
- Google Fonts for typography

## Run Locally

You can open `index.html` directly, or serve the project locally:

```powershell
py -m http.server 8000
```

Then visit [http://localhost:8000](http://localhost:8000).

GSAP, ScrollTrigger, and Google Fonts are loaded from external CDNs, so an internet connection is needed for those assets. The portfolio remains usable if GSAP is unavailable; only its animations are skipped.

## Customize

Edit [`js/config.js`](js/config.js) to update:

- `CONTACT_EMAIL` — the email address used by the contact form
- `PROJECTS` — project descriptions, features, technologies, GitHub/demo URLs, and screenshots

Project links are configured there. To add screenshots, place the image files in the project (for example, in `assets/`) and add their relative paths to the relevant project's `screenshots` array. The project preview artwork on the page is CSS illustration, not a screenshot.

## Project Structure

```text
.
├── assets/       # Favicon and project images
├── css/
│   ├── base.css        # Design tokens, reset, loader, cursor, navigation
│   ├── components.css  # Reusable UI components
│   └── sections.css    # Portfolio section layouts and styles
├── js/
│   ├── config.js  # Editable portfolio and project data
│   ├── motion.js  # GSAP animations
│   └── ui.js      # Navigation, project dialog, links, and contact form
└── index.html
```

## Deployment

This is a static site: publish `index.html`, `assets/`, `css/`, and `js/` to any static hosting provider, such as GitHub Pages or Netlify. No build command is required.
