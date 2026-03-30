import { useState } from "react";
import { motion } from "framer-motion";
import { SEO } from "@/components/SEO";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Github, Linkedin, Mail, MapPin, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { submitContactForm } from "@/hooks/use-projects";

const formSchema = z.object({
  name: z.string().min(2, "Name is too short"),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(5, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters")
});

type FormValues = z.infer<typeof formSchema>;

export function Contact() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: ""
    }
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      await submitContactForm(data);
      toast({
        title: "Message Sent",
        description: "Thanks for reaching out! I'll get back to you soon.",
      });
      form.reset();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Something went wrong. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full pt-32 pb-24 relative">
      <SEO
        title="Contact"
        description="Get in touch with Fares Salah for hardware engineering consulting, PCB design projects, or technical collaboration opportunities."
        keywords="contact hardware engineer, PCB design consulting, embedded systems consulting, hire hardware engineer"
      />
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-primary/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-black text-foreground mb-4">
            Initialize <span className="text-primary">Connection</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Whether you have a specific project, an open role, or just want to talk tech—drop a message below.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 max-w-5xl mx-auto">
          
          {/* Contact Info */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-4 space-y-8"
          >
            <div className="p-6 rounded-2xl bg-card border border-border">
              <h3 className="text-lg font-bold text-foreground mb-6">Direct Channels</h3>
              
              <div className="space-y-6">
                <a href="mailto:hello@infinitytech.dev" className="flex items-start gap-4 group">
                  <div className="p-3 rounded-xl bg-background border border-border group-hover:border-primary/50 group-hover:text-primary transition-colors">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Email</p>
                    <p className="text-sm text-muted-foreground">hello@infinitytech.dev</p>
                  </div>
                </a>
                
                <div className="flex items-start gap-4 group">
                  <div className="p-3 rounded-xl bg-background border border-border">
                    <MapPin className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Location</p>
                    <p className="text-sm text-muted-foreground">San Francisco, CA<br/>(Open to Remote)</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-card border border-border">
              <h3 className="text-lg font-bold text-foreground mb-6">Social Networks</h3>
              <div className="flex gap-4">
                <a href="https://github.com/infinitytech-dev" target="_blank" rel="noopener noreferrer" className="flex-1 flex flex-col items-center justify-center p-4 rounded-xl bg-background border border-border hover:border-primary/50 hover:text-primary transition-all hover:-translate-y-1">
                  <Github className="w-6 h-6 mb-2" />
                  <span className="text-xs font-medium">GitHub</span>
                </a>
                <a href="https://linkedin.com/in/fares-salah-eng" target="_blank" rel="noopener noreferrer" className="flex-1 flex flex-col items-center justify-center p-4 rounded-xl bg-background border border-border hover:border-primary/50 hover:text-primary transition-all hover:-translate-y-1">
                  <Linkedin className="w-6 h-6 mb-2" />
                  <span className="text-xs font-medium">LinkedIn</span>
                </a>
              </div>
            </div>
          </motion.div>

          {/* Form */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-8 p-8 md:p-10 rounded-2xl bg-card border border-border relative overflow-hidden"
          >
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 relative z-10">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Name</label>
                  <input 
                    {...form.register("name")}
                    className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                    placeholder="John Doe"
                  />
                  {form.formState.errors.name && (
                    <p className="text-xs text-destructive">{form.formState.errors.name.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Email</label>
                  <input 
                    {...form.register("email")}
                    className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                    placeholder="john@example.com"
                  />
                  {form.formState.errors.email && (
                    <p className="text-xs text-destructive">{form.formState.errors.email.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Subject</label>
                <input 
                  {...form.register("subject")}
                  className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                  placeholder="Project Inquiry"
                />
                {form.formState.errors.subject && (
                  <p className="text-xs text-destructive">{form.formState.errors.subject.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Message</label>
                <textarea 
                  {...form.register("message")}
                  rows={6}
                  className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all resize-none"
                  placeholder="How can we build the future together?"
                />
                {form.formState.errors.message && (
                  <p className="text-xs text-destructive">{form.formState.errors.message.message}</p>
                )}
              </div>

              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-8 py-4 bg-primary text-primary-foreground font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-primary/90 hover:shadow-[0_0_20px_hsla(188,86%,53%,0.3)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 rounded-full border-2 border-primary-foreground border-t-transparent animate-spin" />
                ) : (
                  <>Send Message <Send className="w-4 h-4" /></>
                )}
              </button>
            </form>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
