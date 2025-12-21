# Project: [Your Project Name]

## Overview
[Brief description of the project - what it does, who uses it]

## Tech Stack
- **Frontend:** [e.g., React 18 + TypeScript + Tailwind CSS]
- **Backend:** [e.g., Node.js + Express + Prisma]
- **Database:** [e.g., PostgreSQL]
- **Testing:** [e.g., Jest + React Testing Library]
- **Deployment:** [e.g., Vercel + Railway]

## AI Protocol Configuration

This project uses the AI Development Protocols framework.

### Protocol Selection
| Task | Protocol | Trigger |
|------|----------|---------|
| Code Review | code_review_protocol.md | `COMPREHENSIVE` |
| Debugging | debug_protocol.md | `DEEPDIVE` |
| Testing | test_automation_protocol.md | `FULLSPEC` |
| Security | security_audit_protocol.md | `SECAUDIT` |

### Safety Rules
- 🔴 **Never auto-modify:** Authentication, payments, database migrations
- 🟠 **Show diff first:** Business logic, API contracts
- 🟢 **Safe to auto-fix:** Formatting, unused imports, type annotations

## Key Conventions

### Naming
- Components: PascalCase (`UserProfile.tsx`)
- Hooks: camelCase with "use" prefix (`useAuth.ts`)
- Utils: camelCase (`formatDate.ts`)
- Constants: SCREAMING_SNAKE_CASE

### Patterns
- Use [Shadcn/MUI/etc.] UI components
- Follow existing patterns in `src/components/`
- Use Zod for validation
- Use React Query for data fetching

## Directory Structure
```
src/
├── components/     # Reusable React components
├── pages/          # Route pages
├── hooks/          # Custom React hooks
├── api/            # API handlers
├── lib/            # Utilities and helpers
├── types/          # TypeScript type definitions
└── styles/         # Global styles
```

## Important Files
- `src/auth/` - Authentication logic (🔴 HIGH-RISK)
- `src/lib/api.ts` - API client configuration
- `src/types/` - Shared TypeScript types
- `prisma/schema.prisma` - Database schema

## Commands
```bash
npm run dev          # Start development server
npm run build        # Production build
npm test             # Run tests
npm run lint         # Lint code
npm run type-check   # TypeScript check
```

## Environment Variables
- `DATABASE_URL` - Database connection string
- `NEXTAUTH_SECRET` - Auth encryption key
- `API_BASE_URL` - Backend API URL

## Known Issues
- [ ] [Issue 1]
- [ ] [Issue 2]

## Recent Changes
- [Date]: [Change description]
- [Date]: [Change description]
