import { Router } from "express";
import { supabaseAdmin } from "../lib/supabase";
import { getUploadSignature } from "../lib/cloudinary";
import { autoTranslateFields, translate } from "../lib/translate";

const router = Router();

function requireAdmin(req: any, res: any, next: any) {
  const pin = req.headers["x-admin-pin"];
  const validPin = process.env.ADMIN_PIN || "admin2024";
  if (!pin || pin !== validPin) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
}

const ALLOWED_WRITE_FIELDS = new Set([
  "title_en", "title_ar", "description_en", "description_ar",
  "overview_en", "overview_ar", "problem_en", "problem_ar",
  "solution_en", "solution_ar", "thumbnail_url", "video_url",
  "assets_zip_url", "tags", "status", "github_url", "language",
  "code_snippet", "timeline", "files", "media", "updates",
]);

function sanitizeBody(body: Record<string, unknown>) {
  const out: Record<string, unknown> = {};
  for (const key of ALLOWED_WRITE_FIELDS) {
    if (key in body) out[key] = body[key];
  }
  return out;
}

// GET /api/projects — public
router.get("/projects", async (_req, res) => {
  try {
    const { data, error } = await supabaseAdmin
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    res.json({ projects: data });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/projects/:id — public
router.get("/projects/:id", async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin
      .from("projects")
      .select("*")
      .eq("id", req.params.id)
      .single();

    if (error || !data) return res.status(404).json({ error: "Project not found" });
    res.json({ project: data });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/projects — admin only
router.post("/projects", requireAdmin, async (req, res) => {
  try {
    let body = sanitizeBody(req.body) as any;
    if (!body.title_en && !body.title_ar) {
      return res.status(400).json({ error: "title_en or title_ar is required" });
    }

    body = await autoTranslateFields(body);

    const { data, error } = await supabaseAdmin
      .from("projects")
      .insert({
        ...body,
        tags: body.tags || [],
        status: body.status || "active",
      })
      .select()
      .single();

    if (error) throw error;
    res.status(201).json({ project: data });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/projects/:id — admin only
router.patch("/projects/:id", requireAdmin, async (req, res) => {
  try {
    let body = sanitizeBody(req.body) as any;
    if (Object.keys(body).length === 0) {
      return res.status(400).json({ error: "No valid fields to update" });
    }

    body = await autoTranslateFields(body);

    const { data, error } = await supabaseAdmin
      .from("projects")
      .update(body)
      .eq("id", req.params.id)
      .select()
      .single();

    if (error) throw error;
    res.json({ project: data });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/projects/:id/translate — admin only
// Back-fills missing AR fields for an existing project
router.post("/projects/:id/translate", requireAdmin, async (req, res) => {
  try {
    const { data: existing, error: fetchErr } = await supabaseAdmin
      .from("projects")
      .select("*")
      .eq("id", req.params.id)
      .single();

    if (fetchErr || !existing) return res.status(404).json({ error: "Project not found" });

    const fields = {
      title_en: existing.title_en,
      title_ar: existing.title_ar || "",
      description_en: existing.description_en,
      description_ar: existing.description_ar || "",
      overview_en: existing.overview_en,
      overview_ar: existing.overview_ar || "",
      problem_en: existing.problem_en,
      problem_ar: existing.problem_ar || "",
      solution_en: existing.solution_en,
      solution_ar: existing.solution_ar || "",
    } as any;

    const translated = await autoTranslateFields(fields);

    const { data, error } = await supabaseAdmin
      .from("projects")
      .update(translated)
      .eq("id", req.params.id)
      .select()
      .single();

    if (error) throw error;
    res.json({ project: data, translated: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/projects/:id — admin only
router.delete("/projects/:id", requireAdmin, async (req, res) => {
  try {
    const { error } = await supabaseAdmin
      .from("projects")
      .delete()
      .eq("id", req.params.id);

    if (error) throw error;
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/projects/upload-signature — admin only
router.post("/projects/upload-signature", requireAdmin, async (req, res) => {
  try {
    const { folder, publicId } = req.body as { folder?: string; publicId?: string };
    const sig = getUploadSignature(folder || "infinity-tech", publicId);
    res.json(sig);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
