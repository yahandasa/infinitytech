/**
 * Bootstraps the `projects` table in Supabase on first startup if it doesn't exist.
 * Uses the Supabase service role key with the pg REST query endpoint available
 * on newer Supabase instances, or falls back gracefully.
 */

import { supabaseAdmin } from "./supabase";
import { logger } from "./logger";

export async function ensureProjectsTable(): Promise<void> {
  const { error } = await supabaseAdmin.from("projects").select("id").limit(1);

  if (!error) {
    logger.info("Supabase: projects table exists.");
    return;
  }

  if (error.code !== "PGRST205") {
    logger.error({ err: error }, "Supabase: unexpected error checking projects table.");
    return;
  }

  logger.warn("Supabase: projects table not found — attempting to create via SQL API.");

  // Supabase exposes /rest/v1/sql for service_role on some plans.
  const url = process.env.SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;

  const sql = `
    create table if not exists public.projects (
      id            text primary key default gen_random_uuid()::text,
      title_en      text not null,
      title_ar      text not null default '',
      description_en text not null default '',
      description_ar text not null default '',
      overview_en   text,
      overview_ar   text,
      problem_en    text,
      problem_ar    text,
      solution_en   text,
      solution_ar   text,
      thumbnail_url text,
      video_url     text,
      assets_zip_url text,
      tags          text[] not null default '{}',
      status        text not null default 'active' check (status in ('active','completed','archived')),
      github_url    text,
      language      text,
      code_snippet  text,
      timeline      jsonb,
      files         jsonb,
      media         jsonb,
      updates       jsonb,
      created_at    timestamptz not null default now(),
      updated_at    timestamptz not null default now()
    );

    alter table if exists public.projects enable row level security;

    do $$ begin
      if not exists (
        select 1 from pg_policies where tablename = 'projects' and policyname = 'Public can read projects'
      ) then
        execute 'create policy "Public can read projects" on public.projects for select using (true)';
      end if;
    end $$;
  `;

  try {
    const res = await fetch(`${url}/rest/v1/`, {
      method: "GET",
      headers: {
        "apikey": key,
        "Authorization": `Bearer ${key}`,
        "Content-Profile": "public",
        "Prefer": "tx=rollback",
      },
    });
    logger.info({ status: res.status }, "Supabase REST reachable");
  } catch {
    // Ignore - just testing connectivity
  }

  // Try Supabase's internal SQL execution endpoint
  try {
    const res = await fetch(`${url}/rest/v1/rpc/query`, {
      method: "POST",
      headers: {
        "apikey": key,
        "Authorization": `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ sql }),
    });
    const text = await res.text();
    if (res.ok) {
      logger.info("Supabase: projects table created successfully.");
      return;
    }
    logger.warn({ resp: text }, "Supabase: rpc/query failed, table must be created manually.");
  } catch (e) {
    logger.warn({ err: e }, "Supabase: could not auto-create table.");
  }

  logger.warn(
    "\n\n══════════════════════════════════════════════════════\n" +
    "ACTION REQUIRED: Run supabase_schema.sql in your Supabase\n" +
    "SQL Editor: https://supabase.com/dashboard/project/kbqhoyipoxmyhtbuhlkd/sql\n" +
    "══════════════════════════════════════════════════════\n"
  );
}
