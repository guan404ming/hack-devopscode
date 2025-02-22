
export function getWebviewContent(): string {
    return `
    <!DOCTYPE html>
    <html lang="zh-TW">
    <head>
        <meta charset="UTF-8">
        <title>程式碼預覽</title>
        <style>
            body { font-family: sans-serif; padding: 20px; background: #1e1e1e; color: #ccc; }
            button { padding: 8px 12px; background: #007ACC; color: white; border: none; cursor: pointer; border-radius: 5px; font-size: 14px; }
            button:hover { background: #005999; }
        </style>
    </head>
    <body>
        <h2>🔹 建議修改已開啟於 Editor</h2>
        <p>請在 VS Code Editor Tab 內修改內容，然後點擊「應用更改」來覆蓋選取的程式碼。</p>
        <button id="applyBtn">✅ 應用更改</button>

        <script>
            const vscode = acquireVsCodeApi();
            document.getElementById("applyBtn").addEventListener("click", () => {
                vscode.postMessage({ command: "applyChanges" });
            });
        </script>
    </body>
    </html>`;
}


// 轉義 HTML，防止 XSS
function escapeHTML(text: string): string {
    return text.replace(/</g, "&lt;").replace(/>/g, "&gt;");
}