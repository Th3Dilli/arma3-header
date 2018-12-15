'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "arma3-header" is now active!');

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    
    let disposable = vscode.commands.registerCommand('extension.a3InsertHeader', () => {
        

        let insert = "";
        let header = [
            "",
            "   Left Behind Mod",
            "   by Th3Dilli",
            "   <<authoremail>>",
            "   https://discord.gg/YUbUqAV",
            "",
            "   Copyright <<projectCreationYear>> - <<year>> <<name>>",
            "",
            "       <<filename>>",
            "",
            "   This work is licensed under the <<licensename>>.",
            "   To view a copy of this license, visit <<licenseurl>>.",
            ""
        ];
        let alwaysOnTop = true;
        let prefix = "<<";
        let postfix = ">>";
        let startChar = "/*";
        let midChar = " *";
        let endChar = " */";
        let variables = 
        [
            ["authoremail","dilli.1822@gmx.at"],
            ["author","Th3Dilli"],
            ["name","Left Behind Mod"],
            ["projectCreationYear","2018"],
            ["year","2018"],
            ["licensename","APL-ND"],
            ["licenseurl","http://www.license.com"]
        ];


        let editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage('No editor window found!!');
            return;
        }
        else
        {
            let ext =getCurFileext();
            let name = getCurFilename();
            
            if(name === null || ext === null)
            {
                console.log("no valid file found");
                vscode.window.showErrorMessage('no valid file found');
                return;
            }
            else
            {
                if(ext === "sqf")
                {
                    let nameSplit = name.split("_");
                    name = "LBCore_fnc_" + nameSplit[1];
                }
                variables.push(["filename",name]);

                insert += startChar + "\n";
                for (let index = 0; index < header.length; index++)
                {
                    for (let i = 0; i < variables.length; i++)
                    {    
                        let regEx = new RegExp(prefix + variables[i][0] + postfix);
                        let result = header[index].match(regEx);
                        if (result !== null)
                        {
                            header[index] = header[index].replace(regEx, variables[i][1]);
                        }
                    }
                    insert += midChar + header[index] + "\n";
                }
                insert += endChar + "\n";
                
                if(alwaysOnTop)
                {
                    const position = new vscode.Position(0, 0);
                    editor.selection = new vscode.Selection(position, position);
                }
                let selection = editor.selection;
                editor.edit(edit => { 
                                        edit.insert(selection.start, insert);
                                    });
                vscode.window.showInformationMessage('Header added!');
            }
        }
    });

    context.subscriptions.push(disposable);
}

export function getCurFilename()
{
    
    let editor = vscode.window.activeTextEditor;
    if(!editor)
    {
        vscode.window.showErrorMessage('vscode.window.activeTextEditor was not found!! :' + vscode.window.activeTextEditor);
        return null;
    }
    else
    {
        let regEx = new RegExp(/([^\\]+(?=\.))/,"igm");
        let filepath = editor.document.fileName;
        let result = filepath.match(regEx);
        console.log("getCurFilename");
        console.log(filepath);
        console.log(result);
        if(result === null || result[0] === "")
        {
            vscode.window.showErrorMessage('editor.document.fileName was not found!! :' + editor.document.fileName);
            return null;
        }
        else
        {
            return result[0];
        }
    }
}

export function getCurFileext()
{
    
    let editor = vscode.window.activeTextEditor;
    if(!editor)
    {
        vscode.window.showErrorMessage('vscode.window.activeTextEditor was not found!! :' + vscode.window.activeTextEditor);
        return null;
    }
    else
    {
        let regEx = new RegExp(/(\w+$)/,"igm");
        let filepath = editor.document.fileName;
        let result = filepath.match(regEx);
        console.log("getCurFileext");
        console.log(filepath);
        console.log(result);
        if(result === null || result[0] === "")
        {
            vscode.window.showErrorMessage('editor.document.fileName was not found!! :' + editor.document.fileName);
            return null;
        }
        else
        {
            return result[0];
        } 
    }
}

// this method is called when your extension is deactivated
export function deactivate() {
}