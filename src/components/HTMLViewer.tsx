import { useState, useRef, useEffect } from "react";
import { Maximize, Minimize, Play, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface HTMLViewerProps {
  htmlContent: string;
  fileName: string;
}

const HTMLViewer = ({ htmlContent, fileName }: HTMLViewerProps) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [blobUrl, setBlobUrl] = useState<string>("");
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const toggleFullscreen = () => {
    if (!iframeRef.current) return;

    if (!isFullscreen) {
      // Request fullscreen on the iframe itself for better game compatibility
      if (iframeRef.current.requestFullscreen) {
        iframeRef.current.requestFullscreen();
      }
    } else {
      // Exit fullscreen mode
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  const togglePlay = () => {
    if (!isPlaying && iframeRef.current && htmlContent) {
      // Create blob URL only once and reuse it
      if (!blobUrl) {
        const blob = new Blob([htmlContent], { type: "text/html" });
        const url = URL.createObjectURL(blob);
        setBlobUrl(url);
        iframeRef.current.src = url;
      } else {
        iframeRef.current.src = blobUrl;
      }
      setIsPlaying(true);
      
      // Focus the iframe after loading to ensure it can capture events
      setTimeout(() => {
        if (iframeRef.current) {
          iframeRef.current.focus();
        }
      }, 300);
    } else if (iframeRef.current) {
      // Don't clear the src, just mark as not playing
      setIsPlaying(false);
    }
  };

  const handleFullscreenChange = () => {
    const isCurrentlyFullscreen = !!document.fullscreenElement;
    setIsFullscreen(isCurrentlyFullscreen);
    
    // Ensure iframe gets focus when entering fullscreen
    if (isCurrentlyFullscreen && iframeRef.current) {
      setTimeout(() => {
        if (iframeRef.current) {
          iframeRef.current.focus();
        }
      }, 100);
    }
  };

  const handleIframeClick = () => {
    // Focus iframe when clicked to ensure it can capture all events
    if (iframeRef.current && isPlaying) {
      iframeRef.current.focus();
    }
  };

  // Listen for fullscreen changes
  useEffect(() => {
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Cleanup blob URL when component unmounts or content changes
  useEffect(() => {
    return () => {
      if (blobUrl) {
        URL.revokeObjectURL(blobUrl);
      }
    };
  }, [blobUrl]);

  // Reset when htmlContent changes
  useEffect(() => {
    if (blobUrl) {
      URL.revokeObjectURL(blobUrl);
      setBlobUrl("");
    }
    setIsPlaying(false);
  }, [htmlContent]);

  return (
    <div ref={containerRef} className={isFullscreen ? "fixed inset-0 z-50 bg-background" : ""}>
      <Card className="h-full">
        <CardHeader className={isFullscreen ? "p-2" : ""}>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Play className="h-5 w-5" />
              HTML Viewer
              {fileName && (
                <span className="text-sm font-normal text-muted-foreground">
                  - {fileName}
                </span>
              )}
            </CardTitle>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={togglePlay}
                disabled={!htmlContent}
              >
                {isPlaying ? (
                  <>
                    <Square className="h-4 w-4 mr-2" />
                    Stop
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Play
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={toggleFullscreen}
                disabled={!htmlContent || !isPlaying}
              >
                {isFullscreen ? (
                  <Minimize className="h-4 w-4" />
                ) : (
                  <Maximize className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className={`h-full p-0 ${isFullscreen ? "h-[calc(100vh-80px)]" : ""}`}>
          {htmlContent ? (
            <div className="relative h-full">
              <iframe
                ref={iframeRef}
                className="w-full h-full border-0 rounded-b-lg"
                title={fileName || "HTML Content"}
                sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-pointer-lock allow-fullscreen"
                style={{ minHeight: isFullscreen ? "calc(100vh - 80px)" : "400px" }}
                onClick={handleIframeClick}
                tabIndex={0}
                allow="fullscreen; pointer-lock"
              />
              {!isPlaying && (
                <div className="absolute inset-0 bg-secondary/50 flex items-center justify-center rounded-b-lg">
                  <div className="text-center space-y-4">
                    <div className="mx-auto w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
                      <Play className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">Ready to Play</h3>
                      <p className="text-sm text-muted-foreground">
                        Click the Play button to load your HTML file
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="h-full flex items-center justify-center bg-secondary/20 rounded-b-lg">
              <div className="text-center space-y-4">
                <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                  <Play className="h-8 w-8 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="font-medium text-muted-foreground">No File Selected</h3>
                  <p className="text-sm text-muted-foreground">
                    Upload an HTML file to view it here
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default HTMLViewer;
