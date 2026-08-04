const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
const YOUTUBE_API_KEY = Deno.env.get("YOUTUBE_API_KEY") ?? "";
const TMDB_API_KEY = Deno.env.get("TMDB_API_KEY") ?? "";
const TMDB_API_TOKEN = Deno.env.get("TMDB_API_TOKEN") ?? "";
const REST_COUNTRIES_API_KEY = Deno.env.get("REST_COUNTRIES_API_KEY") ?? "";

const allowedOrigins = new Set([
  "https://anthonyamaru.com",
  "https://www.anthonyamaru.com",
  "https://anthonyamaru.github.io",
  "http://127.0.0.1:8765",
  "http://localhost:8765",
  "http://127.0.0.1:4173",
  "http://localhost:4173",
]);

const sourceLabels = {
  wikimedia: "Wikimedia",
  youtube: "YouTube",
  nasa: "NASA",
  tmdb: "TMDB",
  "open-library": "Open Library",
  "rest-countries": "REST Countries",
  musicbrainz: "MusicBrainz",
} as const;

type SourceId = keyof typeof sourceLabels;
type SearchState = "ok" | "setup" | "error";

type SearchResult = {
  source: SourceId;
  sourceLabel: string;
  title: string;
  description?: string;
  meta?: string;
  image?: string;
  url: string;
};

type SourceResponse = {
  id: SourceId;
  label: string;
  state: SearchState;
  results: SearchResult[];
  message?: string;
  actionUrl?: string;
};

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
    headers: { ...corsHeaders(request), "Content-Type": "application/json", "Cache-Control": "no-store" },
  });
}

function cleanText(value: unknown, limit = 260) {
  return String(value ?? "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim().slice(0, limit);
}

function compact(items: Array<SearchResult | null | undefined>) {
  return items.filter((item): item is SearchResult => Boolean(item?.title && item?.url)).slice(0, 4);
}

function response(id: SourceId, results: SearchResult[], extras: Partial<SourceResponse> = {}): SourceResponse {
  return { id, label: sourceLabels[id], state: "ok", results, ...extras };
}

async function fetchJson(url: string, init: RequestInit = {}) {
  const apiResponse = await fetch(url, { ...init, signal: AbortSignal.timeout(6_000) });
  if (!apiResponse.ok) throw new Error(`Upstream returned ${apiResponse.status}`);
  return apiResponse.json();
}

async function authenticatedAdmin(request: Request) {
  const authorization = request.headers.get("authorization") ?? "";
  if (!authorization.startsWith("Bearer ") || !SUPABASE_URL || !SUPABASE_ANON_KEY) return false;
  const headers = { apikey: SUPABASE_ANON_KEY, Authorization: authorization };
  const userResponse = await fetch(`${SUPABASE_URL}/auth/v1/user`, { headers, signal: AbortSignal.timeout(8_000) });
  if (!userResponse.ok) return false;
  const user = await userResponse.json();
  if (!user?.id) return false;
  const membership = await fetch(
    `${SUPABASE_URL}/rest/v1/site_admins?select=user_id&user_id=eq.${encodeURIComponent(user.id)}`,
    { headers, signal: AbortSignal.timeout(8_000) },
  );
  if (!membership.ok) return false;
  const rows = await membership.json();
  return Array.isArray(rows) && rows.length === 1;
}

async function searchWikimedia(query: string): Promise<SourceResponse> {
  const parameters = new URLSearchParams({
    action: "query",
    generator: "search",
    gsrsearch: query,
    gsrlimit: "4",
    prop: "extracts|pageimages",
    exintro: "1",
    explaintext: "1",
    exsentences: "2",
    piprop: "thumbnail",
    pithumbsize: "320",
    format: "json",
  });
  const data = await fetchJson(`https://en.wikipedia.org/w/api.php?${parameters}`);
  const pages = Object.values(data?.query?.pages ?? {}) as Array<Record<string, any>>;
  const results = compact(pages.sort((a, b) => Number(a.index ?? 99) - Number(b.index ?? 99)).map((page) => ({
    source: "wikimedia",
    sourceLabel: sourceLabels.wikimedia,
    title: cleanText(page.title, 180),
    description: cleanText(page.extract),
    image: page.thumbnail?.source,
    url: `https://en.wikipedia.org/?curid=${encodeURIComponent(page.pageid)}`,
  })));
  return response("wikimedia", results);
}

async function searchYouTube(query: string): Promise<SourceResponse> {
  if (!YOUTUBE_API_KEY) return response("youtube", [], {
    state: "setup",
    message: "YouTube needs an API key in Supabase.",
    actionUrl: `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`,
  });
  const parameters = new URLSearchParams({ part: "snippet", type: "video", maxResults: "4", q: query, key: YOUTUBE_API_KEY });
  const data = await fetchJson(`https://www.googleapis.com/youtube/v3/search?${parameters}`);
  const results = compact((data?.items ?? []).map((item: Record<string, any>) => ({
    source: "youtube",
    sourceLabel: sourceLabels.youtube,
    title: cleanText(item.snippet?.title, 180),
    description: cleanText(item.snippet?.description),
    meta: cleanText(item.snippet?.channelTitle, 100),
    image: item.snippet?.thumbnails?.medium?.url || item.snippet?.thumbnails?.default?.url,
    url: `https://www.youtube.com/watch?v=${encodeURIComponent(item.id?.videoId ?? "")}`,
  })));
  return response("youtube", results);
}

async function searchNasa(query: string): Promise<SourceResponse> {
  const parameters = new URLSearchParams({ q: query, media_type: "image" });
  const data = await fetchJson(`https://images-api.nasa.gov/search?${parameters}`);
  const results = compact((data?.collection?.items ?? []).slice(0, 4).map((item: Record<string, any>) => {
    const details = item.data?.[0] ?? {};
    return {
      source: "nasa",
      sourceLabel: sourceLabels.nasa,
      title: cleanText(details.title, 180),
      description: cleanText(details.description),
      meta: cleanText(details.date_created ? new Date(details.date_created).getUTCFullYear() : "", 20),
      image: item.links?.find((link: Record<string, any>) => link.render === "image")?.href,
      url: `https://images.nasa.gov/details/${encodeURIComponent(details.nasa_id ?? "")}`,
    };
  }));
  return response("nasa", results);
}

async function searchTmdb(query: string): Promise<SourceResponse> {
  if (!TMDB_API_KEY && !TMDB_API_TOKEN) return response("tmdb", [], {
    state: "setup",
    message: "TMDB needs an API key in Supabase.",
    actionUrl: `https://www.themoviedb.org/search?query=${encodeURIComponent(query)}`,
  });
  const parameters = new URLSearchParams({ query, include_adult: "false", language: "en-US", page: "1" });
  if (TMDB_API_KEY) parameters.set("api_key", TMDB_API_KEY);
  const data = await fetchJson(`https://api.themoviedb.org/3/search/multi?${parameters}`, {
    headers: TMDB_API_TOKEN ? { Authorization: `Bearer ${TMDB_API_TOKEN}`, accept: "application/json" } : { accept: "application/json" },
  });
  const results = compact((data?.results ?? []).filter((item: Record<string, any>) => ["movie", "tv", "person"].includes(item.media_type)).slice(0, 4).map((item: Record<string, any>) => ({
    source: "tmdb",
    sourceLabel: sourceLabels.tmdb,
    title: cleanText(item.title || item.name, 180),
    description: cleanText(item.overview || item.known_for_department),
    meta: cleanText([item.media_type, String(item.release_date || item.first_air_date || "").slice(0, 4)].filter(Boolean).join(" · "), 80),
    image: item.poster_path || item.profile_path ? `https://image.tmdb.org/t/p/w342${item.poster_path || item.profile_path}` : undefined,
    url: `https://www.themoviedb.org/${encodeURIComponent(item.media_type)}/${encodeURIComponent(item.id)}`,
  })));
  return response("tmdb", results);
}

async function searchOpenLibrary(query: string): Promise<SourceResponse> {
  const parameters = new URLSearchParams({ q: query, limit: "4", fields: "key,title,author_name,first_publish_year,cover_i" });
  const data = await fetchJson(`https://openlibrary.org/search.json?${parameters}`, { headers: { "User-Agent": "AnthonyAmaruPersonalSearch/1.0 (https://anthonyamaru.com)" } });
  const results = compact((data?.docs ?? []).map((book: Record<string, any>) => ({
    source: "open-library",
    sourceLabel: sourceLabels["open-library"],
    title: cleanText(book.title, 180),
    description: cleanText(Array.isArray(book.author_name) ? book.author_name.slice(0, 3).join(", ") : ""),
    meta: cleanText(book.first_publish_year ? `First published ${book.first_publish_year}` : "", 80),
    image: book.cover_i ? `https://covers.openlibrary.org/b/id/${encodeURIComponent(book.cover_i)}-M.jpg` : undefined,
    url: `https://openlibrary.org${String(book.key ?? "")}`,
  })));
  return response("open-library", results);
}

async function searchCountries(query: string): Promise<SourceResponse> {
  if (!REST_COUNTRIES_API_KEY) return response("rest-countries", [], {
    state: "setup",
    message: "REST Countries needs a free API key in Supabase.",
    actionUrl: "https://restcountries.com/countries",
  });
  const data = await fetchJson(`https://api.restcountries.com/countries/v5?q=${encodeURIComponent(query)}&limit=4`, {
    headers: { Authorization: `Bearer ${REST_COUNTRIES_API_KEY}` },
  });
  const countries = data?.data?.objects ?? [];
  const results = compact(countries.map((country: Record<string, any>) => ({
    source: "rest-countries",
    sourceLabel: sourceLabels["rest-countries"],
    title: cleanText(country.names?.common, 180),
    description: cleanText([country.capitals?.[0]?.name, country.region].filter(Boolean).join(" · ")),
    meta: cleanText([country.flag?.emoji, country.population ? `${Number(country.population).toLocaleString("en-US")} people` : ""].filter(Boolean).join(" · "), 100),
    url: "https://restcountries.com/countries",
  })));
  return response("rest-countries", results);
}

async function searchMusicBrainz(query: string): Promise<SourceResponse> {
  const parameters = new URLSearchParams({ query, fmt: "json", limit: "4" });
  const data = await fetchJson(`https://musicbrainz.org/ws/2/recording/?${parameters}`, {
    headers: { "User-Agent": "AnthonyAmaruPersonalSearch/1.0 (https://anthonyamaru.com)" },
  });
  const results = compact((data?.recordings ?? []).map((recording: Record<string, any>) => ({
    source: "musicbrainz",
    sourceLabel: sourceLabels.musicbrainz,
    title: cleanText(recording.title, 180),
    description: cleanText((recording["artist-credit"] ?? []).map((credit: Record<string, any>) => credit.name).filter(Boolean).join(", ")),
    meta: cleanText(recording["first-release-date"] ? `First released ${recording["first-release-date"]}` : "", 90),
    url: `https://musicbrainz.org/recording/${encodeURIComponent(recording.id ?? "")}`,
  })));
  return response("musicbrainz", results);
}

const searchers: Record<SourceId, (query: string) => Promise<SourceResponse>> = {
  wikimedia: searchWikimedia,
  youtube: searchYouTube,
  nasa: searchNasa,
  tmdb: searchTmdb,
  "open-library": searchOpenLibrary,
  "rest-countries": searchCountries,
  musicbrainz: searchMusicBrainz,
};

function sourceActionUrl(id: SourceId, query: string) {
  const encoded = encodeURIComponent(query);
  return {
    wikimedia: `https://en.wikipedia.org/wiki/Special:Search?search=${encoded}`,
    youtube: `https://www.youtube.com/results?search_query=${encoded}`,
    nasa: `https://images.nasa.gov/search?q=${encoded}`,
    tmdb: `https://www.themoviedb.org/search?query=${encoded}`,
    "open-library": `https://openlibrary.org/search?q=${encoded}`,
    "rest-countries": "https://restcountries.com/countries",
    musicbrainz: `https://musicbrainz.org/search?query=${encoded}&type=recording&method=indexed`,
  }[id];
}

export default {
  async fetch(request: Request) {
    if (request.method === "OPTIONS") return new Response("ok", { headers: corsHeaders(request) });
    if (request.method !== "POST") return json(request, { error: "Method not allowed." }, 405);
    if (!(await authenticatedAdmin(request))) return json(request, { error: "Administrator authentication is required." }, 401);

    let body: Record<string, unknown>;
    try { body = await request.json(); } catch { return json(request, { error: "A JSON request body is required." }, 400); }
    const query = cleanText(body.query, 120);
    const requestedSource = String(body.source ?? "all");
    if (query.length < 2) return json(request, { error: "Enter at least two characters." }, 400);
    if (requestedSource !== "all" && !(requestedSource in searchers)) return json(request, { error: "Unsupported search source." }, 400);

    const ids = (requestedSource === "all" ? Object.keys(searchers) : [requestedSource]) as SourceId[];
    const settled = await Promise.allSettled(ids.map((id) => searchers[id](query)));
    const sources = settled.map((item, index): SourceResponse => item.status === "fulfilled" ? item.value : response(ids[index], [], {
      state: "error",
      message: `${sourceLabels[ids[index]]} is temporarily unavailable.`,
      actionUrl: sourceActionUrl(ids[index], query),
    }));
    return json(request, {
      query,
      results: sources.flatMap((source) => source.results),
      sources: sources.map(({ results, ...source }) => ({ ...source, count: results.length })),
    });
  },
};
