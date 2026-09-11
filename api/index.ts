import type { IncomingMessage, ServerResponse } from "http";
import app from "../server";

/**
 * Vercel Serverless Function entrypoint.
 * Routes all `/api/*` serverless requests directly to the Express application
 * with full security headers, sanitized inputs, and in-memory rate protection.
 */
export default function handler(req: IncomingMessage, res: ServerResponse) {
  // Normalize incoming URL path when rewritten by Vercel edge rules
  if (req.url) {
    const xMatched = (req.headers["x-matched-path"] || req.headers["x-vercel-matched-path"]) as string | undefined;
    if (xMatched && xMatched.startsWith("/api")) {
      const qIndex = req.url.indexOf("?");
      const query = qIndex !== -1 ? req.url.slice(qIndex) : "";
      req.url = xMatched.includes("?") ? xMatched : `${xMatched}${query}`;
    }
  }

  return (app as any)(req, res);
}
