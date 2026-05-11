# AI-UGC

AI-UGC is a configurable AI user-generated content platform for analyzing winning source content and generating niche-specific marketing, advertising, and brand videos.

## Migration Status

This repository is in the middle of a migration from the older `backend/` + `frontend/` layout into an AI-UGC monorepo with:

- `apps/api`
- `apps/web`
- shared packages for provider adapters, workflow logic, contracts, and niche packs

The older runtime folders still exist during the transition. For the monorepo migration path, start with:

- [specs/002-ai-ugc-template-platform/quickstart.md](specs/002-ai-ugc-template-platform/quickstart.md)
- [docs/extensions.md](docs/extensions.md)
- [tooling/fixtures/README.md](tooling/fixtures/README.md)

## Overview

AI-UGC allows operators, marketers, and creators to upload reference UGC content, extract key insights with AI, and generate tailored derivative assets for products, offers, and campaigns while preserving the strongest structural patterns from the original content.

**[Watch Demo on YouTube](https://youtu.be/Ylw-e1AayGE)**

**Built with [GitHub Spec Kit](https://github.com/github/spec-kit)**

## Features

- **Video Upload & Analysis**: Upload UGC advertisement videos (MP4, MOV, AVI up to 100MB) and get AI-powered analysis of visual style, messaging, pacing, and engagement techniques
- **Product Customization**: Input your product details (name, description, image) to personalize the generated advertisement
- **AI Prompt Generation**: Automatically generate and moderate text-to-video prompts combining insights from the original video with your product information
- **Video Generation**: Create new advertisement videos using advanced AI video generation services (Sora, Laozhang)
- **Side-by-Side Comparison**: View original and generated videos together to compare results
- **Cloud Storage**: All videos and assets are stored securely in AWS S3

## Tech Stack

### Backend
- **Framework**: NestJS (Node.js/TypeScript)
- **Video Analysis**: Google Gemini 2.5 Flash API
- **Text Generation**: OpenAI GPT-5 (via Laozhang API)
- **Video Generation**: OpenAI Sora 2 (via Laozhang API)
- **Storage**: AWS S3 with presigned URLs
- **Architecture**: Modular structure with separate services for analysis, generation, prompts, products, storage, and sessions

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS
- **State Management**: Custom hooks (`useWorkflow`)
- **API Client**: Axios

### Infrastructure
- Session-based workflow management (no authentication required for MVP)
- RESTful API with modular controllers
- File upload handling with Multer
- Environment-based configuration

## Project Structure

```
AI-UGC/
├── apps/
│   ├── api/                  # Target NestJS API app
│   └── web/                  # Target React/Vite workspace app
├── packages/
│   ├── provider-core/        # Shared provider contracts and routing
│   ├── provider-laozhang/    # LaoZhang adapter
│   ├── provider-apimart/     # APIMart adapter
│   ├── niche-packs/          # Built-in and custom niche-pack entry points
│   ├── workflow-engine/      # Workflow composition utilities
│   ├── contracts/            # Shared API/domain contracts
│   ├── domain/               # Workspace, profile, and session entities
│   └── config/               # Shared environment/config loading
├── tooling/
│   └── fixtures/             # Example workspace, niche, and provider fixtures
├── docs/
│   └── extensions.md         # Maintainer-facing extension guide
├── backend/                  # Older API surface retained during migration
├── frontend/                 # Older SPA surface retained during migration
└── specs/
    └── 002-ai-ugc-template-platform/
```

## Example Output

See example generated videos in [`scripts/output/`](scripts/output/):
- `generated-26.11.25.mp4` - Generated advertisement video

## Getting Started

For the monorepo migration path, use [specs/002-ai-ugc-template-platform/quickstart.md](specs/002-ai-ugc-template-platform/quickstart.md).

Additional migration docs:

- [packages/niche-packs/README.md](packages/niche-packs/README.md)
- [packages/provider-core/README.md](packages/provider-core/README.md)
- [tooling/fixtures/workspaces/ecommerce-laozhang.workspace-template.json](tooling/fixtures/workspaces/ecommerce-laozhang.workspace-template.json)
- [tooling/fixtures/workspaces/local-services-apimart.workspace-template.json](tooling/fixtures/workspaces/local-services-apimart.workspace-template.json)

The older setup flow is still documented below while the migration is in progress.

### Prerequisites
- Node.js 18+
- AWS account with S3 bucket configured
- API keys for:
  - Google Gemini API
  - OpenAI API
  - Laozhang API (optional)

### Installation

1. Clone the repository into a local folder of your choice.

2. Install dependencies:
```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

3. Configure environment variables:
```bash
# Backend: create backend/.env
cp backend/.env.example backend/.env
# Add your API keys and AWS credentials

# Frontend: create frontend/.env
cp frontend/.env.example frontend/.env
# Configure API endpoint
```

4. Start the development servers:
```bash
# Terminal 1: Start backend (port 3000)
cd backend
npm run start:dev

# Terminal 2: Start frontend (port 5173)
cd frontend
npm run dev
```

5. Open http://localhost:5173 in your browser

## Workflow

1. **Upload Reference Video**: Upload a successful UGC advertisement video
2. **Analyze**: AI extracts key elements (style, tone, pacing, techniques)
3. **Edit Analysis**: Review and modify the analysis if needed
4. **Add Product Info**: Enter your product name, description, and upload product image
5. **Generate Prompt**: AI creates a text-to-video prompt combining insights + product
6. **Moderate & Approve**: Review and edit the prompt
7. **Generate Video**: Create your new advertisement video
8. **Compare**: View original and generated videos side-by-side
9. **Download**: Save your generated video

## API Documentation

See [specs/002-ai-ugc-template-platform/contracts/openapi.yaml](specs/002-ai-ugc-template-platform/contracts/openapi.yaml) for the active AI-UGC platform contract.

## Development

- **Backend Tests**: `cd backend && npm test`
- **Frontend Tests**: `cd frontend && npm test`
- **Linting**: `npm run lint` in respective directories
- **Formatting**: `npm run format` in respective directories

## License

UNLICENSED - Private project

## Contributing

This project follows spec-first development practices. See [specs/002-ai-ugc-template-platform/](specs/002-ai-ugc-template-platform/) for the active AI-UGC transformation artifacts.
