
import { useState, useRef } from "react";
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
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const toggleFullscreen = () => {
    if (!containerRef.current) return;

    if (!isFullscreen) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    setIsFullscreen(!isFullscreen);
  };

  const togglePlay = () => {
    if (!isPlaying && iframeRef.current && htmlContent) {
      const blob = new Blob([htmlContent], { type: "text/html" });
      const url = URL.createObjectURL(blob);
      iframeRef.current.src = url;
      setIsPlaying(true);
    } else if (iframeRef.current) {
      iframeRef.current.src = "about:blank";
      setIsPlaying(false);
    }
  };

  const handleFullscreenChange = () => {
    setIsFullscreen(!!document.fullscreenElement);
  };

  // Listen for fullscreen changes
  if (typeof document !== 'undefined') {
    document.addEventListener('fullscreenchange', handleFullscreenChange);
  }

  return (
    <Card className="h-full" ref={containerRef}>
      <CardHeader>
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
              disabled={!htmlContent}
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
      <CardContent className="h-full p-0">
        {htmlContent ? (
          <div className="relative h-full">
            <iframe
              ref={iframeRef}
              className="w-full h-full border-0 rounded-b-lg"
              title={fileName || "HTML Content"}
              sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
              style={{ minHeight: "400px" }}
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
  );
};

export default HTMLViewer;
