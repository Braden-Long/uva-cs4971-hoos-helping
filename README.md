# Hoos Helping

A community task-sharing platform connecting the UVA and Charlottesville community. Post tasks, find opportunities, and build trusted connections within a verified local network.

## What is Hoos Helping?

Hoos Helping enables students, faculty, and Charlottesville residents to post tasks (moving help, errands, pet sitting, tutoring, etc.) and connect with community members who can complete them. It's a trusted alternative to informal Facebook posts, with built-in verification and structured task management.

**Key Features:**

- Browse and filter tasks by category, location, and budget
- Post tasks with detailed descriptions and compensation
- Email-based authentication (magic links via Resend)
- **UVA Verification System** - Code-based verification using @virginia.edu email (separate from login)
- **Background Verification** - Third-party verification via SerpAPI
- User profiles with task statistics and verification badges
- **Stripe Payment Integration** - Payment links and earnings tracking (sandbox mode)
- Google Maps integration for task locations

## Team

- Aditya Kakkar (zjq5mr)
- Ansh Pathapadu (tqc7wn)
- Braden Long (bcj3rh)
- Yousif Abood (ywx4um)

## Application Links

- Production Environment: https://hooshelping.com
- Hosting Provider: https://netlify.com
- Payment Provider: https://stripe.com
- Background Checks Provider: https://serpapi.com

## Testing

- You can register with any email address for testing locally and on production (check note about virigina.edu addresses).

## Installation Instuctions

- See prerequisites and local development instructions below.

## Usage Instructions

- See "How It Works" and "User Flow" sections below. To populate the application with demo data, run `npm install` then `npm run db:seed` from the repository root. Be sure to update the .env file first.

## Sources Used

- Generative AI such as Claude and Codex
- Tailwind UI and Tailwind CSS

## Tech Stack

- **Frontend:** Next.js 15 (React 19), TypeScript, Tailwind CSS 4
- **Backend:** Next.js API routes, Prisma ORM
- **Database:** PostgreSQL (Neon)
- **Auth:** NextAuth.js v5 with email magic links
- **Email:** Resend
- **Hosting:** Netlify

## Getting Started

### Prerequisites

- Node.js 20+
- npm/yarn/pnpm
- PostgreSQL database (we use Neon)

### Local Development

1. Clone the repository:

```bash
git clone <repository-url>
cd capstone-orange-4
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:
   Create a `.env` file with:

```env
DATABASE_URL="postgresql://user:password@host/database"
AUTH_SECRET="your-auth-secret"
NEXTAUTH_URL="http://localhost:3000"  # Optional, for local dev
RESEND_API_KEY="re_..."
RESEND_FROM_EMAIL="noreply@hooshelping.com"
STRIPE_SECRET_KEY="sk_test_..."  # Stripe test mode key
```

4. Run database migrations:

```bash
npm run db:migrate -- --name init
```

5. Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Database Management

### Creating Migrations

When you modify the Prisma schema (`prisma/schema.prisma`), create a migration:

```bash
npm run db:migrate -- --name your_change_name
```

Examples:

```bash
npm run db:migrate -- --name add_ratings
npm run db:migrate -- --name add_task_images
```

### Available Commands

- `npm run db:migrate -- --name <name>` - Create and apply migration (development)
- `npm run db:push` - Sync schema without migrations (prototyping only)
- `npm run db:studio` - Open Prisma Studio to view/edit data
- `npm run db:generate` - Regenerate Prisma Client
- `npm run db:seed` - Insert reusable demo users/tasks/applications
- `node scripts/demo-reset.mjs` - **Clear ALL database records** (use with caution)
- `npm run db:reseed` - Clear all data then seed fresh demo data

**Important:** Commit migration files in `prisma/migrations/` to git. They're automatically applied during Netlify deployments.

### Reusable Demo Data

For school demos you can quickly spin up realistic content without touching real accounts:

1. `npm run db:seed` adds 20 tasker accounts, multiple helpers, and 20+ tasks spanning every status (open, assigned, in-progress, completed) plus applications and reviews. All demo accounts use the `@demo.hooshelping.com` domain.
2. `npm run db:reset` now fully clears **all** tables (users, tasks, applications, reviews, sessions, etc.). Only run this when you truly want a blank database.
3. `npm run db:reseed` combines both, so you get a fresh empty database and the new sample data in one go.

Feel free to tweak the seed lists inside `scripts/demo-seed.mjs` if you need different scenarios; just keep emails on the demo domain so the cleanup script can find them.

> Tip: the seed script now provisions a realistic end-to-end account (`yousif@hooshelping.com`) with 20+ posted tasks, helper assignments, and pending applications so the dashboard/profile/My Tasks views are fully populated for demos.

## UVA Verification System

**Important:** UVA (@virginia.edu) emails are **not allowed for login** to avoid Microsoft Outlook's aggressive link scanning which breaks magic link authentication.

### How It Works

1. **Login:** Users create accounts with **non-UVA emails** (Gmail, personal Outlook, etc.)
2. **Verification:** On the profile page, users can verify their UVA affiliation separately by:
   - Entering their `computingid@virginia.edu` email
   - Receiving a 6-digit verification code
   - Entering the code to get verified (code expires in 10 minutes)

### Why Code-Based?

Microsoft Outlook scans links in emails, consuming magic link tokens before users can click them. By separating authentication (any email) from UVA verification (code-based), we avoid this issue entirely.

### User Flow

```
1. Sign up with gmail.com → Magic link works perfectly ✓
2. Go to Profile → UVA Verification section
3. Enter computingid@virginia.edu → Receive 6-digit code
4. Enter code → Get UVA verified badge ✓
```

## Deployment

### Netlify Setup

The app is hosted on Netlify and deploys automatically on push to `main`.

**Environment Variables (set in Netlify dashboard):**

- `DATABASE_URL` - PostgreSQL connection string (pooled)
- `AUTH_SECRET` - NextAuth secret
- `NEXTAUTH_URL` - Production URL (e.g., `https://hooshelping.com`)
- `RESEND_API_KEY` - Resend API key
- `RESEND_FROM_EMAIL` - Email sender address
- `STRIPE_SECRET_KEY` - Stripe API key (use test mode: `sk_test_...`)

**Build Process:**

1. `npm install` runs `postinstall` hook → generates Prisma Client
2. `npm run build` runs `prisma migrate deploy && next build`
3. Migrations apply automatically before build

### Database

We use Neon PostgreSQL with connection pooling. Set `DATABASE_URL` to the pooled connection string (with `-pooler` in hostname).

## Project Structure

```
app/
├── (app)/              # Authenticated app routes
│   ├── dashboard/      # User dashboard
│   ├── profile/        # User profile & stats
│   └── tasks/          # Browse and post tasks
├── (marketing)/        # Public landing pages
├── api/                # API routes
│   ├── auth/           # NextAuth endpoints
│   └── tasks/          # Task CRUD operations
└── generated/prisma/   # Generated Prisma Client (gitignored)

prisma/
├── schema.prisma       # Database schema
└── migrations/         # Migration history (committed to git)
```

## Development Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production (with migrations)
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## Contributing

1. Create a feature branch from `main`
2. Make your changes and commit
3. Push and create a pull request
4. Migrations in `prisma/migrations/` must be committed

## License

Check the LICENSE file.
