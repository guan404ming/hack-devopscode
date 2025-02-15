import * as vscode from 'vscode';
import { showEditorTab } from './window/editorTab';
import { hackPanel } from './panels/default';

export function hackOptimizeCmd() {
    vscode.window.showInformationMessage('Optimize from hack-vsc-extension!');
}

export function hackOptimizeSelected(context: vscode.ExtensionContext) {
  return async () => {
    vscode.window.showInformationMessage('Optimizing Selected Code');
    showEditorTab(context, 'optimize');
  }
}
