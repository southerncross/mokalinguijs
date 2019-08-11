// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

const CONVERSION_COMMAND:string = 'moka.i18n.conversion';

class I18nConversionActionProvider implements vscode.CodeActionProvider {
	public provideCodeActions(document: vscode.TextDocument, range: vscode.Range): vscode.Command[] {
		const text = document.getText(range);
		if (/^('|"|`).*('|"|`)$/.test(text)) {
			const nextText = 'i18n.t`' + text.substr(1, text.length - 2) + '`';
			return [{
				command: CONVERSION_COMMAND,
				title: 'Convert to [' + nextText + ']',
				tooltip: 'Convert to i18n string',
				arguments: [document, range, nextText],
			}];
		} else {
			return [];
		}
	}
}

function registerConversionCommand(): vscode.Disposable {
	return vscode.commands.registerCommand(CONVERSION_COMMAND, (document: vscode.TextDocument, range: vscode.Range, nextText: string) => {
		const edit = new vscode.WorkspaceEdit();
		const text = document.getText(range);
		edit.replace(document.uri, range, nextText);
		vscode.workspace.applyEdit(edit);
	});
}

function registerActionProvider(): vscode.Disposable {
	return vscode.languages.registerCodeActionsProvider(
		{ language: 'javascript', scheme: 'file' },
		new I18nConversionActionProvider(),
	);
}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	context.subscriptions.push(registerConversionCommand());
	context.subscriptions.push(registerActionProvider());
}

// this method is called when your extension is deactivated
export function deactivate() {}
