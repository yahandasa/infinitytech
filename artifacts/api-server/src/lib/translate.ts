const MYMEMORY_URL = "https://api.mymemory.translated.net/get";

function splitChunks(text: string, maxLen = 490): string[] {
  if (text.length <= maxLen) return [text];
  const chunks: string[] = [];
  let remaining = text;
  while (remaining.length > 0) {
    let end = maxLen;
    if (remaining.length > maxLen) {
      const sentenceEnd = remaining.lastIndexOf(". ", maxLen);
      if (sentenceEnd > maxLen / 2) end = sentenceEnd + 2;
    }
    chunks.push(remaining.slice(0, end).trim());
    remaining = remaining.slice(end).trim();
  }
  return chunks;
}

async function translateChunk(
  text: string,
  from: "en" | "ar",
  to: "en" | "ar",
): Promise<string> {
  try {
    const url = `${MYMEMORY_URL}?q=${encodeURIComponent(text)}&langpair=${from}|${to}`;
    const resp = await fetch(url, {
      signal: AbortSignal.timeout(8000),
      headers: { "User-Agent": "InfinityTech/1.0" },
    });
    if (!resp.ok) return text;
    const data = (await resp.json()) as any;
    const translated = data?.responseData?.translatedText;
    if (typeof translated === "string" && translated.trim()) return translated;
    return text;
  } catch {
    return text;
  }
}

export async function translate(
  text: string,
  from: "en" | "ar",
  to: "en" | "ar",
): Promise<string> {
  if (!text?.trim()) return text;
  const chunks = splitChunks(text);
  const parts = await Promise.all(chunks.map(c => translateChunk(c, from, to)));
  return parts.join(" ");
}

type LangFields = {
  title_en?: string;
  title_ar?: string;
  description_en?: string;
  description_ar?: string;
  overview_en?: string;
  overview_ar?: string;
  problem_en?: string;
  problem_ar?: string;
  solution_en?: string;
  solution_ar?: string;
};

export async function autoTranslateFields(
  body: LangFields,
): Promise<LangFields> {
  const pairs: Array<[keyof LangFields, keyof LangFields]> = [
    ["title_en", "title_ar"],
    ["description_en", "description_ar"],
    ["overview_en", "overview_ar"],
    ["problem_en", "problem_ar"],
    ["solution_en", "solution_ar"],
  ];

  const jobs = pairs.map(async ([enKey, arKey]) => {
    const enVal = body[enKey] as string | undefined;
    const arVal = body[arKey] as string | undefined;

    if (enVal && !arVal) {
      body[arKey] = await translate(enVal, "en", "ar");
    } else if (arVal && !enVal) {
      body[enKey] = await translate(arVal, "ar", "en");
    }
  });

  await Promise.all(jobs);
  return body;
}
