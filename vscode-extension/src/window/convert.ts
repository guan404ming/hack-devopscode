import { v4 as uuidv4 } from "uuid";
import * as vscode from "vscode";

export function showConvertWindow(context: vscode.ExtensionContext) {
    return async () => {
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

        let tempDocId = context.workspaceState.get<string>("tempDocId");
        let tempDocUri = context.workspaceState.get<string>("tempDocUri");

        const suggestedEdit = await callLLMApi(selectedText);

        let tempDoc: vscode.TextDocument;

        if (tempDocUri) {
            const existingDocs = vscode.workspace.textDocuments.find(doc => doc.uri.toString() === tempDocUri);
            if (existingDocs) {
                const edit = new vscode.WorkspaceEdit();
                edit.replace(existingDocs.uri, new vscode.Range(0, 0, existingDocs.lineCount, 0), suggestedEdit);
                await vscode.workspace.applyEdit(edit);
                tempDoc = existingDocs;
            } else {
                tempDoc = await createNewTempDoc(suggestedEdit, editor.document.languageId);
                context.workspaceState.update("tempDocId", uuidv4());
                context.workspaceState.update("tempDocUri", tempDoc.uri.toString());
            }
        } else {
            tempDoc = await createNewTempDoc(suggestedEdit, editor.document.languageId);
            context.workspaceState.update("tempDocId", uuidv4());
            context.workspaceState.update("tempDocUri", tempDoc.uri.toString());
        }

        const tempEditor = await vscode.window.showTextDocument(tempDoc, vscode.ViewColumn.Beside);

        context.subscriptions.push(
            vscode.commands.registerCommand("hack-vsc-extension.applySuggestedEdit", async () => {
                const modifiedEditor = vscode.window.visibleTextEditors.find(
                    (e) => e.document.uri.toString() === tempDoc.uri.toString()
                );
                
                if (!modifiedEditor) {
                    vscode.window.showErrorMessage("未找到建議修改的 Editor！");
                    return;
                }

                const modifiedText = modifiedEditor.document.getText();


                const res = await editor.edit((editBuilder) => {
                    editBuilder.delete(editor.selection);
                    editBuilder.insert(editor.selection.start, modifiedText);
                });

                await vscode.commands.executeCommand("workbench.action.revertAndCloseActiveEditor");

                vscode.commands.executeCommand("setContext", "showApplyEditButton", false);
                vscode.window.showInformationMessage("已成功套用修改！");

                context.workspaceState.update("tempDocId", undefined);
                context.workspaceState.update("tempDocUri", undefined);
            })
        );

        vscode.commands.executeCommand("setContext", "showApplyEditButton", true);
    };
};

// 🛠 建立新的 `TempDoc`
async function createNewTempDoc(content: string, languageId: string): Promise<vscode.TextDocument> {
    return await vscode.workspace.openTextDocument({ 
        language: languageId, 
        content 
    });
}

// 🔹 模擬 LLM API 回應
async function callLLMApi(code: string): Promise<string> {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve("// AI 建議的修改：\n" + code.replace("var", "let")); // 模擬 LLM API 建議
        }, 200);
    });
}