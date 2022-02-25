// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const CreateFile = require('./utils/createFile')
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "taro-pages" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let createTaroDir = vscode.commands.registerCommand('taro-pages.createTaroDir',  (param, edit, args) =>{
		// The code you place here will be executed every time your command is executed

		const options = {
			prompt: '请输入要创建的Page名称',
			placeHolder: 'Page文件夹名称',
		};

		vscode.window.showInputBox(options).then((value) => {
			if (!value) {
				return;
			}
			const pageName = value;
			if (param) {
				const folderPath = param.fsPath;
				CreateFile(folderPath, pageName);
			} else {
				console.log(vscode.window.activeTextEditor);
			}
		});

	});

	context.subscriptions.push(createTaroDir);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
