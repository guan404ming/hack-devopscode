import * as vscode from "vscode";
import { getWebviewContent } from "../utils/web-content";

export function showConvertWindow(context: vscode.ExtensionContext) {
    return () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage("沒有開啟任何檔案！");
            return;
        }

        const selection = editor.selection;
        const selectedText = editor.document.getText(selection);

        if (!selectedText) {
            vscode.window.showWarningMessage("請先選取一段程式碼！");
            return;
        }

        // 開啟 Webview Panel
        const panel = vscode.window.createWebviewPanel(
            "codePreview",
            "程式碼預覽",
            vscode.ViewColumn.Beside,
            { enableScripts: true }
        );

        // 設定 Webview 內容
        panel.webview.html = getWebviewContent(selectedText);

        // 監聽 Webview 傳來的訊息
        panel.webview.onDidReceiveMessage(
            async (message) => {
                if (message.command === "replaceText") {
                    const newText = "這是新的內容！"; // 這裡先寫死
                    editor.edit((editBuilder) => {
                        editBuilder.replace(selection, newText);
                    });
                }
            },
            undefined,
            context.subscriptions
        );
    };
};



