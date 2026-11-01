import { randomBytes } from "node:crypto";
import type { Config, Context } from "@netlify/functions";
import { eq } from "drizzle-orm";
import { db } from "../../db/index.js";
import { urls } from "../../db/schema.js";

function validateUrl(longurl: string) {
  let parsedUrl: URL;
  try {
    parsedUrl = new URL(longurl);
  } catch {
    return "Enter a valid URL beginning with http:// or https://.";
  }
  if (!["http:", "https:"].includes(parsedUrl.protocol)) {
    return "Only HTTP and HTTPS URLs can be shortened.";
  }
  return null;
}

async function createLink(req: Request) {
  let payload: { longurl?: unknown };
  try {
    payload = await req.json();
  } catch {
    return Response.json({ error: "Send a JSON body with a longurl field." }, { status: 400 });
  }

  const longurl = typeof payload?.longurl === "string" ? payload.longurl : "";
  const validationError = validateUrl(longurl);
  if (validationError) return Response.json({ error: validationError }, { status: 400 });

  const baseUrl = `${new URL(req.url).origin}/api/v1`;
  const [existing] = await db.select().from(urls).where(eq(urls.longurl, longurl)).limit(1);
  const record =
    existing ??
    (
      await db
        .insert(urls)
        .values({ longurl: longurl, urlcode: randomBytes(6).toString("base64url") })
        .returning()
    )[0];

  return Response.json(
    {
      data: {
        longurl: record.longurl,
        urlcode: record.urlcode,
        shorturl: `${baseUrl}/${record.urlcode}`,
        date: record.createdAt,
      },
    },
    { status: 201 }
  );
}

async function followLink(code: string) {
  const [record] = await db.select().from(urls).where(eq(urls.urlcode, code)).limit(1);
  if (!record) return new Response("This short link was not found.", { status: 404 });
  return Response.redirect(record.longurl, 302);
}

export default async (req: Request, context: Context) => {
  try {
    if (req.method === "POST" && context.params.code === "url") return await createLink(req);
    if (req.method === "GET") return await followLink(context.params.code);
    return new Response("Method not allowed", { status: 405 });
  } catch (error) {
    console.error(error);
    return req.method === "POST"
      ? Response.json({ error: "Unable to create a short link." }, { status: 500 })
      : new Response("Unable to resolve this short link.", { status: 500 });
  }
};

export const config: Config = {
  path: "/api/v1/:code",
};
