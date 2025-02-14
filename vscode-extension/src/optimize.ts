import * as vscode from 'vscode';
import { showEditorTab } from './window/editorTab';

export function hackOptimizeCmd() {
    vscode.window.showInformationMessage('Optimize from hack-vsc-extension!');
}

export function hackOptimizeSelected(context: vscode.ExtensionContext) {
  return async () => {
    console.log("hackOptimizeSelected");
    showEditorTab(context, 'optimize')
  }
}
