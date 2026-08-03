const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
const OPENCODE_API_KEY = Deno.env.get("OPENCODE_API_KEY") ?? "";
const OPENCODE_ENDPOINT = "https://opencode.ai/zen/v1/chat/completions";

const allowedOrigins = new Set([
  "https://anthonyamaru.com",
  "https://www.anthonyamaru.com",
  "http://127.0.0.1:8765",
  "http://localhost:8765",
]);

function corsHeaders(request: Request) {
  const origin = request.headers.get("origin") ?? "";
  return {
    "Access-Control-Allow-Origin": allowedOrigins.has(origin) ? origin : "https://anthonyamaru.com",
    "Access-Control-Allow-Headers": "authorization, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Vary": "Origin",
  };
}

function json(request: Request, body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders(request), "Content-Type": "application/json" },
  });
}

function systemPrompt(scope: string) {
  if (scope === "book") {
    return [
      "You are the careful editorial assistant for Anthony Amaru's manuscript, A Hypothesis of Man.",
      "Improve clarity, structure, grammar, and rhythm while preserving the author's meaning and voice.",
      "Do not invent quotations, citations, events, or factual claims.",
      "Return only the complete revised chapter text, with no preamble and no Markdown code fence.",
    ].join(" ");
  }
  if (scope === "aviation") {
    return [
      "You are a cautious aviation study assistant.",
      "Use only the question and reference context supplied by the user.",
      "Explain the answer clearly, identify uncertainty, and never substitute for current FAA publications, an instructor, or operational judgment.",
    ].join(" ");
  }
  return [
    "You are a Mandarin study assistant for an early learner.",
    "Use simplified Chinese, accurate pinyin with tone marks, concise English explanations, and examples limited to the learner's supplied vocabulary when possible.",
  ].join(" ");
}

async function authenticatedAdmin(request: Request) {
  const authorization = request.headers.get("authorization") ?? "";
  if (!authorization.startsWith("Bearer ")) return false;
  const headers = { apikey: SUPABASE_ANON_KEY, Authorization: authorization };
  const userResponse = await fetch(SUPABASE_URL + "/auth/v1/user", { headers });
  if (!userResponse.ok) return false;
  const user = await userResponse.json();
  if (!user?.id) return false;
  const adminResponse = await fetch(SUPABASE_URL + "/rest/v1/site_admins?select=user_id&user_id=eq." + encodeURIComponent(user.id), { headers });
  if (!adminResponse.ok) return false;
  const rows = await adminResponse.json();
  return Array.isArray(rows) && rows.length === 1;
}

export default {
async fetch(request: Request) {
  if (request.method === "OPTIONS") return new Response("ok", { headers: corsHeaders(request) });
  if (request.method !== "POST") return json(request, { error: "Method not allowed." }, 405);
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY || !OPENCODE_API_KEY) return json(request, { error: "Server configuration is incomplete." }, 500);
  if (!(await authenticatedAdmin(request))) return json(request, { error: "Administrator authentication is required." }, 401);

  let body: Record<string, unknown>;
  try { body = await request.json(); } catch { return json(request, { error: "A JSON request body is required." }, 400); }
  const scope = String(body.scope ?? "");
  if (!["book", "aviation", "mandarin"].includes(scope)) return json(request, { error: "Unsupported assistant scope." }, 400);

  let userPrompt = "";
  if (scope === "book") {
    const chapter = (body.chapter ?? {}) as Record<string, unknown>;
    const title = String(chapter.title ?? "Untitled chapter").slice(0, 300);
    const content = String(chapter.content ?? "");
    if (!content.trim()) return json(request, { error: "The chapter is empty." }, 400);
    if (content.length > 120_000) return json(request, { error: "This chapter is too long for one editing request." }, 413);
    userPrompt = "Revise this chapter.\n\nTitle: " + title + "\n\n" + content;
  } else {
    const message = String(body.message ?? "").trim();
    const context = String(body.context ?? "").trim();
    if (!message) return json(request, { error: "A question or instruction is required." }, 400);
    if (message.length + context.length > 80_000) return json(request, { error: "This request is too long." }, 413);
    userPrompt = context ? "Reference context:\n" + context + "\n\nQuestion:\n" + message : message;
  }

  const providerResponse = await fetch(OPENCODE_ENDPOINT, {
    method: "POST",
    headers: { Authorization: "Bearer " + OPENCODE_API_KEY, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "big-pickle",
      messages: [
        { role: "system", content: systemPrompt(scope) },
        { role: "user", content: userPrompt },
      ],
    }),
  });

  if (!providerResponse.ok) {
    const detail = (await providerResponse.text()).slice(0, 500);
    return json(request, { error: "Big Pickle request failed.", detail }, 502);
  }
  const result = await providerResponse.json();
  const content = result?.choices?.[0]?.message?.content;
  if (typeof content !== "string" || !content.trim()) return json(request, { error: "Big Pickle returned an empty response." }, 502);
  return json(request, { content, model: "big-pickle" });
},
};
