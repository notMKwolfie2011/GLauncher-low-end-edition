
import { useCallback } from "react";
import { Upload, X, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface FileUploaderProps {
  onFileUpload: (file: File) => void;
  uploadedFile: File | null;
  onClearFile: () => void;
}

const FileUploader = ({ onFileUpload, uploadedFile, onClearFile }: FileUploaderProps) => {
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const files = Array.from(e.dataTransfer.files);
      const htmlFile = files.find(file => file.type === "text/html" || file.name.endsWith(".html"));
      
      if (htmlFile) {
        onFileUpload(htmlFile);
      }
    },
    [onFileUpload]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file && (file.type === "text/html" || file.name.endsWith(".html"))) {
        onFileUpload(file);
      }
    },
    [onFileUpload]
  );

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Upload HTML File
        </CardTitle>
      </CardHeader>
      <CardContent className="h-full">
        {!uploadedFile ? (
          <div
            className="border-2 border-dashed border-border rounded-lg p-8 text-center h-full flex flex-col justify-center items-center hover:border-primary/50 transition-colors cursor-pointer"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => document.getElementById("file-input")?.click()}
          >
            <Upload className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Drop your HTML file here</h3>
            <p className="text-muted-foreground mb-4">
              Or click to browse and select an HTML file
            </p>
            <Button variant="outline">
              Choose File
            </Button>
            <input
              id="file-input"
              type="file"
              accept=".html,text/html"
              onChange={handleFileSelect}
              className="hidden"
            />
            <p className="text-xs text-muted-foreground mt-4">
              Supports .html files only
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-secondary rounded-lg">
              <div className="flex items-center gap-3">
                <FileText className="h-8 w-8 text-primary" />
                <div>
                  <p className="font-medium">{uploadedFile.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(uploadedFile.size / 1024).toFixed(1)} KB
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={onClearFile}
                className="hover:bg-destructive hover:text-destructive-foreground"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="p-4 bg-card rounded-lg border">
              <h4 className="font-medium mb-2">File Information</h4>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p><span className="font-medium">Name:</span> {uploadedFile.name}</p>
                <p><span className="font-medium">Size:</span> {(uploadedFile.size / 1024).toFixed(1)} KB</p>
                <p><span className="font-medium">Type:</span> {uploadedFile.type || "text/html"}</p>
                <p><span className="font-medium">Last Modified:</span> {new Date(uploadedFile.lastModified).toLocaleDateString()}</p>
              </div>
            </div>

            <Button
              onClick={() => document.getElementById("file-input")?.click()}
              variant="outline"
              className="w-full"
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload Different File
            </Button>
            <input
              id="file-input"
              type="file"
              accept=".html,text/html"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FileUploader;
