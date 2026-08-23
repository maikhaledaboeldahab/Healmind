# HealMind Unified Frontend

Integrated frontend application for the HealMind platform combining both the User Frontend and Admin Frontend.

## Included

- **User Frontend**: Complete patient/user portal (Dashboard, Doctors, Appointments, Live Chat, AI Assistant, Community, Tickets, Sessions, Profile).
- **Admin Frontend**: Full administrative dashboard (Doctor Verification, Patients, Doctor Management, Tickets, Sessions, Payments, Community Moderation, Reports, System Settings).

## Install

```bash
npm install
```

## Run Development Server

```bash
npm run dev
```

## Production Build

```bash
npm run build
```

## Backend Integration

The backend API base URL is configured in `.env.example`.
Copy `.env.example` to `.env` and configure `VITE_API_BASE_URL`:

```env
VITE_API_BASE_URL=https://api.healmind.example.com
```

- User API services are located under `src/services/`.
- Admin API services are located under `src/admin/services/`.
- JWT Token storage & Axios interceptors are set up in `src/services/api.js` (User) and `src/admin/services/apiClient.js` (Admin).
