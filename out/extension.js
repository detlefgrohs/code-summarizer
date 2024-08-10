"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
const vscode_1 = require("vscode");
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "code-summarizer" is now active!');
    // The command has been defined in the package.json file
    // Now provide the implementation of the command with registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand('extension.InsertSummary', () => {
        // The code you place here will be executed every time your command is executed
        let linecount = summarizer.Linecount;
        // Display a message box to the user
        vscode.window.showInformationMessage(`Linecount: ${linecount}`);
    });
    context.subscriptions.push(disposable);
    let summarizer = new Summarizer();
    let controller = new MyController(summarizer);
    // Add to a list of disposables which are disposed when this extension is deactivated.
    context.subscriptions.push(controller);
    context.subscriptions.push(summarizer);
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
class Summarizer {
    constructor() {
        this._statusBarItem = vscode_1.window.createStatusBarItem(vscode_1.StatusBarAlignment.Left);
        this.Linecount = 0;
    }
    Update() {
        // Get the current text editor
        let editor = vscode_1.window.activeTextEditor;
        if (!editor) {
            this._statusBarItem.hide();
            return;
        }
        let selection = editor.selection;
        let text = editor.document.getText(selection);
        this.Linecount = this._GetLineCount(text);
        this._statusBarItem.text = `Summarizer: ${this.Linecount}`;
        this._statusBarItem.show();
    }
    _GetLineCount(doc) {
        let lines = doc.trim().split('\n');
        return lines.length;
    }
    dispose() {
        this._statusBarItem.dispose();
    }
}
class MyController {
    constructor(Summarizer) {
        this._Summarizer = Summarizer;
        // subscribe to selection change and editor activation events
        let subscriptions = [];
        vscode_1.window.onDidChangeTextEditorSelection(this._onEvent, this, subscriptions);
        vscode_1.window.onDidChangeActiveTextEditor(this._onEvent, this, subscriptions);
        // update the counter for the current file
        this._Summarizer.Update();
        // create a combined disposable from both event subscriptions
        this._disposable = vscode_1.Disposable.from(...subscriptions);
    }
    dispose() {
        this._disposable.dispose();
    }
    _onEvent() {
        this._Summarizer.Update();
    }
}
//# sourceMappingURL=extension.js.map