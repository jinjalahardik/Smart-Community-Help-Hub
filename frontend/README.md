# Smart Community Help Hub

A centralized community support platform connecting **Donors**, **NGOs**, **Hospitals**, **Volunteers**, and **Requesters** for food, clothes, medicine, and blood donations, plus emergency relief coordination.

This is the **frontend-only demo build**: a fully functional React application backed by a mock API layer (LocalStorage-persisted), built with the real backend integration path in mind.

---

## Features

- Six role-based portals (Admin, Donor, NGO, Volunteer, Requester, Hospital) with dedicated dashboards, navigation, and workflows
- Full donation lifecycle: create → accept → in transit → completed, across Food, Clothes, Medicine, and Blood categories with category-specific fields
- Emergency request workflow with a live-calculated **priority score** (urgency + affected people + time sensitivity)
- Volunteer task workflow: Available → Accepted → Pickup Started → Picked Up → Delivery Started → Delivered → Completed
- NGO & Hospital document verification flow with admin approve/reject + rejection reasons + status history
- Inventory management (stock, low-stock alerts, expiry alerts) for NGOs and Hospitals
- Notifications (polling-based), in-app Chat (LocalStorage-persisted), Feedback, and Reports/Analytics (Recharts)
- Light/dark theme, responsive layouts (mobile bottom nav + drawer, desktop sidebar), accessible components
- Demo authentication with seeded accounts for every role

## User Roles

| Role | Description |
|---|---|
| **Admin** | Platform oversight: user management, NGO/Hospital approvals, analytics, audit logs, broadcasts |
| **Donor** | Donate food, clothes, medicine, or blood; track donation status and impact |
| **NGO** | Accept donations, manage inventory & volunteers, assign tasks, fulfil emergency requests |
| **Volunteer** | Accept and fulfil pickup/delivery tasks, track impact hours and badges |
| **Requester** | Raise emergency requests, track assignment and delivery |
| **Hospital** | Manage blood/medicine inventory, publish requirements, coordinate donors |

## Tech Stack

React 19 • Vite • JavaScript • Tailwind CSS • React Router DOM • Redux Toolkit • TanStack React Query • React Hook Form + Zod • Axios • Framer Motion • Recharts • Lucide React • React Hot Toast • date-fns

## Installation

```bash
npm install
npm run dev
```

The app runs at `http://localhost:5173`.

## Environment Setup

Copy `.env.example` to `.env` and adjust as needed:

```bash
cp .env.example .env
```

```
VITE_API_BASE_URL=http://localhost:5000/api   # future real backend URL
VITE_USE_MOCK_API=true                        # true = use LocalStorage mock API
VITE_APP_NAME=Smart Community Help Hub
```

## Demo Accounts

All demo accounts are seeded automatically on first load. They're also shown in a collapsible panel on the Login page.

| Role | Email | Password |
|---|---|---|
| Admin | admin@helpconnect.demo | Admin@123 |
| Donor | donor@helpconnect.demo | Donor@123 |
| NGO | ngo@helpconnect.demo | Ngo@123 |
| Volunteer | volunteer@helpconnect.demo | Volunteer@123 |
| Requester | requester@helpconnect.demo | Requester@123 |
| Hospital | hospital@helpconnect.demo | Hospital@123 |

> **Note:** For this frontend demo, session tokens are stored in LocalStorage for simplicity. **Production deployments must use secure, HTTP-only cookie-based authentication** instead of client-side token storage.

## Available Scripts

```bash
npm run dev        # Start development server
npm run build      # Production build (outputs to dist/)
npm run preview    # Preview the production build locally
npm run lint        # Run oxlint
```

## Folder Structure

```
frontend/
├── src/
│   ├── assets/            # Images, illustrations, icons
│   ├── components/
│   │   ├── ui/             # Reusable primitives (Button, Card, Modal, DataTable, ...)
│   │   ├── layout/         # Sidebar, Topbar, Navbar, Footer, MobileBottomNav
│   │   ├── shared/          # Cross-feature composites (InventoryManager, OrgApprovalList, ...)
│   │   ├── charts/          # ChartCard wrapper for Recharts
│   │   └── forms/           # FileUpload and other form-only widgets
│   ├── features/           # Per-domain service layer (auth, donations, requests, ngo, hospital, ...)
│   ├── hooks/               # React Query hooks per domain
│   ├── context/             # AuthContext, ThemeContext
│   ├── store/                # Redux Toolkit store (auth, ui slices)
│   ├── services/             # storageService, mockApi, seedData, axios instance
│   ├── layouts/               # PublicLayout, AuthLayout, DashboardLayout
│   ├── pages/                 # Route-level pages, grouped by role
│   ├── routes/                # Route paths, guards (Auth/Role/Guest), nav config
│   ├── utils/                 # cn, format, priorityScore helpers
│   ├── constants/             # roles, categories, statuses
│   ├── validators/            # Zod schemas
│   └── styles/                 # Global CSS + design tokens
├── .env.example
├── tailwind.config.js
└── vite.config.js
```

## Mock Backend Explanation

This build has **no real backend**. Instead:

- `src/services/storageService.js` wraps `window.localStorage` as the "database"
- `src/services/seedData.js` generates realistic Indian mock data (users, NGOs, hospitals, donations, requests, tasks, inventory, notifications, feedback, chats, audit logs) on first load
- `src/services/mockApi.js` provides generic CRUD (`list`, `find`, `filter`, `insert`, `update`, `remove`) with a simulated network delay
- Each domain has a feature service (e.g. `donationService.js`) that calls into `mockApi`, and a matching React Query hook file that components use
- All CRUD operations persist to LocalStorage and survive a page refresh

## Future Backend Integration Guide

To connect a real backend:

1. Set `VITE_USE_MOCK_API=false` and point `VITE_API_BASE_URL` to your API
2. `src/services/api.js` already has an Axios instance configured with an auth-header interceptor — swap the interceptor to rely on secure cookies instead of LocalStorage tokens
3. Replace the internals of each feature service (e.g. `donationService.list`) with `api.get(...)` calls, keeping the same function signatures so hooks and pages require no changes
4. Replace `authService` login/register/session methods with real endpoint calls; move token handling to HTTP-only cookies set by the backend
5. Remove `ensureSeeded()` calls once real data is available

## Screenshots

_Add screenshots here after running the app locally: Landing page, Role dashboards, Donation/Request forms, Admin approval flow._

## Deployment

```bash
npm run build
```

Deploy the contents of `dist/` to any static host (Vercel, Netlify, Firebase Hosting, S3 + CloudFront, etc.). Configure the host to redirect all routes to `index.html` for client-side routing to work correctly.

## Known Limitations (Frontend Demo)

- No real-time push notifications (polling-based simulation instead)
- File uploads are UI-only (no actual file storage)
- CSV/PDF export buttons generate demo files, not full data exports
- All data resets if LocalStorage is cleared
