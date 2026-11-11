# TMS Client

Angular frontend for the Training Management System (TMS). It works with the ASP.NET Core backend in [TmsApi](https://github.com/Abex04/TmsApi).

## Features

- **Authentication:** login, sign-up with a password-strength meter, and a password reset flow (demo mode)
- **Role-based access:** Student, Instructor, and Admin roles, with route guards
- **Student dashboard:** browse and search the course catalog, enroll in courses, and view your schedule
- **Instructor dashboard:** enrollment analytics, and approve or reject enrollment requests
- **Admin tools:** create Instructor and Admin accounts, and manage courses
- **Live updates:** students get an instant toast notification when an enrollment is approved or rejected (SignalR)

## Tech stack

Angular 21 (standalone components and signals), NgRx SignalStore, Tailwind CSS 4, Angular Material, SignalR, Vitest, Playwright

## Run locally

1. Start the backend from the TmsApi repo (it listens on http://localhost:5189).
2. Install dependencies: `npm install`
3. Start the app: `npm start`
4. Open http://localhost:4200

The dev server forwards `/api` and `/hubs` requests to the backend through `proxy.conf.json`.

## Tests

- Unit tests: `npm test`
- End-to-end tests: `npx playwright test`

The end-to-end tests need the backend running and a `.env` file in the project root containing two lines, `TMS_ADMIN_EMAIL` and `TMS_ADMIN_PASS`, set to an admin account's email and password.

## Author

Abebe Mihiretu
