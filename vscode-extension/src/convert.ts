import * as vscode from 'vscode';
import { getActiveEditorContent } from './utils/retrieve';
import { ApiResponse, postData } from './utils/web-api';

import { hackConvertPanel } from './panels/convert';

import { convertResponse } from './test/convert';

const convertPrompt: string = 'convert this source from java to python, or from python to java';

export function hackConvertCmd() {
    vscode.window.showInformationMessage('Convert from hack-vsc-extension!');

    const code: string = getActiveEditorContent() as string;

    hackConvertPanel.updatePanel({state: 'loading'});
    // hackConvertPanel.updatePanel({state: 'code', data: convertResponse});
  
    postData<ApiResponse>('convert', { code: code, prompt: convertPrompt })
        .then(response => {
            hackConvertPanel.updatePanel({state: "code", data: response});
        })
        .catch(error => console.error('Error:', error));
}

export function hackConvertSelected(context: vscode.ExtensionContext) {
  return async () => {
    console.log("hackConvertSelected");
  }
}
