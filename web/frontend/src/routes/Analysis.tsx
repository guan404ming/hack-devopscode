import React, { useState } from 'react';
import Editor, { DiffEditor } from '@monaco-editor/react';
import axios from 'axios';
import { LoaderIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { codeService } from '@/services/codeService';
import { detectLanguage } from '@/services/utils';

const DEFAULT_CODE = `console.log('hello world!')`;

const Analysis = (): React.ReactNode => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [language, setLanguage] = useState('javascript');

  const [originalCode, setOriginalCode] = useState('');
  const [modifiedCode, setModifiedCode] = useState(``);

  const { toast } = useToast();

  const parseGithubUrl = (url: string) => {
    try {
      const regex = /github\.com\/([^/]+)\/([^/]+)\/blob\/([^/]+)\/(.+)/;
      const matches = url.match(regex);
      if (!matches) throw new Error('Invalid GitHub URL format');

      const [, owner, repo, path] = matches;
      return { owner, repo, path };
    } catch (error) {
      throw new Error('無法解析 GitHub URL');
    }
  };

  const handleFetchCode = async () => {
    if (!githubUrl) {
      toast({
        description: '請輸入 GitHub URL',
        variant: 'destructive',
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
            Accept: 'application/vnd.github.v3.raw',
          },
        },
      );

      setOriginalCode(response.data);
      const detectedLang = detectLanguage(path);
      setLanguage(detectedLang);
      toast({
        description: '代碼獲取成功',
        variant: 'default',
      });
    } catch (err) {
      toast({
        description: err instanceof Error ? err.message : '獲取代碼失敗',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCodeAction = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await codeService.optimizeCode({
        code: originalCode,
        prompt,
      });
      appendOutput('優化項目: ', result.improvements.join('\n'));
      setModifiedCode(result.code);
      appendOutput(
        `/*\n原始時間複雜度: ${result.original_complexity.time}\n原始空間複雜度: ${result.original_complexity.space}\n優化後時間複雜度: ${result.optimized_complexity.time}\n優化後空間複雜度: ${result.optimized_complexity.space}\n*/`,
        '優化詳情',
      );

      toast({
        description: '代碼處理成功',
        variant: 'default',
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : '發生錯誤');
      toast({
        description: '代碼處理失敗',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const appendOutput = (output: string, label: string) => {
    setModifiedCode(
      (prevCode) => `${prevCode}\n\n/* --- ${label} --- */\n${output}`,
    );
  };

  const handleClear = () => {
    setOriginalCode(DEFAULT_CODE);
    setPrompt('');
    setModifiedCode('');
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
            <Button onClick={handleFetchCode} disabled={loading || !githubUrl}>
              {loading ? (
                <>
                  <LoaderIcon className="mr-2 h-4 w-4 animate-spin" />
                  獲取中...
                </>
              ) : (
                '獲取代碼'
              )}
            </Button>
          </div>

          {modifiedCode ? (
            <DiffEditor
              width="100%"
              height="18rem"
              language={language}
              theme="vs-dark"
              original={originalCode}
              modified={modifiedCode}
              loading={
                <div className="flex items-center justify-center gap-2">
                  <LoaderIcon className="h-4.5 w-4.5 animate-spin" />
                  載入中...
                </div>
              }
            />
          ) : (
            <Editor
              width="100%"
              height="18rem"
              defaultLanguage={language}
              language={language}
              theme="vs-dark"
              value={originalCode}
              onChange={(newValue) => setOriginalCode(newValue ?? '')}
              loading={
                <div className="flex items-center justify-center gap-2">
                  <LoaderIcon className="h-4.5 w-4.5 animate-spin" />
                  載入中...
                </div>
              }
            />
          )}

          <Input
            placeholder="提示（選填）"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <div className="flex w-full space-x-2">
            <Button
              onClick={handleCodeAction}
              disabled={loading || !setOriginalCode}
              className="w-full"
            >
              {loading ? (
                <>
                  <LoaderIcon className="mr-2 h-4 w-4 animate-spin" />
                  處理中...
                </>
              ) : (
                '處理程式碼'
              )}
            </Button>
            <Button onClick={handleClear} variant="outline">
              Clear
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analysis;
