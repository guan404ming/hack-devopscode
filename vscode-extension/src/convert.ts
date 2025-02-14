import * as vscode from 'vscode';
import { postData, ApiResponse } from './utils/web-api';
import { getActiveEditorContent } from './utils/retrieve';

import { hackConvertPanel } from './panels/convert';

import { convertResponse } from './test/convert';

const convertPrompt: string = 'convert this source from java to python, or python to java';

export function hackConvertCmd() {
    vscode.window.showInformationMessage('Convert from hack-vsc-extension!');

    const code: string = getActiveEditorContent() as string;

    hackConvertPanel.updatePanel(convertResponse);

    // postData<ApiResponse>('convert', { code: code, prompt: convertPrompt })
    //     .then(response => {
    //         hackConvertPanel.updatePanel(response);
    //     })
    //     .catch(error => console.error('Error:', error));
}
