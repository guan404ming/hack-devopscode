import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { codeService } from "@/services/codeService";
import Editor, { DiffEditor } from "@monaco-editor/react";
import { ArrowRight, LoaderIcon } from "lucide-react";
import React, { useRef, useState } from "react";
import { FaJava, FaPython } from "react-icons/fa";


const COMMON = `import java.util.HashSet;

public class A2-2 {
    public static void main(String[] args) {
        int[] numbers = {1, 2, 2, 3, 4, 4, 5, 6, 6, 7};
        HashSet<Integer> uniqueNumbers = new HashSet<>();
        int sum = 0;

        for (int num : numbers) {
            if (uniqueNumbers.add(num)) {
                sum += num;
            }
        }

        System.out.println("Unique Numbers: " + uniqueNumbers);
        System.out.println("Sum of unique numbers: " + sum);

        System.out.println("Iterating through unique numbers:");
        for (int unique : uniqueNumbers) {
            System.out.println("- " + unique);
        }
    }
}
`

const DEFAULT_CODE: { [key: string]: string } = {
  'upgrade': `import java.util.Scanner;

public class FactorialCalculator {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        System.out.print("Enter a number to calculate its factorial: ");
        
        if (!scanner.hasNextInt()) {
            System.out.println("Invalid input. Please enter an integer.");
            return;
        }

        int number = scanner.nextInt();
        if (number < 0) {
            System.out.println("Factorial is not defined for negative numbers.");
        } else {
            int result = factorial(number);
            System.out.println("Factorial of " + number + " is " + result);
        }
    }

    public static int factorial(int n) {
        if (n == 0) {
            return 1;
        }
        return n * factorial(n - 1);
    }
}`,
  'convert': COMMON,
  'optimize': COMMON,
  'deploy': COMMON,
  'correct': `public class B1-1 {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in); // 錯誤：找不到符號 Scanner
        System.out.println("Enter a number:");
        int number = scanner.nextInt();
        System.out.println("You entered: " + number);
    }
}`,
};


const CodeChange = ({activeTab}: {
  activeTab: "upgrade" | "convert" | "optimize" | "deploy" | "correct";
} ): React.ReactNode => {
  const [conversionDirection, setConversionDirection] = useState<"PYTHON_TO_JAVA" | "JAVA_TO_PYTHON">("JAVA_TO_PYTHON")
  const [selectedVersion, setSelectedVersion] = useState<string>("")
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const [upgradeLanguage, setUpgradeLanguage] = useState<"PYTHON" | "JAVA">("PYTHON")
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [prompt, setPrompt] = useState("");
  const [code, setCode] = useState<string>(DEFAULT_CODE[activeTab]);
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

  const toggleConversionDirection = () => {
    setConversionDirection((prev) => (prev === "PYTHON_TO_JAVA" ? "JAVA_TO_PYTHON" : "PYTHON_TO_JAVA"))
  }

  const handleCodeAction = async () => {
    setLoading(true);
    setError(null);
    try {
      let result;
      let prompt = '';
      switch (activeTab) {
        case "upgrade":
          result = await codeService.upgradeCode({ code, prompt });
          appendCode(result.code);
          break;
        case "convert":
          prompt = `Translate ${conversionDirection.toLowerCase().split('_').join(' ')}`;
          result = await codeService.convertCode({ code, prompt });
          appendCode(result.code);
          toggleConversionDirection();
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
      {
        activeTab === 'convert' && <div className="flex justify-center items-center mb-4">
            <Button variant="outline" size="icon" className="h-12 w-12 text-blue-500 rounded-full p-2" onClick={toggleConversionDirection}>
              <FaPython size={24} />
            </Button>
            <ArrowRight
              className={`h-6 w-6 mx-2 transition-transform ${
                conversionDirection === "PYTHON_TO_JAVA" ? "" : "rotate-180"
              }`}
            />
            <Button variant="outline" size="icon" className="h-12 w-12 text-red-500 rounded-full p-2" onClick={toggleConversionDirection}>
              <FaJava size={24} />
            </Button>
          </div>
      }

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
                defaultLanguage="java"
                language={activeTab === 'upgrade' ? upgradeLanguage.toLowerCase() : (conversionDirection === 'JAVA_TO_PYTHON' ? 'java' : 'python')}
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
            <Dialog open={infoDialog.isOpen} onOpenChange={(open: boolean) => setInfoDialog(prev => ({ ...prev, isOpen: open }))}>
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
            {
              activeTab !== 'convert' && <Input
                placeholder="Prompt (Optional)"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                disabled={loading || activeTab === "deploy"}
              />
            }
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
