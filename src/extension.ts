// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

class I18nConversionActionProvider implements vscode.CodeActionProvider {
	public provideCodeActions(document: vscode.TextDocument, range: vscode.Range): vscode.CodeAction[] {
		let text = document.getText(range);
		if (text[0] === text[text.length - 1] && /'|"|`/.test(text[0])) {
			const actions = [];
			let nextText = '';
			let edit = null;

			// linguijs v0.x
			nextText = 'i18n.t`' + text.substr(1, text.length - 2) + '`';
			edit = new vscode.WorkspaceEdit();
			edit.replace(document.uri, range, nextText);
			actions.push({
				edit,
				title: 'Convert to [' + nextText + '] (linguijs v0.x)',
				kind: vscode.CodeActionKind.QuickFix,
				isPreferred: true,
			});

			// linguijs v2.x
			nextText = 'i18n._(t`' + text.substr(1, text.length - 2) + '`)';
			edit = new vscode.WorkspaceEdit();
			edit.replace(document.uri, range, nextText);
			actions.push({
				edit,
				title: 'Convert to [' + nextText + '] (linguijs v1.x)',
				kind: vscode.CodeActionKind.QuickFix,
				isPreferred: true,
			});

			return actions;
		} else {
			const nextText = '<Trans>' + text + '</Trans>';
			const edit = new vscode.WorkspaceEdit();
			edit.replace(document.uri, range, nextText);
			return [{
				edit,
				title: 'Convert to <strong style="color:red;"><i><</i>Trans>' + nextText + '<i><</i><i>/</i>Trans></strong>',
				kind: vscode.CodeActionKind.QuickFix,
				isPreferred: true,
			}];
		}
	}
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
	context.subscriptions.push(registerActionProvider());
}

// this method is called when your extension is deactivated
export function deactivate() {}
