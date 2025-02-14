import React, { useState } from "react";
import Editor, { DiffEditor } from "@monaco-editor/react";
import { LoaderIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { codeService } from "@/services/codeService";

const DEFAULT_CODE = `console.log('hello world!')`;


const CodeChange = ({activeTab}: {
  activeTab: "upgrade" | "convert" | "optimize" | "deploy" | "correct";
} ): React.ReactNode => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [prompt, setPrompt] = useState("");
  const [code, setCode] = useState<string>(DEFAULT_CODE);
  const [modifiedCode, setModifiedCode] = useState<string>("");
  const [showDiff, setShowDiff] = useState(false);
  const [infoDialog, setInfoDialog] = useState<{
    isOpen: boolean;
    title: string;
    content: string;
  }>({
    isOpen: false,
    title: "",
    content: "",
  });

  const { toast } = useToast();

  const handleCodeAction = async () => {
    setLoading(true);
    setError(null);
    try {
      let result;
      switch (activeTab) {
        case "upgrade":
          result = await codeService.upgradeCode({ code, prompt });
          appendCode(result.code);
          break;
        case "convert":
          result = await codeService.convertCode({ code, prompt });
          appendCode(result.code);
          break;
        case "optimize":
          result = await codeService.optimizeCode({ code, prompt });
          appendCode(result.code);
          showInfo(
            "Optimization Details",
            `Original Time Complexity: ${result.original_complexity.time}\nOriginal Space Complexity: ${result.original_complexity.space}\nOptimized Time Complexity: ${result.optimized_complexity.time}\nOptimized Space Complexity: ${result.optimized_complexity.space}`
          );
          break;
        case "correct":
          result = await codeService.correctCode({ code });
          appendCode(result.code);
          break;
        case "deploy":
          result = await codeService.deployCode({ code });
          showInfo("Deploy Status", `Status: ${result.status}\nLog:\n${result.log}`);
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
  const appendCode = (modifiedCode: string) => {
    setModifiedCode(`${modifiedCode}`);
    setShowDiff(true);
  };

  // const appendInfo = (output: string, label: string) => {
  //   setCode((prevCode) => `${prevCode}\n\n/* --- ${label} --- */\n${output}`);
  // }

  const showInfo = (title: string, content: string) => {
    setInfoDialog({
      isOpen: true,
      title,
      content,
    });
  };

  const handleAcceptChanges = () => {
    setCode(modifiedCode);
    setShowDiff(false);
  };

  return (
    <div className="container py-6">
    
        <div className="mt-6">
          <div className="space-y-4">
          {showDiff ? (
             <DiffEditor
               width="70rem"
               height="20rem"
               theme="vs-dark"
               original={code}
               modified={modifiedCode}
               options={{ renderSideBySide: false }}
               loading={
                 <div className="flex items-center justify-center gap-2">
                   <LoaderIcon className="h-4.5 w-4.5 animate-spin" />
                   載入中...
                 </div>
               }
             />
            ) : (
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
            )}
            <Dialog open={infoDialog.isOpen} onOpenChange={(open) => setInfoDialog(prev => ({ ...prev, isOpen: open }))}>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>{infoDialog.title}</DialogTitle>
                </DialogHeader>
                <div className="mt-4">
                  <pre className="whitespace-pre-wrap break-words text-sm">
                    {infoDialog.content}
                  </pre>
                </div>
              </DialogContent>
            </Dialog>
            <Input
              placeholder="Prompt (Optional)"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={loading || activeTab === "deploy"}
            />
            {showDiff ? (
              <Button
                onClick={handleAcceptChanges}
                className="w-full"
              >
                Accept Changes
              </Button>
            ) : (
              <Button
                variant={activeTab === "deploy" ? "destructive" : "default"}
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
                  activeTab === "deploy" ? "Deploy" : "Process Code"
                )}
              </Button>
            )}
          </div>
        </div>
    </div>
  );
};

export default CodeChange;
