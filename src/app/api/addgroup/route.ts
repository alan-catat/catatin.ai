export async function POST(req: Request) {
  const body = await req.json();

  const res = await fetch(process.env.N8N_ADDGROUP_URL!, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  return Response.json(data);
}
