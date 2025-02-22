export const detectLanguage = (filename: string): string => {
  // 先轉換檔名為小寫以確保匹配
  const lowercaseFilename = filename.toLowerCase();

  // 如果檔名是 Dockerfile，直接返回
  if (lowercaseFilename === 'dockerfile') {
    return 'dockerfile';
  }

  const extensionMap: Record<string, string> = {
    // JavaScript 相關
    js: 'javascript',
    jsx: 'javascript',
    mjs: 'javascript',
    cjs: 'javascript',

    // TypeScript 相關
    ts: 'typescript',
    tsx: 'typescript',
    mts: 'typescript',
    cts: 'typescript',

    // Python 相關
    py: 'python',
    pyw: 'python',
    ipynb: 'python',

    // Java 相關
    java: 'java',
    class: 'java',
    jar: 'java',

    // C/C++ 相關
    c: 'c',
    h: 'c',
    cpp: 'cpp',
    cc: 'cpp',
    cxx: 'cpp',
    hpp: 'cpp',
    hxx: 'cpp',

    // Web 相關
    html: 'html',
    htm: 'html',
    css: 'css',
    scss: 'scss',
    sass: 'scss',
    less: 'less',
    svg: 'xml',

    // 配置文件
    json: 'json',
    yaml: 'yaml',
    yml: 'yaml',
    toml: 'toml',
    xml: 'xml',

    // Shell 相關
    sh: 'shell',
    bash: 'shell',
    zsh: 'shell',
    fish: 'shell',

    // 其他常見語言
    go: 'go',
    rs: 'rust',
    rb: 'ruby',
    php: 'php',
    swift: 'swift',
    kt: 'kotlin',
    scala: 'scala',
    r: 'r',
    m: 'objective-c',
    mm: 'objective-c',
    sql: 'sql',
    md: 'markdown',
    vue: 'vue',
    svelte: 'svelte',
    dart: 'dart',
    ex: 'elixir',
    exs: 'elixir',
    erl: 'erlang',
    fs: 'fsharp',
    fsx: 'fsharp',
    hs: 'haskell',
    lhs: 'haskell',
    lua: 'lua',
    pl: 'perl',
    pm: 'perl',
    ps1: 'powershell',
    psm1: 'powershell',
    psd1: 'powershell',
  };

  const extension = lowercaseFilename.split('.').pop() || '';
  return extensionMap[extension] || 'plaintext';
};
