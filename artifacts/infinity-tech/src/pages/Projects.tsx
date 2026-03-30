import { motion } from "framer-motion";
import { Link } from "wouter";
import { Code, Github, Terminal } from "lucide-react";
import { useProjects } from "@/hooks/use-projects";
import { SEO } from "@/components/SEO";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
};

export function Projects() {
  const { data: projects, isLoading } = useProjects();

  return (
    <div className="min-h-screen w-full pt-32 pb-24">
      <SEO
        title="Projects & Research"
        description="A comprehensive portfolio of hardware engineering work: multi-layer PCB design, embedded firmware, autonomous robotics, and edge AI systems."
        keywords="PCB projects, embedded systems portfolio, hardware engineering projects, robotics research, FPGA projects"
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-foreground mb-4">
            Projects <span className="text-primary">&</span> Research
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            A comprehensive log of my engineering work across hardware design, multi-layer PCB layout, embedded firmware, and robotics systems.
          </p>
        </motion.div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" aria-label="Loading projects" aria-busy="true">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="rounded-2xl bg-card border border-border overflow-hidden animate-pulse">
                {/* image area */}
                <div className="h-44 bg-muted/40" />
                <div className="p-5 space-y-3">
                  {/* tags row */}
                  <div className="flex gap-2">
                    <div className="h-5 w-16 rounded-full bg-muted/50" />
                    <div className="h-5 w-20 rounded-full bg-muted/50" />
                  </div>
                  {/* title */}
                  <div className="h-5 w-3/4 rounded bg-muted/50" />
                  {/* description lines */}
                  <div className="space-y-2">
                    <div className="h-3.5 w-full rounded bg-muted/35" />
                    <div className="h-3.5 w-5/6 rounded bg-muted/35" />
                    <div className="h-3.5 w-2/3 rounded bg-muted/35" />
                  </div>
                  {/* action row */}
                  <div className="flex justify-between items-center pt-2">
                    <div className="h-4 w-24 rounded bg-muted/35" />
                    <div className="h-8 w-28 rounded-lg bg-muted/40" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {projects?.map((project, idx) => (
              <motion.div
                key={project.id}
                variants={itemVariants}
                className="group flex flex-col bg-card rounded-2xl border border-border hover:border-primary/50 hover-card-anim overflow-hidden relative"
              >
                <div className="absolute top-3 right-3 z-10">
                  <span className="px-2 py-1 text-[10px] font-mono font-medium rounded bg-card/90 backdrop-blur-[8px] border border-border text-foreground">
                    {idx < 2 ? "Active" : "Completed"}
                  </span>
                </div>
                {/* Preview Image / Thumbnail */}
                <div className="h-44 w-full bg-gradient-to-br from-[#1A2330] to-[#0B0F14] relative overflow-hidden flex items-center justify-center">
                  <div className="absolute inset-0 opacity-30" style={{
                    backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(34,211,238,0.15) 1px, transparent 0)',
                    backgroundSize: '20px 20px'
                  }} />
                  <Terminal className="w-10 h-10 text-primary/30 group-hover:text-primary/50 transition-colors duration-200" />
                  <div className="absolute bottom-3 left-3 flex flex-wrap gap-1.5">
                    {project.tags.slice(0, 3).map(tag => (
                      <span key={tag} className="px-2 py-1 text-[10px] uppercase tracking-wider font-mono font-medium rounded bg-background/70 backdrop-blur-[8px] border border-border text-primary">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-bold tracking-tight text-foreground group-hover:text-primary transition-colors leading-tight">
                      {project.title}
                    </h3>
                    <a
                      href="#"
                      title="View Repository"
                      className="p-1.5 text-muted-foreground hover:text-foreground transition-colors ml-2 shrink-0"
                    >
                      <Github className="w-4 h-4" />
                    </a>
                  </div>

                  <p className="text-sm text-muted-foreground flex-grow mb-6 line-clamp-3">
                    {project.description}
                  </p>

                  <div className="flex gap-3 mt-auto">
                    <Link
                      href={`/projects/${project.id}`}
                      className="flex-1 py-2.5 text-center text-sm font-semibold rounded-lg bg-primary/10 text-primary border border-primary/20 hover:bg-primary hover:text-primary-foreground transition-colors btn-primary-glow"
                    >
                      View Details
                    </Link>
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="View Code"
                      className="flex items-center justify-center px-4 rounded-lg bg-background border border-border text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors"
                    >
                      <Code className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}