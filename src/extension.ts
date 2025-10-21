import * as vscode from "vscode";
import { logger } from "./logger";
import { storage } from "./storage";

// Export version from package.json
export const VERSION = "2.0.0";

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
      "CodeArt VS Code extension is a community fork with enhanced features and better customization. We're committed to maintaining and improving this extension.",
      "Learn More",
    )
    .then((selection) => {
      if (selection === "Learn More") {
        vscode.env.openExternal(
          vscode.Uri.parse("https://github.com/pywind/codeart-extension"),
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
