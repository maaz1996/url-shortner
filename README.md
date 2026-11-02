# Shortform

A lightweight URL shortener with two distinct backend modes:

- **Local + Vercel:** Express app with MongoDB
- **Netlify:** Netlify Function with Netlify Database

The app is intentionally split by host so each platform can keep using the database it owns without forcing one deployment mode onto the others.

## 1) Run locally with MongoDB

Requirements: Node.js 20+ and a MongoDB database (MongoDB Atlas works).

1. Install dependencies with `npm install`.
2. Copy `.env.example` to `.env` and set `MONGODB_URI` to your MongoDB connection string.
3. Start the app with `npm run dev`.
4. Open `http://localhost:5003` in the browser.

Notes:
- `PORT` is optional and defaults to `5003`.
- If you are using the legacy Atlas variable format instead of `MONGODB_URI`, these environment variables still work: `DBUSERNAME`, `DBPASSWORD`, `DBCLUSTER`, and `DBNAME`.
- If none are set, the app falls back to `mongodb://127.0.0.1:27017/url-shortner`.

## 2) API behavior

- `POST /api/v1/url` creates or reuses a short URL.
- `GET /api/v1/:code` redirects to the original destination.

Request example:

```json
{
  "longurl": "https://example.com/some/page"
}
```

Validation rules:
- The destination must begin with `http://` or `https://`.
- The input is not auto-prefixed with `https://`.
- The browser validates the URL and the server accepts the original string as submitted.

## 3) Database by platform

### Local + Vercel

- Express app: `index.js`
- Database adapter: `config/database.js`
- Database: MongoDB via `MONGODB_URI`
- Route entry: `routes/urlroute.js`

This is the setup used for local development and Vercel deployment.

### Netlify

- Frontend static files: `public/`
- Serverless API: `netlify/functions/urls.mts`
- Database adapter: `db/index.ts`
- Database schema: `db/schema.ts`
- Database: Netlify Database managed Postgres

This is the setup used for Netlify, and it does not read `MONGODB_URI`.

Important: the databases are not shared between these environments. URLs created on Netlify do not automatically appear on Vercel or locally, and vice versa.

## 4) Deploy to Netlify

1. Push this repo to GitHub.
2. In Netlify, choose **Add new site → Import from Git** and connect the repository.
3. Make sure the root directory is the repository root.
4. Netlify will use the configured function directory from `netlify.toml` to host `netlify/functions/urls.mts`.
5. Enable the Netlify Database integration in the project if needed.
6. Deploy the site.

No `MONGODB_URI` is required for this Netlify deployment path.

## 5) Deploy to Vercel

1. Push this repo to GitHub.
2. Import the repository in Vercel.
3. Set the environment variable:
   - `MONGODB_URI` = full MongoDB connection string, including the database name
4. Deploy the project.
5. Use the generated Vercel URL or a custom domain.

Do not set `PORT` on Vercel. The app will use the platform-provided port.

## 6) Notes

- Recent-link history is stored in the browser, not in the database.
- Link creation is public on any deployment you expose.
- If you run both Netlify and Vercel, treat them as separate apps with separate data sets.
- If you edit the Netlify DB schema, generate a migration with:

```bash
npx drizzle-kit generate --name <change_name>
```

For local Netlify testing, use:

```bash
netlify dev
```
