import { Nav } from "@/components/nav";
import { TRAINING_RESOURCES } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlayCircle, Mic, Clock, User, BookOpen, Headphones, Film } from "lucide-react";

export default function ResourcesPage() {
  const calls = TRAINING_RESOURCES.filter(r => r.type === 'call');
  const videos = TRAINING_RESOURCES.filter(r => r.type === 'video');

  return (
    <div className="min-h-screen bg-muted/20 flex flex-col">
      <Nav />
      <div className="container mx-auto px-4 py-8 flex-1">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">Training Library</h1>
            <p className="text-muted-foreground">Access recordings of top performers and exclusive training content.</p>
          </div>
        </div>

        <Tabs defaultValue="calls" className="w-full">
          <TabsList className="bg-white border border-border p-1 rounded-xl mb-8 w-full max-w-md mx-auto grid grid-cols-2">
            <TabsTrigger value="calls" className="rounded-lg data-[state=active]:bg-magenta/10 data-[state=active]:text-magenta font-bold flex items-center justify-center gap-2">
              <Headphones className="w-4 h-4" /> Top Sales Calls
            </TabsTrigger>
            <TabsTrigger value="videos" className="rounded-lg data-[state=active]:bg-magenta/10 data-[state=active]:text-magenta font-bold flex items-center justify-center gap-2">
              <Film className="w-4 h-4" /> Training Videos
            </TabsTrigger>
          </TabsList>

          <TabsContent value="calls">
            <div className="grid grid-cols-1 gap-4">
              {calls.map((resource) => (
                <div key={resource.id} className="bg-white rounded-2xl border border-border p-6 shadow-sm hover:border-magenta/50 transition-all group">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 rounded-full bg-magenta/10 flex items-center justify-center text-magenta group-hover:scale-110 transition-transform">
                        <PlayCircle className="w-8 h-8" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
                        <h3 className="text-lg font-bold font-display text-foreground group-hover:text-magenta transition-colors">
                          {resource.title}
                        </h3>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1 bg-muted px-2 py-1 rounded-md">
                            <User className="w-3 h-3" /> {resource.author}
                          </span>
                          <span className="flex items-center gap-1 bg-muted px-2 py-1 rounded-md">
                            <Clock className="w-3 h-3" /> {resource.duration}
                          </span>
                        </div>
                      </div>
                      
                      <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
                        {resource.description}
                      </p>
                      
                      <div className="bg-green-50 border border-green-100 rounded-lg p-3 mb-4">
                        <div className="flex items-start gap-2">
                          <BookOpen className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <span className="text-xs font-bold text-green-700 uppercase tracking-wider block mb-1">What You'll Learn</span>
                            <p className="text-sm text-green-800">{resource.learningOutcome}</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {resource.tags.map(tag => (
                          <span key={tag} className="text-xs font-medium px-2 py-1 bg-muted rounded-full text-muted-foreground border border-border">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                       <Button className="w-full md:w-auto">Listen Now</Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="videos">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.map((resource) => (
                <div key={resource.id} className="bg-white rounded-2xl border border-border overflow-hidden shadow-sm hover:shadow-lg transition-all group">
                  <div className="aspect-video bg-muted relative overflow-hidden">
                    {resource.thumbnail && (
                      <img src={resource.thumbnail} alt={resource.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    )}
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/50 group-hover:scale-110 transition-transform">
                        <PlayCircle className="w-6 h-6 text-white fill-white/20" />
                      </div>
                    </div>
                    <div className="absolute bottom-3 right-3 bg-black/80 text-white text-xs font-bold px-2 py-1 rounded-md backdrop-blur-md">
                      {resource.duration}
                    </div>
                  </div>
                  
                  <div className="p-5 flex flex-col h-full">
                    <h3 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-magenta transition-colors">
                      {resource.title}
                    </h3>
                    
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-1">
                      {resource.description}
                    </p>

                    <div className="bg-green-50 border border-green-100 rounded-lg p-3 mb-4">
                        <div className="flex items-start gap-2">
                          <BookOpen className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <span className="text-xs font-bold text-green-700 uppercase tracking-wider block mb-1">Key Takeaway</span>
                            <p className="text-xs text-green-800 line-clamp-2">{resource.learningOutcome}</p>
                          </div>
                        </div>
                      </div>
                    
                    <Button variant="outline" className="w-full group-hover:border-magenta group-hover:text-magenta">Watch Training</Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}