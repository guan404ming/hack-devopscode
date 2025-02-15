import * as vscode from 'vscode';
import { getActiveEditorContent } from './utils/retrieve';
import { ApiResponse, postData } from './utils/web-api';

import { hackPanel } from './panels/default';
import { showEditorTab } from './window/editorTab';

import { convertResponse } from './test/convert';

const convertPrompt: string = 'convert this source from java to python, or from python to java';

export function hackConvertCmd() {
    vscode.window.showInformationMessage('Convert from hack-vsc-extension!');

    const code: string = getActiveEditorContent() as string;

    hackPanel.updatePanel({state: 'loading'});
    // hackPanel.updatePanel({state: 'code', data: convertResponse});
  
    postData<ApiResponse>('convert', { code: code, prompt: convertPrompt })
        .then(response => {
            hackPanel.updatePanel({state: "code", data: response});
        })
        .catch(error => console.error('Error:', error));
}

export function hackConvertSelected(context: vscode.ExtensionContext) {
  return async () => {
    vscode.window.showInformationMessage('Converting Selected Code');
    showEditorTab(context, 'convert');
  }
}
