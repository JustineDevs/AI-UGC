# AI-UGC - Setup & Run Guide

This repository uses a monorepo layout with `apps/api`, `apps/web`, and shared
`packages/*`. The older `backend/` and `frontend/` directories are still
present as reference sources during the migration.

## Prerequisites

- Node.js v20+
- AWS S3 bucket with CORS enabled
- Google Gemini API key

## Quick Start

### 1. Configure Environment Variables

**API / Root** (`.env` or `apps/api/.env`):

You need to add your actual credentials to the root `.env`:

```bash
# Edit the root `.env` and add these values:

# Server
PORT=3000

# AWS S3 - REQUIRED - Get these from AWS Console
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_actual_aws_access_key_here
AWS_SECRET_ACCESS_KEY=your_actual_aws_secret_key_here
AWS_S3_BUCKET=your_s3_bucket_name_here

# Google Gemini - REQUIRED - Get from https://makersuite.google.com/app/apikey
GOOGLE_GEMINI_API_KEY=your_actual_gemini_api_key_here

# CORS
CORS_ORIGIN=http://localhost:5173

# Provider selection
DEFAULT_PROVIDER=laozhang

# LaoZhang
LAOZHANG_API_KEY=your_laozhang_api_key
LAOZHANG_API_BASE_URL=https://api.laozhang.ai/v1

# APIMart
APIMART_API_KEY=your_apimart_api_key
APIMART_API_BASE_URL=https://api.apimart.ai/v1
```

**Frontend** (`frontend/.env`):
```bash
# Already created - default values should work:
VITE_API_BASE_URL=http://localhost:3000/api
VITE_ENV=development
```

### 2. Start API Server

Once you've configured the root `.env` with your actual credentials:

```bash
pnpm --filter @ai-ugc/api dev
```

The API will start on **http://localhost:3000**

You should see:
```
[Nest] INFO [NestFactory] Starting Nest application...
[Nest] INFO [InstanceLoader] AppModule dependencies initialized
[Nest] INFO [NestApplication] Nest application successfully started
```

### 3. Start Web Dev Server (in a new terminal)

```bash
pnpm --filter @ai-ugc/web dev
```

The web app will start on **http://localhost:5173**

### 4. Test the Application

1. Open your browser to **http://localhost:5173**
2. You should see the UGC Video Generator interface
3. Click "Select Video File" and choose an MP4, MOV, or AVI file (max 100MB)
4. Click "Upload Video"
5. Wait for the upload to complete
6. The AI analysis will start automatically
7. After 30-60 seconds, you'll see the scene breakdown
8. You can edit the analysis by clicking "Edit"

## What's Working (Phase 3 - User Story 1)

✅ Video file upload with validation
✅ Direct browser-to-S3 upload via presigned URLs
✅ Google Gemini AI video analysis
✅ Scene-by-scene breakdown display
✅ Inline editing of analysis results
✅ Progress indicator
✅ Error handling

## Troubleshooting

### Backend won't start
- Check that port 3000 is available
- Verify AWS credentials are correct
- Ensure Google Gemini API key is valid

### Upload fails
- Check AWS S3 bucket CORS configuration
- Verify AWS credentials have S3 write permissions
- Ensure file is under 100MB and is MP4/MOV/AVI format

### Analysis hangs
- Check Google Gemini API key is valid
- Verify video uploaded successfully to S3
- Check backend console for error messages

## S3 CORS Configuration

Your S3 bucket needs this CORS policy:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "HEAD"],
    "AllowedOrigins": ["http://localhost:5173"],
    "ExposeHeaders": ["ETag"]
  }
]
```

## API Endpoints Available

- `POST /api/sessions/:sessionId/video/upload-url` - Get presigned upload URL
- `POST /api/sessions/:sessionId/analysis` - Trigger video analysis
- `GET /api/sessions/:sessionId/analysis` - Get analysis status/results
- `PATCH /api/sessions/:sessionId/analysis` - Update analysis with edits

## Next Steps

After testing Phase 3 (User Story 1), you can continue with:
- Phase 4: User Story 2 - Product Information Input
- Phase 5: User Story 3 - Prompt Generation and Moderation
- Phase 6: User Story 4 - Advertisement Video Generation

## Development Commands

### Backend
```bash
npm run start:dev    # Start with hot-reload
npm run build        # Build for production
npm run lint         # Run ESLint
npm run test         # Run tests
```

### Frontend
```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```
