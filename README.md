# HealthLease

A modern API application built with Hono framework.

## Features

- ⚡ **Fast**: Built with Hono for optimal performance
- 🔒 **Secure**: Built-in security middleware and headers
- 📝 **TypeScript**: Full type safety and IntelliSense support
- 🚀 **Modern**: ES modules and latest JavaScript features
- 📊 **Monitoring**: Request timing and health checks

## Quick Start

### Prerequisites

- [Bun](https://bun.sh) (recommended) or Node.js 18+
- TypeScript knowledge

### Installation

```bash
# Install dependencies
bun install

# Start development server
bun run dev

# Or with Node.js
npm run dev
```

### Available Scripts

- `bun run dev` - Start development server with hot reload
- `bun run start` - Start production server
- `bun run build` - Build for production
- `bun run type-check` - Run TypeScript type checking

## Project Structure

```
src/
├── index.ts          # Main application entry point
├── routes/           # API route handlers
│   └── index.ts     # Route definitions
├── middleware/       # Custom middleware functions
│   └── index.ts     # Middleware implementations
├── utils/            # Utility functions
│   └── index.ts     # Common utilities
└── types/            # TypeScript type definitions
    └── index.ts     # Type definitions
public/               # Static files directory
```

## API Endpoints

- `GET /` - API information
- `GET /health` - Health check endpoint
- `GET /api/info` - Detailed API information
- `GET /static/*` - Static file serving

## Development

The application uses:
- **Hono** for the web framework
- **TypeScript** for type safety
- **Bun** for fast development and runtime
- **ES Modules** for modern JavaScript

## Environment Variables

Create a `.env` file:

```env
PORT=3000
NODE_ENV=development
```

## License

MIT
