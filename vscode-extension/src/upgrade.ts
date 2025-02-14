import * as vscode from 'vscode';
import { showEditorTab } from './window/editorTab';

export function hackUpgradeCmd() {
    vscode.window.showInformationMessage('Upgrade from hack-vsc-extension!');
}

export function hackUpgradeSelected(context: vscode.ExtensionContext) {
  return async () => {
    console.log("hackUpgradeSelected");
    showEditorTab(context, 'upgrade')
  }
}
