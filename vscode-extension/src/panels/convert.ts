import * as vscode from "vscode";

export class hackConvertPanelProvider implements vscode.WebviewViewProvider {
  private _view?: vscode.WebviewView;

  constructor() {}

  resolveWebviewView(webviewView: vscode.WebviewView) {
    this._view = webviewView;
    webviewView.webview.options = { enableScripts: true };
    webviewView.webview.html = this.getHtml();
  }

  async updatePanel(data: any) {
    console.log(JSON.stringify(data));
    for (const [key, value] of Object.entries(data)) {
        this.updateElement(key, value);
    }
  }

  async updateElement(element: string, text: any) {
    console.log(`element: ${element}`)
    console.log(`text: ${text}`)
    this._view?.webview.postMessage({ element: element, text: text});
  }

  private getHtml(): string {
    return `<!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
    </head>
    <body>
      <h2>Hack Convert</h2>
      <h3>Converted Code</h3>
      <pre id=code></pre>

      <script>
        const vscode = acquireVsCodeApi();
        window.addEventListener("message", event => {
          const message = event.data;
          console.log(message);
          document.getElementById(message.element).innerText = message.text;
        });
      </script>
    </body>
    </html>`;
  }
}

export const hackConvertPanel = new hackConvertPanelProvider();
