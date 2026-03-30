import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { DbProject } from "@/lib/supabase-types";
import type { Project } from "@/data/projects";

function dbToProject(row: DbProject): Project {
  return {
    id: row.id,
    title: row.title_en,
    titleAr: row.title_ar,
    description: row.description_en,
    descriptionAr: row.description_ar,
    tags: row.tags ?? [],
    overview: row.overview_en ?? "",
    overviewAr: row.overview_ar ?? "",
    problem: row.problem_en ?? "",
    problemAr: row.problem_ar ?? "",
    solution: row.solution_en ?? "",
    solutionAr: row.solution_ar ?? "",
    codeSnippet: row.code_snippet ?? "",
    language: row.language ?? "c",
    timeline: (row.timeline as Project["timeline"]) ?? [],
    githubUrl: row.github_url ?? "",
    status: row.status,
    files: (row.files as Project["files"]) ?? [],
    media: buildMedia(row),
    updates: (row.updates as Project["updates"]) ?? [],
  };
}

function buildMedia(row: DbProject): Project["media"] {
  const items: Project["media"] = [];

  if (row.video_url) {
    items.push({
      id: "hero-video",
      type: "video",
      url: row.video_url,
      caption: "Project demo video",
      captionAr: "فيديو المشروع",
      thumbnail: row.thumbnail_url ?? undefined,
    });
  }

  if (row.thumbnail_url && !row.video_url) {
    items.push({
      id: "hero-thumb",
      type: "image",
      url: row.thumbnail_url,
      caption: "Project thumbnail",
      captionAr: "صورة المشروع",
    });
  }

  const extra = (row.media as Project["media"]) ?? [];
  return [...items, ...extra];
}

export function useProjects() {
  return useQuery({
    queryKey: ["projects"],
    queryFn: async (): Promise<Project[]> => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw new Error(error.message);
      return (data as DbProject[]).map(dbToProject);
    },
    staleTime: 60_000,
  });
}

export function useProject(id: string) {
  return useQuery({
    queryKey: ["projects", id],
    queryFn: async (): Promise<Project | null> => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("id", id)
        .single();

      if (error || !data) throw new Error("Project not found");
      return dbToProject(data as DbProject);
    },
    enabled: !!id,
    staleTime: 60_000,
  });
}

export interface ContactFormPayload {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export async function submitContactForm(data: ContactFormPayload) {
  const apiBase = import.meta.env.VITE_API_URL || "";
  const res = await fetch(`${apiBase}/api/contact`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || "Failed to send message");
  }
  return { success: true };
}
