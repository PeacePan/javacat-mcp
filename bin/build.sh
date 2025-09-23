#!/bin/bash

echo "🚀 使用 webpack 建置 JavaCat MCP 伺服器..."

# 清理 dist 目錄
rm -rf dist
mkdir -p dist

echo "📦 webpack 編譯..."
npx webpack --mode=production

# 添加 shebang 讓檔案可執行
echo "🔧 添加執行權限..."
sed -i '1i#!/usr/bin/env node' dist/index.js
chmod +x dist/index.js

echo "✅ 建置完成！編譯後的 JavaScript 檔案在 dist/index.js"
echo "🚀 可以執行 'npm start' 或 'npx javacat-mcp' 來啟動伺服器"