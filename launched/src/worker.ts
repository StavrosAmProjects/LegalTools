/**
 * Cloudflare Worker for serving the frontend and API
 * Note: When using [site] bucket, Wrangler handles static assets.
 * This worker can be used for API augmentation or custom routing.
 */

export interface Env {
  ENVIRONMENT: string;
  __STATIC_CONTENT: any;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // API Routes
    if (url.pathname.startsWith('/api/')) {
      return new Response(JSON.stringify({
        status: 'online',
        message: 'Claude for Legal API is active.',
        version: '1.0.0',
        env: env.ENVIRONMENT
      }), {
        headers: { 'content-type': 'application/json' }
      });
    }

    // Static assets are handled by Cloudflare Pages/Workers Sites
    // when properly configured with a build pipeline.
    return new Response("Not Found", { status: 404 });
  },
};
