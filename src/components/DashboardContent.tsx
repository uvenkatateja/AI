
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ImageUploader from "@/components/ImageUploader";
import { Sparkles, Upload, History, Heart } from "lucide-react";

interface DashboardContentProps {
  onStyleDetected?: (style: string) => void;
}

export default function DashboardContent({ onStyleDetected }: DashboardContentProps) {
  const [activeTab, setActiveTab] = useState("upload");

  return (
    <div className="container px-4 py-6 max-w-6xl mx-auto">
      <section className="mb-8">
        <h1 className="text-3xl font-serif font-bold tracking-tight mb-2">Style Dashboard</h1>
        <p className="text-muted-foreground">Upload clothing images and let our AI analyze your style.</p>
      </section>

      <Tabs defaultValue="upload" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-3 gap-4">
          <TabsTrigger value="upload" className="flex gap-2 items-center">
            <Upload size={16} />
            <span>Upload</span>
          </TabsTrigger>
          <TabsTrigger value="history" className="flex gap-2 items-center">
            <History size={16} />
            <span>History</span>
          </TabsTrigger>
          <TabsTrigger value="favorites" className="flex gap-2 items-center">
            <Heart size={16} />
            <span>Favorites</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-fashion-blush" /> 
                Style Analysis
              </CardTitle>
              <CardDescription>
                Upload your clothing item to receive personalized style recommendations.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ImageUploader onStyleDetected={onStyleDetected} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Analyses</CardTitle>
              <CardDescription>
                View your previously analyzed items.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">You haven't analyzed any items yet.</p>
                  <Button onClick={() => setActiveTab("upload")}>Upload Your First Item</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="favorites" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Your Favorite Styles</CardTitle>
              <CardDescription>
                Items and styles you've saved for future reference.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">You haven't saved any favorites yet.</p>
                  <Button onClick={() => setActiveTab("upload")} variant="outline">Upload an Item</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
