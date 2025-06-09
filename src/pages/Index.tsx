
import { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import FileUploader from "@/components/FileUploader";
import HTMLViewer from "@/components/HTMLViewer";
import AppSidebar from "@/components/AppSidebar";

interface SavedFile {
  id: string;
  name: string;
  content: string;
  uploadDate: string;
  size: number;
}

const Index = () => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [htmlContent, setHtmlContent] = useState<string>("");

  const handleFileUpload = (file: File) => {
    setUploadedFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setHtmlContent(content);
      
      // Save to sidebar
      if ((window as any).addFileToSidebar) {
        (window as any).addFileToSidebar(file, content);
      }
    };
    reader.readAsText(file);
  };

  const handleClearFile = () => {
    setUploadedFile(null);
    setHtmlContent("");
  };

  const handleFileSelect = (savedFile: SavedFile) => {
    // Create a virtual File object for consistency
    const virtualFile = new File([savedFile.content], savedFile.name, {
      type: "text/html",
    });
    
    setUploadedFile(virtualFile);
    setHtmlContent(savedFile.content);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar 
          onFileSelect={handleFileSelect}
          currentFileName={uploadedFile?.name}
        />
        <main className="flex-1">
          <div className="container mx-auto p-6">
            <div className="mb-8 text-center">
              <div className="flex items-center gap-2 justify-center mb-2">
                <SidebarTrigger />
                <h1 className="text-4xl font-bold text-foreground">
                  HTML File Viewer
                </h1>
              </div>
              <p className="text-muted-foreground text-lg">
                Upload and play HTML files like Eaglercraft in a convenient side panel
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-200px)]">
              {/* File Upload Section */}
              <div className="space-y-6">
                <FileUploader 
                  onFileUpload={handleFileUpload} 
                  uploadedFile={uploadedFile}
                  onClearFile={handleClearFile}
                />
              </div>

              {/* HTML Viewer Section */}
              <div className="space-y-6">
                <HTMLViewer 
                  htmlContent={htmlContent} 
                  fileName={uploadedFile?.name || ""}
                />
              </div>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Index;
