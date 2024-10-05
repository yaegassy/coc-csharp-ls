# coc-csharp-ls

[csharp-language-server](https://github.com/razzmatazz/csharp-language-server) (csharp-ls) extension for coc.nvim

## Install

**e.g. vim-plug**:

```vim
Plug 'yaegassy/coc-coc-csharp-ls', {'do': 'yarn install --frozen-lockfile'}
```

## Note

You need to install the [csharp-language-server](https://github.com/razzmatazz/csharp-language-server) and ensure the `csharp-ls` command is available in your execution path.

## Configuration options

- `csharp-ls.enable`: Enable coc-csharp-ls extension, default: `true`
- `csharp-ls.path`: Custom executable path for the `csharp-ls` binary, default: `""`
- `csharp-ls.args`: Additional command-line arguments. Check the arguments using `csharp-ls --help`, default: `[]`
- `csharp-ls.trace.server`: Traces the communication between coc.nvim and the csharp-ls, default: `off`

## Thanks

- [razzmatazz/csharp-language-server](https://github.com/razzmatazz/csharp-language-server)
- [vytautassurvila/vscode-csharp-ls](https://github.com/vytautassurvila/vscode-csharp-ls)

## License

MIT

---

> This extension is built with [create-coc-extension](https://github.com/fannheyward/create-coc-extension)
