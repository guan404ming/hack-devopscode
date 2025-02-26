import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { DiffEditor } from '@monaco-editor/react';
import { LoaderIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { codeService } from '@/services/codeService';
import { detectLanguage } from '@/services/utils';

const Genius = () => {
  const [repoUrl, setRepoUrl] = useState('');
  const [repoData, setRepoData] = useState<
    { path: string; type: string; url?: string; mode?: string; sha?: string }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [language, setLanguage] = useState<string>('javascript');
  const [issues, setIssues] = useState<
    {
      start_line: number;
      end_line: number;
      tag: string;
      description: string;
    }[]
  >([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentIssueIndex, setCurrentIssueIndex] = useState(0);
  const [issueCode, setIssueCode] = useState<string>('');
  const [showDiffDialog, setShowDiffDialog] = useState(false);
  const [optimizedCode, setOptimizedCode] = useState<string | null>(null);
  const [selectedIssues, setSelectedIssues] = useState<string[]>([]);

  const navigate = useNavigate();

  const fetchRepoTree = async () => {
    setLoading(true);
    setRepoData([]);
    setFileContent(null);
    setSelectedFile(null);

    try {
      const match = repoUrl.match(/github\.com\/([^\\/]+)\/([^\\/]+)/);
      if (!match) throw new Error('Invalid GitHub URL');

      const [_, owner, repo] = match;
      const apiUrl = `https://api.github.com/repos/${owner}/${repo}/git/trees/main?recursive=1`;

      const response = await fetch(apiUrl);
      if (!response.ok) throw new Error('Failed to fetch repository tree');
      const data = await response.json();

      if (data.tree) {
        setRepoData(data.tree);
      } else {
        throw new Error('Invalid repository structure');
      }
    } catch (error) {
      console.error(error);
      alert('Error fetching repository data. Please check the URL.');
    } finally {
      setLoading(false);
    }
  };

  const fetchFileContent = async (fileUrl: string, filePath: string) => {
    setLoading(true);
    setFileContent(null);
    setSelectedFile(filePath);

    function convertGitBlobUrlToContentsUrl(blobUrl: string) {
      // Match the repository owner, name, and file path from the blob URL
      const match = blobUrl.match(
        /repos\/([^\\/]+)\/([^\\/]+)\/git\/blobs\/[^\\/]+\/contents\/(.+)/,
      );

      if (!match) {
        console.error('Invalid GitHub Blob URL format.');
        return null;
      }

      const [_, owner, repo, filePath] = match;

      // Construct the correct "contents" URL
      const contentsUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`;

      return contentsUrl || '';
    }
    try {
      const contentsUrl = convertGitBlobUrlToContentsUrl(
        `${fileUrl}/contents/${filePath}`,
      );
      if (!contentsUrl) throw new Error('Invalid GitHub Blob URL format.');
      const response = await fetch(contentsUrl, {
        headers: { Accept: 'application/vnd.github.v3.raw' },
      });
      if (!response.ok) throw new Error('Failed to fetch file content');
      const content = await response.text();
      setFileContent(content);
      setSelectedFile(filePath);

      const detectedLang = detectLanguage(filePath);
      setLanguage(detectedLang);

      const result = await codeService.detectCode({ code: content });
      setIssues(result.issues);

      if (result.issues.length > 0) {
        setCurrentIssueIndex(0);
        setDialogOpen(true);
      }
    } catch (error) {
      console.error(error);
      alert('Error fetching file content.');
    } finally {
      setLoading(false);
    }
  };

  const handlePreviousIssue = () => {
    if (currentIssueIndex > 0) {
      setCurrentIssueIndex(currentIssueIndex - 1);
    }
  };

  const handleOptimizeCode = async () => {
    setLoading(true);
    if (!fileContent || issues.length === 0) {
      setLoading(false);
      return;
    }

    try {
      const result = await codeService.optimizeCode({
        code: fileContent,
        prompt: JSON.stringify(issues.filter(issue => selectedIssues.includes(issue.description))),
      });
      setOptimizedCode(result.code);
      setShowDiffDialog(true);
    } catch (error) {
      console.error(error);
      alert('Error optimizing code.');
    } finally {
      setLoading(false);
    }
  };

  const handleApplyCode = () => {
    if (optimizedCode) {
      setFileContent(optimizedCode);
      setShowDiffDialog(false);
      setDialogOpen(false);
    }
  };

  useEffect(() => {
    const updateIssueCode = () => {
      const issue = issues[currentIssueIndex];
      if (issue) {
        const lines = fileContent?.split('\n') || [];
        const codeSnippet = lines
          .slice(issue.start_line - 1, issue.end_line)
          .join('\n');
        setIssueCode(codeSnippet);
      }
    };
    updateIssueCode();
    if (dialogOpen) {
      updateIssueCode();
    }
  }, [currentIssueIndex, fileContent, dialogOpen, issues]);

  return (
    <>
      <div className="m-4 mb-2 flex gap-2">
        <Input
          type="text"
          placeholder="Enter GitHub repo URL (e.g., https://github.com/user/repo)"
          value={repoUrl}
          onChange={(e) => setRepoUrl(e.target.value)}
        />
        <Button onClick={fetchRepoTree} disabled={loading}>
          {loading ? <LoaderIcon className="animate-spin" /> : 'Fetch Repo'}
        </Button>
        <Button
          onClick={() => setDialogOpen(true)}
          disabled={issues.length === 0 || loading}
        >
          {loading ? <LoaderIcon className="animate-spin" /> : 'Open Issues'}
        </Button>
      </div>
      <div className="flex h-auto overflow-y-scroll">
        {/* <h1 className="text-xl font-semibold mb-4">GitHub Repo Explorer</h1> */}

        <div className="flex w-xs flex-col gap-0 overflow-y-scroll p-2">
          <div className="flex w-full justify-between p-4 pt-0">
            <span>{`File`}</span>
          </div>
          {selectedFile === '' && (
            <span className="flex cursor-pointer items-center gap-[6px] truncate bg-zinc-800 p-[2px]">
              <img
                className="inline-block h-3 w-3"
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/JavaScript-logo.png/768px-JavaScript-logo.png"
                alt=""
              ></img>
            </span>
          )}

          {repoData &&
            repoData.map((item) => {
              if (item === null) return <></>;
              return (
                <span
                  key={item.path}
                  className={cn(
                    'flex cursor-pointer items-center gap-[6px] truncate p-4',
                    selectedFile === item.path && 'bg-zinc-800',
                    selectedFile !== item.path && 'hover:bg-zinc-700',
                  )}
                >
                  {/* <img
                    className="inline-block h-3 w-3"
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/JavaScript-logo.png/768px-JavaScript-logo.png"
                    alt=""
                  ></img> */}
                  {item.type === 'blob' ? (
                    <button
                      className="text-color-primary truncate underline"
                      onClick={() => {
                        fetchFileContent(item.url as string, item.path);
                        setSelectedFile(item.path as string);
                      }}
                    >
                      📄 {item.path}
                    </button>
                  ) : (
                    <span className="font-bold">📂 {item.path}</span>
                  )}
                </span>
              );
            })}
        </div>

        <div className="h-full w-full">
          <div data-testid="editor">
            <Editor
              height="500px"
              language={language}
              theme="vs-dark"
              value={fileContent || ''}
              onChange={(newValue) => setFileContent(newValue ?? '')}
              loading={
                <div className="flex items-center gap-2">
                  <LoaderIcon className="h-5 w-5 animate-spin" />
                  Loading file...
                </div>
              }
            />
          </div>
        </div>
      </div>
      {issues.length > 0 && (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="p-6 sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold">
                [{issues[currentIssueIndex].tag || ''}]{' '}
                {` Issue ${currentIssueIndex + 1}`}
              </DialogTitle>
              <div className="mt-6 flex items-center">
                <input type="checkbox" className='mr-2'
                  checked={selectedIssues.includes(issues[currentIssueIndex].description)}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    if (checked) {
                      setSelectedIssues([...selectedIssues, issues[currentIssueIndex].description]);
                    } else {
                      setSelectedIssues(selectedIssues.filter(issue => issue !== issues[currentIssueIndex].description));
                    }
                  }}
                >
                </input>
                Select this issue
              </div>
              <DialogClose />
            </DialogHeader>
            <div>
              <p className="text-sm">{issues[currentIssueIndex].description}</p>
              <div className="mt-6">
                <h3 className="mb-4 font-semibold">Code Snippet:</h3>
                <Editor
                  height="200px"
                  language={language}
                  theme="vs-dark"
                  value={issueCode}
                  options={{ readOnly: true }}
                />
              </div>
              <div className="mt-4 flex justify-between">
                <Button
                  onClick={handlePreviousIssue}
                  disabled={currentIssueIndex === 0 || loading}
                >
                  {loading ? (
                    <LoaderIcon className="animate-spin" />
                  ) : (
                    'Previous'
                  )}
                </Button>

                {currentIssueIndex !== issues.length - 1 ? (
                  <Button
                    onClick={() => {
                      setCurrentIssueIndex(currentIssueIndex + 1);
                      navigate('/genius');
                    }}
                    disabled={loading}
                  >
                    {loading ? <LoaderIcon className="animate-spin" /> : 'Next'}
                  </Button>
                ) : (
                  <Button onClick={handleOptimizeCode} disabled={loading}>
                    {loading ? (
                      <LoaderIcon className="animate-spin" />
                    ) : (
                      'Optimize Code'
                    )}
                  </Button>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {showDiffDialog && (
        <Dialog open={showDiffDialog} onOpenChange={setShowDiffDialog}>
          <DialogContent className="p-6 sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold">
                Code Differences
              </DialogTitle>
              <DialogClose onClick={() => setShowDiffDialog(false)} />
            </DialogHeader>
            <DiffEditor
              height="400px"
              language={language}
              theme="vs-dark"
              original={fileContent || ''}
              modified={optimizedCode || ''}
              options={{ renderSideBySide: false }}
            />
            <div className="mt-4 flex justify-end">
              <Button onClick={handleApplyCode} disabled={!optimizedCode}>
                Apply Code
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default Genius;
