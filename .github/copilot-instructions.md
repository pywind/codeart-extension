## What this repository is (short)

CodeArt is a VS Code extension that provides AI-powered inline completions and chat (panel + inline). It wires VS Code Chat and Inline Completion APIs to a set of interchangeable model providers (OpenAI, Anthropic, Azure, Mistral, etc.). The extension prefers using VS Code proposed AI/chat APIs and stores model configuration in global state.

## Big picture architecture (2–3 lines)

- Activation: `src/extension.ts` → lazy-load via `src/lazy-load.ts` → runtime adjustments in `src/startup.ts` (argv.json, package.json, enable-proposed-api).
- Session management: `src/session.ts` manages GitHub auth and registers features (Inline completions, Inline chat, Panel chat).
- Model plumbing: `src/providers/index.ts` registers concrete provider classes (e.g. `src/providers/openai.ts`) and selects providers by `storage.usage` preferences.

## Immediate tasks an agent can help with

- Implement or fix a specific model provider (look under `src/providers/*`). Follow `ModelProviderManager` patterns: providers expose `.initialize()`, `.invoke()`/`.model()`, and `.encode()`/`.decode()` where applicable.
- Update prompts in `src/prompts/*` — they build CoreMessage arrays and are used by `panel-chat.ts` and `inline-chat.ts`.
- Tests & build fixes: run `npm run compile` (webpack) and `npm run lint` to catch TypeScript/ESLint issues.

## Developer workflows / useful commands

- Build the extension bundle: npm run compile (uses `webpack` and outputs to `out/`).
- Watch build during development: npm run watch (webpack --watch).
- Run tests: npm run test (uses `@vscode/test-cli`).
- Format & lint: npm run format && npm run lint.
- Pre-activation behaviour: `src/startup.ts` edits your local VS Code `argv.json` to enable proposed API and log-levels; prefer editing `argv.json` manually in test environments to avoid interactive prompts.

## Project-specific conventions and patterns (concrete)

- Singleton managers: Features like `SessionManager`, `ModelProviderManager`, `VariablesManager` use singletons and register disposables on the extension `context.subscriptions`.
- Storage: Use the exported `storage` instance (`src/storage.ts`) for everything global; model providers are stored under keys `model.providers.<id>` and usage preferences under `usage.preferences.<location>`.
- Events: The internal `events` bus triggers re-initialization (see `ModelProviderManager` listening for `modelProvidersUpdated`). Use `events.fire({ name, payload })` to trigger updates.
- Encoding/decoding tokens: Provider implementations expose `encode()` and `decode()` helper calls used by `src/completion.ts` to trim prompt windows.
- Chat participants: `panel-chat.ts` and `inline-chat.ts` use `vscode.chat.createChatParticipant` and stream model output with `streamText`/`generateText` from the `ai` package.

## Integration points & external dependencies

- VS Code Proposed APIs (chat, inline completions). Files that configure them: `src/startup.ts`, `package.json` (`enabledApiProposalsOriginal`). Tests and CI may require enabling proposed APIs in your test runner's `argv.json`.
- AI SDKs in `package.json` under `dependencies` (OpenAI, Anthropic, Mistral, google, etc.). Model provider adapters live in `src/providers/*.ts` and must implement the project's provider interface (see `ModelProviders` array in `src/providers/index.ts`).
- Uses `ai` package for streaming: `streamText`, `generateText`.

## Quick code examples (copyable references)

- To find provider lookup and initialization: `src/providers/index.ts` → ModelProviderManager.updateProviders()
- To see how completions are built: `src/completion.ts` → header construction, token truncation, and provider.invoke({ messages, maxTokens, stop, temperature })
- To add a new provider: copy pattern used by `src/providers/openai.ts` and register class in `ModelProviders` array. Ensure `.providerId` and `.providerType` match expected values.

## Pitfalls and gotchas (concrete)

- Activation is interactive: `startup.ts` may open the runtime arguments editor and expects the user to save `argv.json`. For CI or automated testing, pre-configure `argv.json` to include the extension id under `enable-proposed-api` and log-level entries.
- Many features require an authenticated GitHub session for the participant requester (see `storage.session.get()` usage). Tests should stub `vscode.authentication.getSession` or set storage.session manually.
- Avoid editing package.json's contributes from tests unless you truly intend to persist changes — `startup.ts` may write to the extension's package.json on disk.

## Where to look first (files to open)

- Activation & bootstrap: `src/extension.ts`, `src/lazy-load.ts`, `src/startup.ts`
- Session & registration: `src/session.ts`
- Completion logic: `src/completion.ts`
- Chat handling: `src/panel-chat.ts`, `src/inline-chat.ts`
- Model adapters: `src/providers/*.ts`
- Global helpers: `src/storage.ts`, `src/logger.ts`, `src/utilities.ts`

## Style and minimal contract for changes

- Small change rule: provide a unit or integration test when behaviour of an exported API changes. Use `npm run compile-tests` target to compile tests.
- When adding providers: implement `.initialize()`, `.model()` (returns model identifier for `ai`), and tokenizers (`encode`/`decode`) if used by completions.

---

If anything here is unclear or you'd like more examples (e.g., add a new provider step-by-step or a minimal test harness), tell me which part to expand and I will update the file.
