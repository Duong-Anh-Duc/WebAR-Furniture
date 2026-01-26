# WebAR Furniture Frontend

Modern WebAR furniture visualization platform built with React, TypeScript, and Vite.

## Tech Stack

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **UI Library**: shadcn/ui + Tailwind CSS
- **AR Library**: Google Model Viewer
- **Icons**: lucide-react
- **QR Code**: qrcode.react
- **i18n**: react-i18next
- **State Management**: Zustand
- **Routing**: React Router
- **HTTP Client**: Axios

## Features

- ✅ 3D model upload and management
- ✅ WebAR visualization (GLB/USDZ)
- ✅ QR code generation for easy sharing
- ✅ Multi-language support (English/Vietnamese)
- ✅ Dark mode support
- ✅ Mobile-first responsive design
- ✅ Modern and clean UI/UX

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Start development server
npm run dev
```

### Build

```bash
npm run build
```

## Project Structure

```
src/
├── api/              # API clients
├── components/       # React components
│   ├── common/      # Shared components
│   ├── layout/      # Layout components
│   └── ui/          # shadcn/ui components
├── constants/        # Constants and config
├── hooks/           # Custom hooks
├── lib/             # Utility functions
├── locales/         # i18n translations
├── pages/           # Page components
├── stores/          # Zustand stores
├── types/           # TypeScript types
└── utils/           # Helper functions
```

## Routes

- `/admin/upload` - Admin upload page
- `/p/:slug` - Viewer page (public AR view)

## License

MIT
