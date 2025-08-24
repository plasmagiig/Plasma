import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import GiigPlayer from "@/components/giig-player";

export default function Giig() {
  const { data: content } = useQuery<any[]>({
    queryKey: ["/api/content"],
  });

  // Filter for giig content (short videos)
  const giigs = content?.filter((item: any) => item.type === "giig") || [];

  return (
    <main className="min-h-screen bg-gradient-to-br from-plasma-dark via-plasma-surface to-plasma-dark pb-20">
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-plasma-blue to-plasma-purple bg-clip-text text-transparent mb-6">
          Giig
        </h1>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {giigs.map((giig: any) => (
            <Card key={giig.id} className="glass-morphism overflow-hidden">
              <CardContent className="p-0">
                <GiigPlayer
                  src={giig.fileUrl || "/placeholder-video.mp4"}
                  onClose={() => {}}
                  data-testid={`giig-${giig.id}`}
                />
              </CardContent>
            </Card>
          ))}
        </div>
        
        {giigs.length === 0 && (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold text-gray-400 mb-2">No Giigs Yet</h2>
            <p className="text-gray-500">Be the first to create a giig!</p>
          </div>
        )}
      </div>
    </main>
  );
}