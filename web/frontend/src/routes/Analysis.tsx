import React, { useEffect, useState } from "react";
import Editor from "@monaco-editor/react";
import { LoaderIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { codeService } from "@/services/codeService";
import axios from "axios";

const DEFAULT_CODE = `console.log('hello world!')`;

const Analysis = (): React.ReactNode => {
  const [activeTab, setActiveTab] = useState("upgrade");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [prompt, setPrompt] = useState("");
  const [code, setCode] = useState<string>(DEFAULT_CODE);
  const [githubUrl, setGithubUrl] = useState("");
  const [language, setLanguage] = useState("javascript");

  const { toast } = useToast();

  useEffect(() => {
    setCode(DEFAULT_CODE);
  }, [activeTab]);

  const parseGithubUrl = (url: string) => {
    try {
      const regex = /github\.com\/([^/]+)\/([^/]+)\/blob\/([^/]+)\/(.+)/;
      const matches = url.match(regex);
      if (!matches) throw new Error("Invalid GitHub URL format");
      
      const [, owner, repo, branch, path] = matches;
      return { owner, repo, path };
    } catch (error) {
      throw new Error("無法解析 GitHub URL");
    }
  };

  const detectLanguage = (filename: string): string => {
    // 先轉換檔名為小寫以確保匹配
    const lowercaseFilename = filename.toLowerCase();
    
    // 如果檔名是 Dockerfile，直接返回
    if (lowercaseFilename === 'dockerfile') {
      return 'dockerfile';
    }

    const extensionMap: Record<string, string> = {
      // JavaScript 相關
      'js': 'javascript',
      'jsx': 'javascript',
      'mjs': 'javascript',
      'cjs': 'javascript',
      
      // TypeScript 相關
      'ts': 'typescript',
      'tsx': 'typescript',
      'mts': 'typescript',
      'cts': 'typescript',
      
      // Python 相關
      'py': 'python',
      'pyw': 'python',
      'ipynb': 'python',
      
      // Java 相關
      'java': 'java',
      'class': 'java',
      'jar': 'java',
      
      // C/C++ 相關
      'c': 'c',
      'h': 'c',
      'cpp': 'cpp',
      'cc': 'cpp',
      'cxx': 'cpp',
      'hpp': 'cpp',
      'hxx': 'cpp',
      
      // Web 相關
      'html': 'html',
      'htm': 'html',
      'css': 'css',
      'scss': 'scss',
      'sass': 'scss',
      'less': 'less',
      'svg': 'xml',
      
      // 配置文件
      'json': 'json',
      'yaml': 'yaml',
      'yml': 'yaml',
      'toml': 'toml',
      'xml': 'xml',
      
      // Shell 相關
      'sh': 'shell',
      'bash': 'shell',
      'zsh': 'shell',
      'fish': 'shell',
      
      // 其他常見語言
      'go': 'go',
      'rs': 'rust',
      'rb': 'ruby',
      'php': 'php',
      'swift': 'swift',
      'kt': 'kotlin',
      'scala': 'scala',
      'r': 'r',
      'm': 'objective-c',
      'mm': 'objective-c',
      'sql': 'sql',
      'md': 'markdown',
      'vue': 'vue',
      'svelte': 'svelte',
      'dart': 'dart',
      'ex': 'elixir',
      'exs': 'elixir',
      'erl': 'erlang',
      'fs': 'fsharp',
      'fsx': 'fsharp',
      'hs': 'haskell',
      'lhs': 'haskell',
      'lua': 'lua',
      'pl': 'perl',
      'pm': 'perl',
      'ps1': 'powershell',
      'psm1': 'powershell',
      'psd1': 'powershell',
    };

    const extension = lowercaseFilename.split('.').pop() || '';
    return extensionMap[extension] || 'plaintext';
  };

  const handleFetchCode = async () => {
    if (!githubUrl) {
      toast({
        description: "請輸入 GitHub URL",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { owner, repo, path } = parseGithubUrl(githubUrl);
      const response = await axios.get(
        `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
        {
          headers: {
            Accept: "application/vnd.github.v3.raw",
          },
        }
      );
      
      setCode(response.data);
      const detectedLang = detectLanguage(path);
      setLanguage(detectedLang);
      toast({
        description: "代碼獲取成功",
        variant: "default",
      });
    } catch (err) {
      toast({
        description: err instanceof Error ? err.message : "獲取代碼失敗",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCodeAction = async () => {
    setLoading(true);
    setError(null);
    try {
      let result;
      switch (activeTab) {
        case "upgrade":
          result = await codeService.upgradeCode({ code, prompt });
          appendOutput(result.code, "升級後的代碼");
          break;
        case "convert":
          result = await codeService.convertCode({ code, prompt });
          appendOutput(result.code, "轉換後的代碼");
          break;
        case "optimize":
          result = await codeService.optimizeCode({ code, prompt });
          appendOutput(result.code, "優化後的代碼");
          appendOutput(
            `/*\n原始時間複雜度: ${result.original_complexity.time}\n原始空間複雜度: ${result.original_complexity.space}\n優化後時間複雜度: ${result.optimized_complexity.time}\n優化後空間複雜度: ${result.optimized_complexity.space}\n*/`,
            "優化詳情"
          );
          break;
        case "docker":
          result = await codeService.generateDockerYaml({ code, prompt });
          appendOutput(result.yaml, "生成的 Docker YAML");
          break;
      }
      toast({
        description: "代碼處理成功",
        variant: "default",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "發生錯誤");
      toast({
        description: "代碼處理失敗",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const appendOutput = (output: string, label: string) => {
    setCode((prevCode) => `${prevCode}\n\n/* --- ${label} --- */\n${output}`);
  };

  return (
    <div className="container py-6">
        <div className="mt-6">
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="輸入 GitHub URL"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                className="flex-1"
              />
              <Button
                onClick={handleFetchCode}
                disabled={loading || !githubUrl}
                variant="secondary"
              >
                {loading ? (
                  <>
                    <LoaderIcon className="mr-2 h-4 w-4 animate-spin" />
                    獲取中...
                  </>
                ) : (
                  "獲取代碼"
                )}
              </Button>
            </div>

            <Editor
              width="100%"
              height="18rem"
              defaultLanguage={language}
              language={language}
              theme="vs-dark"
              value={code}
              onChange={(newValue) => setCode(newValue ?? "")}
              loading={
                <div className="flex items-center justify-center gap-2">
                  <LoaderIcon className="h-4.5 w-4.5 animate-spin" />
                  載入中...
                </div>
              }
            />

            <Input
              placeholder="提示（選填）"
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
                  處理中...
                </>
              ) : (
                "處理程式碼"
              )}
            </Button>
          </div>
        </div>
    </div>
  );
};

export default Analysis;