import React, { useState } from "react";
import Editor from "@monaco-editor/react";
import { LoaderIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { codeService } from "@/services/codeService";

const DEFAULT_CODE = `console.log('hello world!')`;


const CodeChange = ({activeTab}: {
  activeTab: "upgrade" | "convert" | "optimize";
} ): React.ReactNode => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [prompt, setPrompt] = useState("");
  const [code, setCode] = useState<string>(DEFAULT_CODE);

  const { toast } = useToast();

  const handleCodeAction = async () => {
    setLoading(true);
    setError(null);
    try {
      let result;
      switch (activeTab) {
        case "upgrade":
          result = await codeService.upgradeCode({ code, prompt });
          appendOutput(result.code, "Upgraded Upgrade");
          break;
        case "convert":
          result = await codeService.convertCode({ code, prompt });
          appendOutput(result.code, "Converted Code");
          break;
        case "optimize":
          result = await codeService.optimizeCode({ code, prompt });
          appendOutput(result.code, "Optimized Code");
          appendOutput(
            `/*\nOriginal Time Complexity: ${result.original_complexity.time}\nOriginal Space Complexity: ${result.original_complexity.space}\nOptimized Time Complexity: ${result.optimized_complexity.time}\nOptimized Space Complexity: ${result.optimized_complexity.space}\n*/`,
            "Optimization Details"
          );
          break;
      }
      toast({
        description: "Code processed successfully",
        variant: "default",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      toast({
        description: "Code processing failed",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Function to append output as comments in the code editor
  const appendOutput = (output: string, label: string) => {
    setCode((prevCode) => `${prevCode}\n\n/* --- ${label} --- */\n${output}`);
  };

  return (
    <div className="container py-6">
    
        <div className="mt-6">
          <div className="space-y-4">
            <Editor
              width="70rem"
              height="20rem"
              defaultLanguage="javascript"
              language="javascript"
              theme="vs-dark"
              value={code}
              onChange={(newValue) => setCode(newValue ?? "")}
              loading={
                <div className="flex items-center justify-center gap-2">
                  <LoaderIcon className="h-4.5 w-4.5 animate-spin" />
                  Loading...
                </div>
              }
            />

            <Input
              placeholder="Prompt (Optional)"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
            <Button
              onClick={handleCodeAction}
              disabled={loading || !code}
              className="w-full"
            >
              {loading ? (
                <>
                  <LoaderIcon className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Process Code"
              )}
            </Button>
          </div>
        </div>
    </div>
  );
};

export default CodeChange;
