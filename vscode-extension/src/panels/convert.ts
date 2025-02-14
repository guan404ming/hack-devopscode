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
    this._view?.webview.postMessage(data);
  }

  private getHtml(): string {
    return `<!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        pre {
          background-color: #2d2d2d;
          border: 1px solid #999999;
          display: block;
          padding: 10px;
        }
        .dot {
            opacity: 0;
            animation: blink 1.5s infinite;
        }

        .dot:nth-child(1) { animation-delay: 0s; }
        .dot:nth-child(2) { animation-delay: 0.3s; }
        .dot:nth-child(3) { animation-delay: 0.6s; }

        @keyframes blink {
            0% { opacity: 0; }
            50% { opacity: 1; }
            100% { opacity: 0; }
        }
      </style>

    </head>
    <body>
      <h2>Hack Convert</h2>
      <pre id=waiting>Run command "Hack: Convert" to continue...</pre>
      <pre id=loading style="display: none;"><span class="dot">.</span><span class="dot">.</span><span class="dot">.</span></pre>
      <pre id=code style="display: none;">Convert Successfully!</pre>

      <script>
        const vscode = acquireVsCodeApi();

        function showOnlyPreWithId(id) {
          const preElements = document.querySelectorAll('pre');
          
          preElements.forEach(pre => {
            pre.style.display = 'none';
          });

          const preToShow = document.getElementById(id);
          if (preToShow) {
            preToShow.style.display = 'block';
          }
        }

        window.addEventListener("message", event => {
          const message = event.data;
          showOnlyPreWithId(message.state);
        });
      </script>
    </body>
    </html>`;
  }
}

export const hackConvertPanel = new hackConvertPanelProvider();
