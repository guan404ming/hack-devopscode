import * as vscode from "vscode";

/**
 * 取得目前開啟的檔案內容
 * @returns {string | null} 檔案的完整內容，若無開啟的檔案則回傳 null
 */
export function getActiveEditorContent(): string | null {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    return null;
  }
  return editor.document.getText();
}

/**
 * 取得目前選取的文字內容
 * @returns {string | null} 選取的文字內容，若無選取則回傳 null
 */
export function getSelectedText(): string | null {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    return null;
  }

  const selection = editor.selection;
  if (selection.isEmpty) {
    return null;
  }

  return editor.document.getText(selection);
}
