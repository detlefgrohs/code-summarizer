// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { window, Disposable, ExtensionContext, StatusBarAlignment, StatusBarItem } from 'vscode';


// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
		console.log('Congratulations, your extension "code-summarizer" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('extension.InsertSummary', () => {
		// The code you place here will be executed every time your command is executed

		let linecount = summarizer.LineCount;
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

// this method is called when your extension is deactivated
export function deactivate() {}

class Summarizer {

	private _statusBarItem: StatusBarItem = window.createStatusBarItem(StatusBarAlignment.Left);

	public CharacterCount: number = 0;
	public LineCount: number = 0;
	public WordCount: number = 0;

	public Update() {
        // Get the current text editor
        let editor = window.activeTextEditor;
        if (!editor) {
            this._statusBarItem.hide();
            return;
        }

        let selection = editor.selection;
        let text = editor.document.getText(selection);

		this.CharacterCount = this._GetCharacterCount(text);
		this.LineCount = this._GetLineCount(text);
		this.WordCount = this._GetWordCount(text);

        this._statusBarItem.text = `Summarizer: ${this.LineCount}`;
        this._statusBarItem.show();
	}

	private _GetLineCount(doc: string): number {
		return doc.trim().split('\n').length;
	}
	
	private _GetCharacterCount(doc: string): number {
		return 0;
	}
	
	private _GetWordCount(doc: string): number {
		return 0;
	}
	
	dispose() {
        this._statusBarItem.dispose();
    }
}
class MyController {

    private _Summarizer: Summarizer;
    private _disposable: Disposable;

    constructor(Summarizer: Summarizer) {
        this._Summarizer = Summarizer;

        // subscribe to selection change and editor activation events
        let subscriptions: Disposable[] = [];
        window.onDidChangeTextEditorSelection(this._onEvent, this, subscriptions);
        window.onDidChangeActiveTextEditor(this._onEvent, this, subscriptions);

        // update the counter for the current file
        this._Summarizer.Update();

        // create a combined disposable from both event subscriptions
        this._disposable = Disposable.from(...subscriptions);
    }

    dispose() {
        this._disposable.dispose();
    }

    private _onEvent() {
        this._Summarizer.Update();
    }
}