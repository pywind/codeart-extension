import * as vscode from "vscode";
import { logger } from "./logger";
import { storage } from "./storage";

/**
 * Activates the extension.
 */
export async function activate(context: vscode.ExtensionContext) {
  // log system information
  logger.info("VS Code Version:", vscode.version);
  logger.info("Node Version:", process.version);
  logger.info("Platform:", process.platform);
  logger.info("CPU Architecture:", process.arch);
  logger.info("Extension ID:", context.extension.id);
  logger.info("Extension Version:", context.extension.packageJSON.version);
  logger.info("Extension Path:", context.extension.extensionPath);

  // log workspace information
  (vscode.workspace.workspaceFolders || []).forEach((folder) => {
    logger.info("Workspace Name:", folder.name);
    logger.info("Workspace URI:", folder.uri.toString());
  });
  logger.info("Environment Variables:", process.env);

  // Initialize the storage manager
  storage.setContext(context);

  // Register the logger with the context
  context.subscriptions.push(logger);

  // Show a warning message to users
  vscode.window
    .showWarningMessage(
      "Flexpilot VS Code extension is no longer actively maintained; switch to Flexpilot IDE, a VS Code fork with better performance, multi-file editing, a web client, and more features. We will still try to address issues and pull requests, but we won't be adding new features to this extension.",
      "Download Flexpilot IDE",
    )
    .then((selection) => {
      if (selection === "Download Flexpilot IDE") {
        vscode.env.openExternal(
          vscode.Uri.parse(
            "https://flexpilot.ai/docs/getting-started#downloading-the-ide",
          ),
        );
      }
    });

  // Show message to user to hide the default copilot signup page
  if (!context.globalState.get("hideWarningMessage")) {
    vscode.window
      .showWarningMessage(
        "If you see a Copilot signup page in the chat panel by default, please click the 'Hide Copilot' button to dismiss it.",
        "Hide Default Copilot Sign Up",
        "Don't Show Again",
      )
      .then((selection) => {
        if (selection === "Don't Show Again") {
          context.globalState.update("hideWarningMessage", true);
        } else if (selection === "Hide Default Copilot Sign Up") {
          vscode.commands.executeCommand("workbench.action.chat.hideSetup");
        }
      });
  }

  // lazy load the extension
  await (await import("./lazy-load.js")).activate();
}
