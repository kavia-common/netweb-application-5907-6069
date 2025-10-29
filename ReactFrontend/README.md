# NetWeb React Frontend

A lightweight React SPA for managing network devices. Implements list, create, edit, and delete features with validation and an accessible, responsive UI.

## Features

- Device list with server-side sort and filter (query params)
- Create and edit forms with client-side validation (including IPv4)
- Delete with confirmation prompt
- Accessible (labels, aria-attributes) and keyboard friendly
- Light-themed, responsive UI
- Environment-based API base URL configuration
- Error handling and user-friendly messages

## Requirements

- Node.js (LTS recommended) and npm
- A running Flask backend that implements the OpenAPI endpoints:
  - GET /devices
  - POST /devices
  - GET /devices/{id}
  - PUT /devices/{id}
  - DELETE /devices/{id}

## Environment Variables

Copy `.env.example` to `.env` and set the backend base URL:

```
cp .env.example .env
```

Then edit `.env`:

```
REACT_APP_API_BASE_URL=http://localhost:5000/api
```

Note: Do not include a trailing slash.

## Getting Started

Install dependencies and start the dev server:

```
npm install
npm start
```

- App will run at http://localhost:3000
- The frontend reads `REACT_APP_API_BASE_URL` during build/startup to route API calls.

### Tests

```
npm test
```

### Build

```
npm run build
```

## Usage

- Devices page lists devices and supports filtering/sorting.
- Add Device navigates to the creation form.
- Edit opens the edit form with preloaded values.
- Delete prompts for confirmation before removing a device.

## Accessibility

- Proper labels and aria attributes
- Focusable table rows and buttons
- High-contrast colors for readability

## Notes

- The app avoids router dependency by using a minimal internal view state; it remains a single-page application.
- Ensure your backend CORS policy allows requests from http://localhost:3000 when developing locally.
