
import { useState } from "react";
import FileUploader from "@/components/FileUploader";
import HTMLViewer from "@/components/HTMLViewer";

const Index = () => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [htmlContent, setHtmlContent] = useState<string>("");

  const handleFileUpload = (file: File) => {
    setUploadedFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setHtmlContent(content);
    };
    reader.readAsText(file);
  };

  const handleClearFile = () => {
    setUploadedFile(null);
    setHtmlContent("");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            HTML File Viewer
          </h1>
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
    </div>
  );
};

export default Index;
