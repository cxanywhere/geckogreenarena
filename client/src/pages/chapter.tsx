import { useRoute, Link, useLocation } from "wouter";
import { Nav } from "@/components/nav";
import { CHAPTERS } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle, Download, FileText } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function ChapterPage() {
  const [, params] = useRoute("/chapter/:id");
  const [, setLocation] = useLocation();
  const chapter = CHAPTERS.find(c => c.id === params?.id);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    // Check if this chapter is already completed
    const completedChapters = JSON.parse(localStorage.getItem("completed_chapters") || "[]");
    if (chapter && completedChapters.includes(chapter.id)) {
      setIsCompleted(true);
    }
  }, [chapter]);

  const handleComplete = () => {
    if (chapter) {
      const completedChapters = JSON.parse(localStorage.getItem("completed_chapters") || "[]");
      if (!completedChapters.includes(chapter.id)) {
        completedChapters.push(chapter.id);
        localStorage.setItem("completed_chapters", JSON.stringify(completedChapters));
      }
      setIsCompleted(true);
      toast.success("Chapter completed! Roleplays unlocked.");
      
      // Short delay before redirecting
      setTimeout(() => {
        setLocation("/dashboard");
      }, 1000);
    }
  };

  if (!chapter) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Chapter Not Found</h1>
          <Link href="/">
            <Button>Return Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/20 flex flex-col">
      <Nav />
      
      <div className="flex-1 container mx-auto px-4 py-8 flex flex-col h-full">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="icon" className="rounded-full">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                <FileText className="h-4 w-4" />
                <span>Training Module</span>
              </div>
              <h1 className="text-2xl font-display font-bold text-foreground">{chapter.title}</h1>
            </div>
          </div>

          <div className="flex gap-3">
             <Button variant="outline" asChild>
              <a href={chapter.pdfUrl} target="_blank" rel="noopener noreferrer">
                <Download className="mr-2 h-4 w-4" />
                Download PDF
              </a>
            </Button>
            <Button 
              className={`text-white hover:bg-primary/90 ${isCompleted ? 'bg-green-600 hover:bg-green-700' : 'bg-primary'}`}
              onClick={handleComplete}
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              {isCompleted ? "Completed" : "Mark as Complete"}
            </Button>
          </div>
        </div>

        <div className="flex-1 bg-white rounded-xl border border-border shadow-sm overflow-hidden relative">
          <iframe 
            src={`${chapter.pdfUrl}#toolbar=0&navpanes=0&scrollbar=0`}
            className="w-full h-full absolute inset-0"
            title={chapter.title}
          />
        </div>
        
        <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-lg text-blue-900 text-sm">
          <strong>Tip:</strong> Read through the entire slide deck before starting the roleplay scenarios. Key vocabulary and objection handling techniques are covered in slides 10-15.
        </div>
      </div>
    </div>
  );
}
