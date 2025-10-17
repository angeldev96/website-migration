# Yiddish Jobs - Website Migration

A modern job board platform built with Next.js 15, React 19, Tailwind CSS 4, and Prisma ORM, specifically designed for the Jewish community in Boro Park, Brooklyn, NY.

## 🚀 Tech Stack

- **Framework:** Next.js 15.5.4 (App Router)
- **UI Library:** React 19.1.0
- **Styling:** Tailwind CSS v4
- **Database:** PostgreSQL (Railway)
- **ORM:** Prisma
- **Deployment:** Vercel (recommended)

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- PostgreSQL database (Railway)

## 🔧 Setup Instructions

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd website-migration
```

### 2. Install dependencies

```bash
npm install
```

### 3. Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Add your database connection string:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 4. Generate Prisma Client

```bash
npx prisma generate
```

### 5. Sync with Database

```bash
npx prisma db pull
```

### 6. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the result.

## 📁 Project Structure

```
website-migration/
├── src/
│   ├── app/
│   │   ├── api/              # API Routes
│   │   │   ├── jobs/         # Jobs endpoints
│   │   │   ├── categories/   # Categories endpoint
│   │   │   ├── search/       # Search endpoint
│   │   │   └── stats/        # Statistics endpoint
│   │   ├── layout.js         # Root layout
│   │   ├── page.js           # Homepage
│   │   └── globals.css       # Global styles
│   ├── components/           # React components
│   │   ├── Header.js
│   │   ├── Footer.js
│   │   ├── SearchBar.js
│   │   ├── Stats.js
│   │   ├── PopularCategories.js
│   │   └── FeaturedJobs.js
│   └── lib/
│       └── prisma.js         # Prisma client singleton
├── prisma/
│   └── schema.prisma         # Database schema
└── public/                   # Static files
```

## 🔌 API Endpoints

### Jobs
- `GET /api/jobs` - Get all jobs with pagination and filters
  - Query params: `page`, `limit`, `category`, `location`, `search`, `genderCategory`
- `GET /api/jobs/[id]` - Get a specific job by ID
- `GET /api/jobs/featured` - Get featured/recent jobs
  - Query params: `limit` (default: 6)

### Categories
- `GET /api/categories` - Get all categories with job counts

### Search
- `POST /api/search` - Advanced job search
  - Body: `{ keyword, location, category, genderCategory, page, limit }`

### Statistics
- `GET /api/stats` - Get website statistics
  - Returns: total jobs, companies, recent jobs, category breakdown

## 🗄️ Database Schema

The main table is `jobs_sheet` with the following key fields:

- `jobTitle` - Job title
- `description` - Job description
- `category` - Job category
- `company` - Company name
- `emailInfo` - Contact email
- `phoneNumber` - Contact phone
- `jobDate` - Date posted
- `genderCategory` - Gender category filter
- `companyVerified` - Verification status
- And more...

## 🎨 Features

### Implemented
- ✅ Modern, responsive homepage
- ✅ Job search functionality
- ✅ Category browsing
- ✅ Statistics display
- ✅ Featured jobs section
- ✅ Full API backend with Prisma
- ✅ PostgreSQL database integration

### Coming Soon
- 🔄 Dynamic job listing pages
- 🔄 Individual job detail pages
- 🔄 User authentication
- 🔄 Job posting form for employers
- 🔄 Advanced filters and sorting
- 🔄 Job alerts system
- 🔄 SEO optimization

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

```bash
npm run build
```

## 📝 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npx prisma studio` - Open Prisma Studio (database GUI)
- `npx prisma generate` - Generate Prisma Client
- `npx prisma db pull` - Pull schema from database

## 🔐 Security

- Never commit `.env` file
- Keep database credentials secure
- Use environment variables for sensitive data

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Railway Documentation](https://docs.railway.app)

## 👥 Contributing

This is a private project for Yiddish Jobs migration. For questions or issues, contact the development team.

## 📄 License

Proprietary - Yiddish Jobs © 2025

