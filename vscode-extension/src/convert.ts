import * as vscode from 'vscode';
import { postData, ApiResponse } from './utils/web-api';
import { getActiveEditorContent } from './utils/retrieve';

import { hackConvertPanel } from './panels/convert';

const convertPrompt: string = ``;

export function hackConvertCmd() {
    vscode.window.showInformationMessage('Convert from hack-vsc-extension!');

    const code: string = getActiveEditorContent();

    // hackConvertPanel.updatePanel(
    //     {
    //       "code": "string",
    //       "language_specific_notes": [
    //         "string"
    //       ],
    //       "potential_compatibility_issues": [
    //         "string"
    //       ]
    //     }
    // );
    postData<ApiResponse>('convert', { code: code, prompt: 'prompt' })
        .then(response => {
            hackConvertPanel.updatePanel(response)
        })
        .catch(error => console.error('Error:', error));
}
