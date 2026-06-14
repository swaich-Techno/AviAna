# Aviana Collection ERP

Production-ready Next.js App Router MVP for **Aviana Collection**, a premium cloth house and boutique retail business.

The project includes two connected products:

- Public website for published boutique collections, contact details, SEO, schema, and WhatsApp inquiries.
- Protected internal ERP for website CMS, inventory, billing, suppliers, purchases, expenses, reports, and user settings.

## Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- MongoDB with Mongoose and serverless connection caching
- JWT cookie sessions with route middleware
- bcrypt password hashing
- zod validation
- React Hook Form
- Recharts
- Lucide icons

## Environment Variables

Create `.env.local` from `.env.example`:

```env
MONGODB_URI=
JWT_SECRET=
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_BUSINESS_NAME=Aviana Collection
```

Use a long random `JWT_SECRET` in production. Never expose `MONGODB_URI` or `JWT_SECRET` client-side.

## MongoDB Setup

1. Create a MongoDB Atlas cluster or use your own MongoDB server.
2. Create a database user with a strong password.
3. Add your IP during local development, and allow Vercel access for production.
4. Put the connection string in `MONGODB_URI`.

## Install and Run Locally

```bash
npm install
npm run seed:admin
npm run dev
```

Open `http://localhost:3000`.

## First Super Admin

Seed script creates:

- Email: `admin@avianacollection.in`
- Password: `ChangeMe@12345`

Change this password immediately after first login from `/dashboard/settings`.

## Key Routes

Public:

- `/`
- `/collections`
- `/collections/[slug]`
- `/about`
- `/contact`

Auth:

- `/login`

Dashboard:

- `/dashboard`
- `/dashboard/website`
- `/dashboard/website/listings`
- `/dashboard/website/settings`
- `/dashboard/inventory`
- `/dashboard/inventory/new`
- `/dashboard/billing`
- `/dashboard/billing/new`
- `/dashboard/billing/[id]`
- `/dashboard/suppliers`
- `/dashboard/purchases`
- `/dashboard/expenses`
- `/dashboard/reports`
- `/dashboard/settings`

## Website CMS

Only `SUPER_ADMIN` can manage the public website:

- Business details
- Hero image URL
- Logo URL
- SEO title and description
- Open Graph image
- Contact details
- Map embed URL
- Website live/offline toggle
- Collection listings
- Product publish/unpublish
- Featured products

Public pages query only `status: published` website listings and never expose ERP inventory, supplier, billing, expense, or purchase data.

## ERP Logic

Purchases:

- Increase inventory stock.
- Create inventory movement entries.
- Update supplier balance as `previous + grandTotal - amountPaid`.

Bills:

- Reduce inventory stock for linked inventory items.
- Support custom non-inventory bill items.
- Save cost price snapshots.
- Estimate profit.
- Prevent negative stock unless explicitly allowed on the bill form.

Manual stock adjustment:

- Requires a reason.
- Creates inventory movement history.

## SEO

Implemented:

- Dynamic metadata for public pages
- Canonical URLs
- Open Graph and Twitter card metadata
- `sitemap.ts`
- `robots.ts`
- LocalBusiness / ClothingStore JSON-LD
- Product JSON-LD
- Semantic public pages
- Image alt text
- Admin/dashboard noindex metadata and `X-Robots-Tag`

## Deploy on Vercel

1. Push this folder to GitHub.
2. Import the GitHub repo into Vercel.
3. Add all environment variables in Vercel Project Settings.
4. Run the seed script once against the production MongoDB connection before sharing admin access.
5. Change the seeded admin password immediately.

Build command:

```bash
npm run build
```

Start command:

```bash
npm run start
```

## Security Notes

- Passwords are hashed with bcrypt.
- Dashboard routes are protected by middleware.
- Sessions are stored in HTTP-only cookies.
- Server mutations require authenticated roles.
- Super Admin-only CMS and owner creation are role-protected.
- Do not commit `.env`, `.env.local`, `.next`, `node_modules`, or `.vercel`.

## Final Upload Folder

For the requested GitHub handoff, the final clean copy should be placed at:

```text
D:\Aviana Collection ERP
```
