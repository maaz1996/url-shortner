# Shortform

A small URL shortener built with Express and MongoDB. The web interface and API are served from the same app.

## Run locally

Requirements: Node.js 20+ and a MongoDB database (MongoDB Atlas works).

1. Install dependencies with `npm install`.
2. Copy `.env.example` to `.env` and set `MONGODB_URI` to your database connection string. Keep `.env` private.
3. Start the app with `npm run dev`.
4. Open [http://localhost:5003](http://localhost:5003).

`PORT` is optional and defaults to `5003`. You can also use the legacy Atlas settings `DBUSERNAME`, `DBPASSWORD`, `DBCLUSTER`, and `DBNAME` instead of `MONGODB_URI`. If neither configuration is provided, local development uses `mongodb://127.0.0.1:27017/url-shortner`.

## API

- `POST /api/v1/url` creates (or returns) a short link. Send JSON `{ "longurl": "https://example.com" }`.
- `GET /api/v1/:code` redirects to the original URL.

Creation accepts only HTTP and HTTPS destinations. Include the scheme explicitly; the app does not add HTTPS or rewrite the destination. The browser URL parser validates the input, while the original text is sent to the API without client-side URL encoding. Recent links are saved in that browser's local storage.

Link creation is public and anyone who can reach the deployment can create links. For a public service, configure rate limiting or abuse protection at the hosting layer.

## Database by host

The two deployment paths intentionally use separate databases and API entry points:

- **Local and Vercel:** Express (`index.js`) serves the UI and API. Its routes connect through `config/database.js` to MongoDB using `MONGODB_URI` (or the legacy Atlas variables). Local MongoDB is used only when no Atlas configuration is supplied.
- **Netlify:** Netlify serves the UI from `public/` and routes the API through `netlify/functions/urls.mts`. That function uses the Netlify Database managed Postgres integration through `db/index.ts` and the schema in `db/schema.ts`. It does not use `MONGODB_URI`.

The databases are independent. URLs created on one host do not automatically appear on the other; migrating between hosts requires copying the URL records and codes.

Netlify's function directory is configured in `netlify.toml`. After changing `db/schema.ts`, generate a migration with `npx drizzle-kit generate --name <change_name>`. Run the Netlify version locally with the Netlify CLI using `netlify dev`; it needs the Netlify Database integration context. The regular `npm run dev` command starts Express and uses MongoDB instead.

## Host on Netlify

Connect the repository to Netlify and enable its Database integration for the site. Netlify publishes `public/` and deploys the function in `netlify/functions/`; the function handles `/api/v1/url` and `/api/v1/:code`. No MongoDB connection string is required for this deployment.

## Host on Vercel

1. Push this repository to GitHub and import it in Vercel as a new project. Vercel detects the Node app from `vercel.json`; no build command or output directory is required.
2. Create a MongoDB Atlas cluster (or use an existing MongoDB server). In Atlas, create a database user and add Vercel's outbound access as permitted by your network-access policy. For a quick initial setup, Atlas supports allowing access from anywhere, but restrict this where possible.
3. In the Vercel project's **Settings → Environment Variables**, add:
	- `MONGODB_URI`: the full MongoDB connection string, including the database name.
4. Apply the variables to the environments you will use, then redeploy the project.
5. Open the Vercel deployment URL. The short links are generated from that deployment's host; use a custom domain in Vercel if you want branded links.

Do not set `PORT` on Vercel. Link data is stored in MongoDB, so it persists between serverless invocations; recent-link history is local to each browser. Remove any old `AUTHTOKEN` setting from your local or Vercel environment because it is no longer used.