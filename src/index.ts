import {
  DocumentSelector,
  Executable,
  ExtensionContext,
  LanguageClient,
  LanguageClientOptions,
  ServerOptions,
  services,
  TextDocumentContentProvider,
  Thenable,
  Uri,
  window,
  workspace,
} from 'coc.nvim';

import which from 'which';

let client: LanguageClient | undefined = undefined;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function activate(_context: ExtensionContext): Promise<void> {
  if (!workspace.getConfiguration('csharp-ls').get('enable')) return;

  const outputChannel = window.createOutputChannel('csharp-ls');

  const csharpLsBinaryPath = await getCsharpLsBinaryPath();
  if (!csharpLsBinaryPath) {
    window.showErrorMessage('"csharp-ls" command was not found.');
    return;
  }

  const csharpLsArgs = workspace.getConfiguration('csharp-ls').get<string[]>('args', []);

  const csharpLsExecutable: Executable = {
    command: csharpLsBinaryPath,
    args: csharpLsArgs,
    options: {
      shell: true,
    },
  };

  const serverOptions: ServerOptions = {
    run: csharpLsExecutable,
    debug: csharpLsExecutable,
  };

  const documentSelector: DocumentSelector = ['cs', 'csharp'];

  const clientOptions: LanguageClientOptions = {
    documentSelector,
    synchronize: {
      fileEvents: workspace.createFileSystemWatcher('**/.{cs,csproj}'),
    },
    outputChannel,
    progressOnInitialization: true,
  };

  client = new LanguageClient('csharp-ls', 'csharp-ls', serverOptions, clientOptions);

  registerTextDocumentContentProviders();

  services.registerLanguageClient(client);
}

export function deactivate(): Thenable<void> | undefined {
  if (!client) {
    return undefined;
  }
  return client.stop();
}

interface CSharpMetadataResponse {
  projectName: string;
  assemblyName: string;
  symbolName: string;
  source: string;
}

function registerTextDocumentContentProviders() {
  const csharpMetadataProvider = new (class implements TextDocumentContentProvider {
    async provideTextDocumentContent(uri: Uri): Promise<string> {
      const response = await client?.sendRequest<CSharpMetadataResponse>('csharp/metadata', {
        textDocument: {
          uri: uri.toString(),
        },
      });

      return response?.source ?? '';
    }
  })();

  workspace.registerTextDocumentContentProvider('csharp', csharpMetadataProvider);
}

export async function getCsharpLsBinaryPath() {
  // MEMO: Priority to detect csharp-ls binary
  //
  // 1. csharp-ls.path setting
  // 2. current environment

  // 1
  let binaryPath = workspace.getConfiguration('csharp-ls').get('path', '');
  if (!binaryPath) {
    // 2
    binaryPath = which.sync('csharp-ls', { nothrow: true }) || '';
  }

  return binaryPath;
}
