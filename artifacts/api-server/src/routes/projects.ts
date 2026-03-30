import { Router } from "express";
import { supabaseAdmin } from "../lib/supabase";
import { getUploadSignature } from "../lib/cloudinary";

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
    const body = sanitizeBody(req.body);
    const { title_en } = body as any;
    if (!title_en) return res.status(400).json({ error: "title_en is required" });

    const { data, error } = await supabaseAdmin
      .from("projects")
      .insert({
        ...body,
        title_ar: (body as any).title_ar || "",
        description_en: (body as any).description_en || "",
        description_ar: (body as any).description_ar || "",
        tags: (body as any).tags || [],
        status: (body as any).status || "active",
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
    const body = sanitizeBody(req.body);
    if (Object.keys(body).length === 0) {
      return res.status(400).json({ error: "No valid fields to update" });
    }

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
