# WebAR Furniture Backend API

Backend API for WebAR Furniture Visualization platform using Node.js, Express, and echo3D.

## Tech Stack

- **Runtime**: Node.js + TypeScript
- **Framework**: Express
- **Database**: PostgreSQL + Prisma ORM
- **File Upload**: Multer
- **3D Platform**: echo3D API
- **HTTP Client**: Axios

## Features

- ✅ Upload 3D models (.glb)
- ✅ Automatic echo3D integration
- ✅ iOS USDZ conversion with polling
- ✅ Public viewer endpoints
- ✅ Admin management
- ✅ Multi-language support (EN/VI)
- ✅ Error handling & logging
- ✅ Rate limiting
- ✅ CORS enabled

## Project Structure

```
backend/
├── prisma/
│   └── schema.prisma          # Database schema
├── src/
│   ├── config/                # Configuration
│   │   ├── index.ts
│   │   └── database.ts
│   ├── controllers/           # Request handlers
│   │   └── model.controller.ts
│   ├── services/              # Business logic
│   │   ├── echo3d.service.ts
│   │   └── model.service.ts
│   ├── routes/                # API routes
│   │   ├── admin.routes.ts
│   │   ├── model.routes.ts
│   │   └── index.ts
│   ├── middleware/            # Middleware
│   │   ├── upload.middleware.ts
│   │   ├── errorHandler.middleware.ts
│   │   └── rateLimit.middleware.ts
│   ├── formatters/            # Response formatters
│   │   └── model.formatter.ts
│   ├── i18n/                  # Internationalization
│   │   ├── en.ts
│   │   ├── vi.ts
│   │   └── index.ts
│   ├── utils/                 # Utilities
│   │   ├── logger.ts
│   │   └── helpers.ts
│   ├── scripts/               # Scripts
│   │   └── migrate.ts
│   └── server.ts              # Entry point
├── .env.example               # Environment variables template
├── package.json
└── tsconfig.json
```

## Setup

### Prerequisites

- Node.js 18+
- PostgreSQL (or SQLite for development)
- echo3D account with API key

### Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Edit .env with your credentials
nano .env
```

### Environment Variables

```env
NODE_ENV=development
PORT=5000
BASE_URL=http://localhost:3000

DATABASE_URL="postgresql://user:password@localhost:5432/webar_furniture"

ECHO3D_API_KEY=your_api_key
ECHO3D_SECURITY_KEY=your_security_key
ECHO3D_API_URL=https://api.echo3d.com

MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES=.glb

USDZ_POLLING_INTERVAL=15000
USDZ_POLLING_TIMEOUT=300000

CORS_ORIGIN=http://localhost:3000
```

### Database Setup

```bash
# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# (Optional) Open Prisma Studio
npm run prisma:studio
```

## Running

### Development

```bash
npm run dev
```

### Production

```bash
# Build
npm run build

# Start
npm start
```

## API Endpoints

### Public Endpoints

#### Get Model by Slug
```
GET /api/models/:slug
```

Response:
```json
{
  "success": true,
  "data": {
    "name": "Sofa Oslo",
    "glbUrl": "https://...",
    "usdzUrl": "https://...",
    "usdzReady": true,
    "status": "ready"
  }
}
```

### Admin Endpoints

#### Upload Model
```
POST /api/admin/models/upload
Content-Type: multipart/form-data
```

Body:
- `file`: .glb file (required)
- `name`: Model name (optional)

Response:
```json
{
  "success": true,
  "message": "Model uploaded successfully",
  "data": {
    "id": "uuid",
    "name": "Sofa Oslo",
    "slug": "sofa-oslo-abc123",
    "glbUrl": "https://...",
    "usdzUrl": "https://...",
    "usdzReady": false,
    "status": "converting",
    "viewerUrl": "http://localhost:3000/p/sofa-oslo-abc123",
    "createdAt": "2024-01-23T...",
    "updatedAt": "2024-01-23T..."
  }
}
```

#### Get All Models
```
GET /api/admin/models
```

#### Get Model by ID
```
GET /api/admin/models/:id
```

#### Delete Model
```
DELETE /api/admin/models/:id
```

## Core Flow

### 1. Upload Flow

1. Admin uploads .glb file
2. Backend validates file (type, size)
3. Upload to echo3D with `target_type=2`
4. Save to database with `status="converting"`, `usdzReady=false`
5. Return response with viewer URL
6. Start background polling for USDZ

### 2. USDZ Polling

- Runs every 15 seconds (configurable)
- Checks if USDZ file is accessible (HTTP HEAD)
- Updates database when ready: `usdzReady=true`, `status="ready"`
- Timeout after 5 minutes: `status="failed"`

### 3. Viewer Flow

1. Frontend requests `/api/models/:slug`
2. Backend returns model data
3. Frontend shows:
   - GLB for all platforms
   - USDZ for iOS (when `usdzReady=true`)
   - "Converting..." banner when `usdzReady=false`

## Error Handling

All errors return:
```json
{
  "success": false,
  "message": "Error message"
}
```

Status codes:
- `400`: Bad request (invalid file, validation error)
- `404`: Model not found
- `413`: File too large
- `500`: Internal server error
- `502`: echo3D service error

## Multi-language Support

API supports English and Vietnamese based on `Accept-Language` header:

```bash
# English
curl -H "Accept-Language: en" http://localhost:5000/api/models/slug

# Vietnamese
curl -H "Accept-Language: vi" http://localhost:5000/api/models/slug
```

## Logging

Logs are written to:
- Console (development)
- `logs/combined.log` (all logs)
- `logs/error.log` (errors only)

## Testing

### Upload Test

```bash
curl -X POST http://localhost:5000/api/admin/models/upload \
  -F "file=@model.glb" \
  -F "name=Test Model"
```

### Get Model Test

```bash
curl http://localhost:5000/api/models/test-model-abc123
```

## Production Deployment

1. Set `NODE_ENV=production`
2. Use PostgreSQL database
3. Configure proper CORS origin
4. Set up SSL/TLS
5. Use process manager (PM2, systemd)
6. Set up monitoring and logging
7. Configure rate limiting appropriately

## License

MIT
