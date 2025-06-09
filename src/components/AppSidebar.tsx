
import { useState, useEffect } from "react";
import { FileText, Trash2, Play } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

interface SavedFile {
  id: string;
  name: string;
  content: string;
  uploadDate: string;
  size: number;
}

interface AppSidebarProps {
  onFileSelect: (file: SavedFile) => void;
  currentFileName?: string;
}

const AppSidebar = ({ onFileSelect, currentFileName }: AppSidebarProps) => {
  const [savedFiles, setSavedFiles] = useState<SavedFile[]>([]);

  // Load saved files from localStorage on component mount
  useEffect(() => {
    const saved = localStorage.getItem("htmlViewer_savedFiles");
    if (saved) {
      try {
        setSavedFiles(JSON.parse(saved));
      } catch (error) {
        console.error("Error loading saved files:", error);
      }
    }
  }, []);

  // Save files to localStorage whenever savedFiles changes
  useEffect(() => {
    localStorage.setItem("htmlViewer_savedFiles", JSON.stringify(savedFiles));
  }, [savedFiles]);

  const addFile = (file: File, content: string) => {
    const newFile: SavedFile = {
      id: Date.now().toString(),
      name: file.name,
      content,
      uploadDate: new Date().toISOString(),
      size: file.size,
    };

    setSavedFiles(prev => {
      // Remove existing file with same name if it exists
      const filtered = prev.filter(f => f.name !== file.name);
      return [newFile, ...filtered];
    });
  };

  const removeFile = (id: string) => {
    setSavedFiles(prev => prev.filter(f => f.id !== id));
  };

  const clearAllFiles = () => {
    setSavedFiles([]);
  };

  // Expose addFile method to parent component
  useEffect(() => {
    (window as any).addFileToSidebar = addFile;
    return () => {
      delete (window as any).addFileToSidebar;
    };
  }, []);

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <div className="flex items-center justify-between px-2">
            <SidebarGroupLabel>Saved HTML Files</SidebarGroupLabel>
            {savedFiles.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFiles}
                className="h-6 w-6 p-0"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            )}
          </div>
          <SidebarGroupContent>
            <SidebarMenu>
              {savedFiles.length === 0 ? (
                <div className="px-2 py-4 text-sm text-muted-foreground text-center">
                  No saved files yet. Upload an HTML file to save it here.
                </div>
              ) : (
                savedFiles.map((file) => (
                  <SidebarMenuItem key={file.id}>
                    <div className="flex items-center gap-2 w-full">
                      <SidebarMenuButton
                        onClick={() => onFileSelect(file)}
                        className="flex-1"
                        data-active={currentFileName === file.name}
                      >
                        <FileText className="h-4 w-4" />
                        <div className="flex flex-col items-start min-w-0">
                          <span className="truncate text-sm">{file.name}</span>
                          <span className="text-xs text-muted-foreground">
                            {(file.size / 1024).toFixed(1)} KB • {new Date(file.uploadDate).toLocaleDateString()}
                          </span>
                        </div>
                      </SidebarMenuButton>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFile(file.id);
                        }}
                        className="h-8 w-8 p-0 shrink-0"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </SidebarMenuItem>
                ))
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;
