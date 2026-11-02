// Free Pages address for the existing application. No credentials are copied.
export default {
  async fetch(request, env) {
    try {
      const primary = new URL(env.PUBLIC_ORIGIN);
      const incoming = new URL(request.url);
      if (incoming.origin !== primary.origin) {
        primary.pathname = incoming.pathname;
        primary.search = incoming.search;
        return Response.redirect(primary.href, 308);
      }
      return await env.APP.fetch(request);
    } catch {
      return new Response('Temporarily unavailable. Please try again later.', {
        status: 503,
        headers: {'Cache-Control': 'no-store', 'Retry-After': '60'},
      });
    }
  },
};
