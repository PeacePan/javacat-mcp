#!/bin/bash

echo "🚀 使用 webpack 建置 JavaCat MCP 伺服器..."

# 清理 dist 目錄
rm -rf dist
mkdir -p dist

echo "📦 webpack 編譯..."
npx webpack --mode=production

# 添加 shebang 讓檔案可執行 (跨平台相容)
echo "🔧 添加執行權限..."

# 檢測作業系統並使用相應的方法添加 shebang
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    echo '#!/usr/bin/env node' > dist/temp.js
    cat dist/index.js >> dist/temp.js
    mv dist/temp.js dist/index.js
elif [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" || "$OSTYPE" == "cygwin" ]]; then
    # Windows (Git Bash/MSYS2/Cygwin)
    echo '#!/usr/bin/env node' > dist/temp.js
    cat dist/index.js >> dist/temp.js
    mv dist/temp.js dist/index.js
else
    # Linux 和其他 Unix-like 系統
    sed -i '1i#!/usr/bin/env node' dist/index.js
fi

# 設定執行權限 (Windows 上會被忽略，但不會報錯)
chmod +x dist/index.js 2>/dev/null || true

echo "✅ 建置完成！編譯後的 JavaScript 檔案在 dist/index.js"
echo "🚀 可以執行 'npm start' 或 'npx javacat-mcp' 來啟動伺服器"