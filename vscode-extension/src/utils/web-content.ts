export function getWebviewContent(code: string): string {
    return `
    <!DOCTYPE html>
    <html lang="zh-TW">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Language Translation</title>

        <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.5.1/highlight.min.js"></script>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.5.1/styles/vs-code-dark.min.css">
        <script>hljs.highlightAll();</script>

        <style>
            body {
                font-family: var(--vscode-font-family, sans-serif);
                background-color: var(--vscode-editor-background, #1e1e1e);
                color: var(--vscode-editor-foreground, #d4d4d4);
                padding: 16px;
            }
            h2 {
                font-size: 16px;
                color: var(--vscode-editor-foreground, #d4d4d4);
            }
            .container {
                display: flex;
                flex-direction: column;
                gap: 12px;
            }
            .code-block, .editor-block {
                background: var(--vscode-editor-background, #252526);
                border: 1px solid var(--vscode-editorGutter-background, #333);
                padding: 10px;
                border-radius: 5px;
                overflow-x: auto;
            }
            pre {
                margin: 0;
                padding: 10px;
            }
            .editor-block textarea {
                width: 100%;
                height: 150px;
                background: transparent;
                border: none;
                color: var(--vscode-editor-foreground, #d4d4d4);
                font-family: monospace;
                font-size: 14px;
                outline: none;
                resize: none;
                padding: 8px;
            }
            .button-container {
                display: flex;
                gap: 10px;
                margin-top: 12px;
            }
            button {
                padding: 8px 12px;
                background: var(--vscode-button-background, #007ACC);
                color: var(--vscode-button-foreground, white);
                border: none;
                cursor: pointer;
                border-radius: 5px;
                font-size: 14px;
            }
            button:hover {
                background: var(--vscode-button-hoverBackground, #005999);
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h2>🔹 原始程式碼</h2>
            <div class="code-block">
                <pre><code class="language-javascript">${escapeHTML(code)}</code></pre>
            </div>

            <h2>✏️ 建議修改</h2>
            <div class="editor-block">
                <textarea id="editArea">${escapeHTML(code)}</textarea>
            </div>

            <div class="button-container">
                <button id="replaceBtn">🔄 應用更改</button>
            </div>
        </div>

        <script>
            const vscode = acquireVsCodeApi();

            document.getElementById("replaceBtn").addEventListener("click", () => {
                const editedText = document.getElementById("editArea").value;
                vscode.postMessage({ command: "replaceText", newText: editedText });
            });
        </script>
    </body>
    </html>`;
}


// 轉義 HTML，防止 XSS
function escapeHTML(text: string): string {
    return text.replace(/</g, "&lt;").replace(/>/g, "&gt;");
}