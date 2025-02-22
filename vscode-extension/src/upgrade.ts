import * as vscode from 'vscode';
import { showEditorTab } from './window/editorTab';
import { hackPanel } from './panels/default';

export function hackUpgradeCmd() {
    vscode.window.showInformationMessage('Upgrade from hack-vsc-extension!');
}

export function hackUpgradeSelected(context: vscode.ExtensionContext) {
  return async () => {
    vscode.window.showInformationMessage('Upgrading Selected Code');
    showEditorTab(context, 'upgrade');
  }
}
