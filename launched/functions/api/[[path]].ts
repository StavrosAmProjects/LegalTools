interface Env {
  ENVIRONMENT: string;
}

export const onRequest: PagesFunction<Env> = async (context) => {
  const { env } = context;

  return new Response(JSON.stringify({
    status: 'online',
    message: 'Claude for Legal API is active.',
    version: '1.0.0',
    env: env.ENVIRONMENT || 'production'
  }), {
    headers: { 'content-type': 'application/json' }
  });
};
