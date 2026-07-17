# Portfolio v3

A fast, animated developer portfolio built with React, TypeScript, and Vite — hero intro, services, project showcase, work experience timeline, education/skills, and a contact form, backed by a GraphQL API.

Use it as a template for your own portfolio, or borrow individual pieces (the particle background, GSAP scroll animations, GraphQL data layer, etc.) for another project.

## Tech stack

- **React 19** + **TypeScript** + **Vite**
- **React Router v7** for routing (`/`, `/portfolios`, `/portfolios/:id`)
- **TanStack Query (React Query)** for data fetching/caching
- **graphql-request** for talking to the backend
- **GSAP** (+ ScrollTrigger) for scroll animations
- **tsParticles** for the animated background
- **Lenis** for smooth scrolling
- **Swiper** for carousels

## Prerequisites

- Node.js 20+
- A GraphQL backend that implements the schema this app expects (see [Backend requirements](#backend-requirements) below) — this repo is the frontend only.

## Getting started

```bash
git clone <this-repo-url>
cd portfolio-v3
npm install
cp .env   # then fill in the values, see below
npm run dev
```

Other scripts:

| Command           | What it does                                   |
| ----------------- | ---------------------------------------------- |
| `npm run dev`     | Start the Vite dev server                      |
| `npm run build`   | Type-check (`tsc -b`) and build for production |
| `npm run preview` | Preview the production build locally           |
| `npm run lint`    | Run ESLint                                     |

## Environment variables

Copy `.env.example` to `.env` and set:

| Variable                  | Required | Description                                                                                                                                                               |
| ------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `VITE_GRAPHQL_URL`        | Yes      | Full URL to your GraphQL endpoint, e.g. `https://your-backend.example.com/graphql`                                                                                        |
| `VITE_FILES_PATH`         | Yes      | Base URL images/resume are served from (e.g. an R2/S3 bucket, `https://pub-xxxx.r2.dev/`). All `img`/icon fields returned by the API are relative paths appended to this. |
| `VITE_RECAPTCHA_SITE_KEY` | No       | Not wired up yet (see `src/api/homeApi.ts`) — reserved for future reCAPTCHA support on the contact form.                                                                  |

## Backend requirements

This frontend expects a GraphQL API exposing a single `homeData` query and a `sendMessage` mutation. The full shape it queries for is in [`src/graphql/queries.ts`](./src/graphql/queries.ts); the top-level fields are:

```graphql
query HomeData {
  homeData {
    introData {
      id
      img
      firstName
      lastName
      resume
      summary
    }
    serviceData {
      id
      iconLight
      iconDark
      title
      details
    }
    portfolioData {
      id
      featured
      title
      companyBuiltWith
      desc
      projectColor
      projectText
      outcome
      link
      moreInfoLink
      projectLogo
      image
      status
      skills
      carousel {
        id
        img
        desc
        title
        gridArea
      }
    }
    workExperienceData {
      id
      duration
      designation
      company
      location
      icon
      companyDescription
      whatIdid {
        title
        desc
      }
      skillsUsed
      achievement
      companySite
    }
    testimonialsData {
      id
      profile
      name
      designation
      description
    }
    educationData {
      id
      city
      duration
      academy
      degree
    }
    skillsData {
      id
      title
      level
      progress
    }
    contactData {
      id
      text
      iconLight
      iconDark
      link
    }
  }
}
```

The contact form also expects:

- `GET {API_BASE_URL}/csrf-token` — returns `{ csrfToken: string }`, used to protect the mutation below.
- `mutation sendMessage(input: ContactSubmitPayload!)` — submits the contact form (see `src/models/component-types/FormControlType.ts` for the payload shape).

`API_BASE_URL` is derived automatically in `src/api/client.ts` by stripping `/graphql` off the end of `VITE_GRAPHQL_URL`.

No backend handy? Point `VITE_GRAPHQL_URL` at any GraphQL server that satisfies this schema, or stub it with a tool like [GraphQL Faker](https://github.com/graphql-kit/graphql-faker)/[MSW](https://mswjs.io/) while you build your own.

## Making it yours

- **Hero fallback**: `src/pages/HomePage.tsx` renders the hero (name + photo) from a small hardcoded `HERO_FALLBACK` object before/independent of the API response, for performance reasons (it's the page's LCP element and shouldn't wait on a network round-trip). Update `HERO_FALLBACK` with your own name and photo path.
- **Fonts**: self-hosted under `public/assets/fonts/`, declared in `src/index.css`, preloaded in `index.html`. Swap the files and update both places if you change fonts.
- **Resume**: currently linked as `${VITE_FILES_PATH}Najam_Uddin_Resume.pdf` in `src/components/layout/Navbar/index.tsx` — update the filename.
- **Content** (services, projects, experience, education, skills, testimonials): comes entirely from your GraphQL backend via the `homeData` query — no need to touch frontend code to update it.

## Project structure
