import { useRoute, Link, useLocation } from "wouter";
import { Nav } from "@/components/nav";
import { PDFViewer } from "@/components/pdf-viewer";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, FileText, CheckCircle, BookOpen, Presentation } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { api, type Chapter } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export default function ChapterPage() {
  const [, params] = useRoute("/chapter/:id");
  const [, setLocation] = useLocation();
  
  const { data: chapters = [] } = useQuery({
    queryKey: ["chapters"],
    queryFn: () => api.getChapters(),
  });

  const chapter = chapters.find(c => c.id === params?.id);
  
  const [currentPage, setCurrentPage] = useState(() => {
    if (!params?.id) return 1;
    const saved = localStorage.getItem(`chapter_pdf_progress_${params.id}`);
    return saved ? parseInt(saved) : 1;
  });

  useEffect(() => {
    if (params?.id) {
      localStorage.setItem(`chapter_pdf_progress_${params.id}`, currentPage.toString());
    }
  }, [currentPage, params?.id]);

  const handleComplete = () => {
    if (!chapter) return;
    
    const completedChapters = JSON.parse(localStorage.getItem("completed_chapters") || "[]");
    if (!completedChapters.includes(chapter.id)) {
      completedChapters.push(chapter.id);
      localStorage.setItem("completed_chapters", JSON.stringify(completedChapters));
    }
    
    const currentUser = localStorage.getItem("currentUser");
    if (currentUser) {
      const user = JSON.parse(currentUser);
      api.createProgress({
        userId: user.id,
        chapterId: chapter.id,
        completed: 1,
      }).catch(console.error);
    }
    
    toast.success("Chapter completed! Great work.");
    setTimeout(() => {
      setLocation("/dashboard");
    }, 1500);
  };

  if (!chapter) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Nav />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading chapter...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Nav />
      
      <div className="flex-1 flex flex-col max-h-[calc(100vh-64px)]">
        {/* Header */}
        <div className="border-b border-border bg-card/50 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link href="/dashboard">
                  <Button variant="ghost" size="icon" className="rounded-full" data-testid="button-back">
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                </Link>
                <div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <Presentation className="h-4 w-4" />
                    <span>Training Presentation</span>
                  </div>
                  <h1 className="text-xl md:text-2xl font-display font-bold text-foreground" data-testid="text-chapter-title">
                    {chapter.title}: {chapter.subtitle}
                  </h1>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" asChild className="hidden md:flex">
                  <a href={chapter.pdfUrl || ""} target="_blank" rel="noopener noreferrer" download>
                    <Download className="mr-2 h-4 w-4" />
                    Download PDF
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* PDF Viewer */}
        <div className="flex-1 overflow-hidden">
          {chapter.pdfUrl ? (
            <PDFViewer
              pdfUrl={chapter.pdfUrl}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
              onComplete={handleComplete}
            />
          ) : (
            <div className="flex-1 flex items-center justify-center p-8">
              <div className="text-center">
                <BookOpen className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
                <h2 className="text-xl font-bold mb-2">No Presentation Available</h2>
                <p className="text-muted-foreground mb-4">
                  This chapter's presentation is not yet available.
                </p>
                <Link href="/dashboard">
                  <Button>Return to Dashboard</Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
