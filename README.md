# JavaCat MCP 伺服器

## 概述
JavaCat MCP 是一個使用 FastMCP 框架建立的簡易 Model Context Protocol (MCP) 伺服器。它提供了多個實用工具，可以通過 MCP 客戶端進行訪問。

## 功能

此伺服器提供以下功能：

1. 數學計算工具 - 將兩個數字相加
2. 問候工具 - 根據提供的姓名生成問候訊息
3. 網頁內容獲取工具 - 獲取指定 URL 的網頁內容 (模擬)
4. 資料處理工具 - 處理資料並顯示實時進度 (展示進度報告和流式輸出功能)
5. 文字圖片生成工具 - 產生包含指定文字的簡單圖片 (展示圖片輸出功能)

## 安裝
要開始使用此專案，請安裝相關依賴：

```bash
cd javacat-mcp-server
npm install
```

## 使用方法

### 啟動伺服器

```bash
npm start
```

### 使用 MCP Inspector 測試

使用 FastMCP 自帶的 inspect 命令測試服務器：

```bash
npx fastmcp inspect src/index.ts
```

## 工具列表

### add

將兩個數字相加

參數:
- `a`: 第一個數字
- `b`: 第二個數字

### greet

問候使用者

參數:
- `name`: 使用者名稱

### fetch-webpage

獲取網頁內容

參數:
- `url`: 網頁的 URL

### process-data

處理資料並顯示進度，展示 FastMCP 的進度報告和流式輸出功能

參數:
- `datasetSize`: 資料集大小

### generate-text-image

生成一個簡單的文字圖片，展示 FastMCP 的圖片輸出功能

參數:
- `text`: 要在圖片上顯示的文字
- `backgroundColor`: 背景顏色 (可選，例如 #FF0000)

## 技術資訊

- 使用 TypeScript 開發
- 基於 FastMCP 框架
- 使用 zod 進行參數驗證

The server will initialize and listen for incoming connections.

## Configuration
The server configuration can be found in `src/server/config.ts`. You can modify the port number and other settings as needed.

## Contributing
If you would like to contribute to the project, please fork the repository and submit a pull request.

## License
This project is licensed under the ISC License.