# Changelog

All notable changes to the CodeArt extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2025-10-21

### Changed

- **Major Rebranding**: Renamed from Flexpilot to CodeArt throughout the entire codebase
  - Updated extension name, display name, and publisher
  - Changed all command IDs from `flexpilot.*` to `codeart.*`
  - Updated configuration settings from `flexpilot.*` to `codeart.*`
  - Renamed chat participants and icon identifiers
  - Updated repository references from `flexpilot-ai/vscode-extension` to `pywind/codeart-extension`
- **Repository Migration**: Project moved to new GitHub organization
  - New repository: https://github.com/pywind/codeart-extension
  - Updated all documentation links and references
  - Updated CDN links for tokenizers
- **Documentation Updates**:
  - Updated README.md with new branding and links
  - Updated CONTRIBUTING.md with new contact information
  - Updated CODE_OF_CONDUCT.md contact email
  - Updated walkthrough documentation
- **Configuration Changes**:
  - Updated VS Code workspace settings
  - Updated launch configuration for development
  - Changed environment variable from `FLEXPILOT_DEV_MODE` to `CODEART_DEV_MODE`
- **Icon and UI Updates**:
  - Renamed icon identifiers from `flexpilot-*` to `codeart-*`
  - Updated icon font ID to `codeart-font`
  - Updated status bar item labels and tooltips

### Breaking Changes

- All configuration settings have been renamed. Users will need to reconfigure their settings:
  - `flexpilot.completions.*` → `codeart.completions.*`
  - `flexpilot.panelChat.*` → `codeart.panelChat.*`
  - `flexpilot.inlineChat.*` → `codeart.inlineChat.*`
  - `flexpilot.chatSuggestions.*` → `codeart.chatSuggestions.*`
  - `flexpilot.chatTitle.*` → `codeart.chatTitle.*`
  - `flexpilot.gitCommitMessage.*` → `codeart.gitCommitMessage.*`
- Extension ID changed from `flexpilot.flexpilot-vscode-extension` to `pywind.codeart-vscode-extension`
- All commands have new IDs and will need to be updated in keybindings or scripts
- Context keys changed from `flexpilot:*` to `codeart:*`

### Notes

This is a fork and continuation of the Flexpilot project with new maintainership and branding. The core functionality remains the same, with commitment to ongoing maintenance and feature development.

## Previous Versions

For version history prior to 2.0.0, please refer to the original Flexpilot project at https://github.com/flexpilot-ai/vscode-extension

[2.0.0]: https://github.com/pywind/codeart-extension/releases/tag/v2.0.0
