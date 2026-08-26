# Kerbside

A time-limited map of kerbside hard-rubbish items. Residents post what
they're putting out for council collection, with a photo and collection
date; nearby residents claim items before the truck arrives, diverting
usable furniture, appliances and bikes from landfill.

This is the initial project scaffold. Features are added incrementally
across A1.2 and later assignment stages, on top of this same codebase.

## Tech stack

- **Vue 3** with the Composition API (`<script setup>`)
- **Vite** as the build tool
- **Vue Router** for navigation
- **Bootstrap 5** for responsive layout

## Getting started

```bash
npm install
npm run dev
```

The app runs at `http://localhost:5173` by default.

To build for production:

```bash
npm run build
```

## Project structure

```
src/
├── components/       Shared UI (NavBar)
├── router/            Vue Router routes
└── views/             Route-level pages (Home)
```
