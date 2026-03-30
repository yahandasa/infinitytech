import { Router } from "express";
import { supabaseAdmin } from "../lib/supabase";
import { z } from "zod";

const router = Router();

const contactSchema = z.object({
  name:    z.string().min(2).max(100),
  email:   z.string().email().max(200),
  subject: z.string().min(5).max(200),
  message: z.string().min(10).max(5000),
});

router.post("/contact", async (req, res) => {
  const parsed = contactSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid input", details: parsed.error.issues });
  }

  const { name, email, subject, message } = parsed.data;

  const { error } = await supabaseAdmin
    .from("contact_messages")
    .insert({ name, email, subject, message });

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.json({ ok: true });
});

export default router;
