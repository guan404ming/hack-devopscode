// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { hackConvertPanel } from './/panels/convert.js';
import { hackConvertCmd, hackConvertSelected } from './convert.js';
import { hackDeployCmd } from './deploy.js';
import { hackOptimizeCmd } from './optimize.js';
import { hackUpgradeCmd } from './upgrade.js';
import { showConvertWindow } from './window/convert.js';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "hack-vsc-extension" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	const disposableConvert = vscode.commands.registerCommand('hack-vsc-extension.hackConvert', hackConvertCmd);

	const disposableOptimize = vscode.commands.registerCommand('hack-vsc-extension.hackOptimize', hackOptimizeCmd);

	const disposableUpgrade = vscode.commands.registerCommand('hack-vsc-extension.hackUpgrade', hackUpgradeCmd);

	const disposableDeploy = vscode.commands.registerCommand('hack-vsc-extwension.hackDeploy', hackDeployCmd);

	context.subscriptions.push(disposableConvert);
	context.subscriptions.push(disposableOptimize);
	context.subscriptions.push(disposableDeploy);
	context.subscriptions.push(disposableUpgrade);

    vscode.window.registerWebviewViewProvider("hack.convert.panel", hackConvertPanel);

	vscode.window.onDidChangeActiveTextEditor((editor) => {
        if (editor && editor.document.uri.scheme === "untitled") {
            vscode.commands.executeCommand("setContext", "showApplyEditButton", true);
        } else {
            vscode.commands.executeCommand("setContext", "showApplyEditButton", false);
        }
    });

	const disposableConvertSelected = vscode.commands.registerCommand("hack-vsc-extension.hackConvertSelected", hackConvertSelected(context));

  context.subscriptions.push(disposableConvertSelected);
}

// 產生 Webview HTML，並支援 Syntax Highlight

// This method is called when your extension is deactivated
export function deactivate() {}
