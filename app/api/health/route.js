export async function GET() {
  const body = {
    ok: true,
    time: new Date().toISOString(),
    env: {
      mongo: Boolean(process.env.MONGODB_URI)
    }
  };
  return Response.json(body, { status: 200 });
}
