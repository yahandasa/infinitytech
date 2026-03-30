/**
 * ONE-TIME setup endpoint — creates the projects table in Supabase.
 * Protected by ADMIN_PIN. Remove or disable after first run.
 */
import { Router } from "express";
import pg from "pg";

const router = Router();
const { Client } = pg;

function requireAdmin(req: any, res: any, next: any) {
  const pin = req.headers["x-admin-pin"];
  const validPin = process.env.ADMIN_PIN || "admin2024";
  if (pin !== validPin) return res.status(401).json({ error: "Unauthorized" });
  next();
}

const SCHEMA_SQL = `
create table if not exists public.contact_messages (
  id         bigserial primary key,
  name       text not null,
  email      text not null,
  subject    text not null,
  message    text not null,
  is_read    boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.contact_messages enable row level security;

do $cm$ begin
  if not exists (select 1 from pg_policies where tablename='contact_messages' and policyname='Service role full access on contact_messages') then
    execute 'create policy "Service role full access on contact_messages" on public.contact_messages using (auth.role() = ''service_role'') with check (auth.role() = ''service_role'')';
  end if;
end $cm$;

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

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

drop trigger if exists projects_updated_at on public.projects;
create trigger projects_updated_at
  before update on public.projects
  for each row execute procedure public.set_updated_at();

alter table public.projects enable row level security;

do $pol$ begin
  if not exists (select 1 from pg_policies where tablename='projects' and policyname='Public can read projects') then
    execute 'create policy "Public can read projects" on public.projects for select using (true)';
  end if;
  if not exists (select 1 from pg_policies where tablename='projects' and policyname='Service role can insert') then
    execute 'create policy "Service role can insert" on public.projects for insert with check (auth.role() = ''service_role'')';
  end if;
  if not exists (select 1 from pg_policies where tablename='projects' and policyname='Service role can update') then
    execute 'create policy "Service role can update" on public.projects for update using (auth.role() = ''service_role'')';
  end if;
  if not exists (select 1 from pg_policies where tablename='projects' and policyname='Service role can delete') then
    execute 'create policy "Service role can delete" on public.projects for delete using (auth.role() = ''service_role'')';
  end if;
end $pol$;
`;

router.post("/setup/schema", requireAdmin, async (_req, res) => {
  const password = process.env.SUPABASE_DB_PASSWORD;
  if (!password) {
    return res.status(500).json({ error: "SUPABASE_DB_PASSWORD not set" });
  }

  const client = new Client({
    host: "db.kbqhoyipoxmyhtbuhlkd.supabase.co",
    port: 5432,
    database: "postgres",
    user: "postgres",
    password,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 10000,
  });

  try {
    await client.connect();
    await client.query(SCHEMA_SQL);
    await client.end();
    return res.json({ ok: true, message: "Schema created successfully" });
  } catch (err: any) {
    try { await client.end(); } catch {}
    return res.status(500).json({ error: err.message });
  }
});

export default router;
