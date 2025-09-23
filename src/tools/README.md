# JavaCat MCP Tools

## 📁 檔案結構

```
src/
├── index.ts                    # 主要入口檔案
└── tools/                     # 工具檔案夾
    ├── index.ts               # 工具匯出檔案
    ├── types.ts               # 型別定義
    ├── searchErrorTodoJobs.ts # 查詢錯誤待辦工作歷程
    ├── queryTableRecords.ts   # 進階表格查詢工具
    ├── quickQueryTable.ts     # 快速表格查詢工具
    ├── getTableSchema.ts      # 取得表格結構
    └── listAvailableTables.ts # 列出可用表格
```

## 🛠️ 工具說明

### 1. queryTableRecords
- **功能**: 進階表格查詢工具
- **用途**: 支援複雜查詢條件的通用表格查詢工具
- **特色**: 
  - 支援多種資料型別過濾
  - 支援表頭和表身條件
  - 支援排序和分頁
  - 支援封存狀態和簽核狀態篩選

### 2. quickQueryTable
- **功能**: 快速表格查詢工具
- **用途**: 簡單快速的表格查詢
- **特色**:
  - 簡化的參數設定
  - 基本欄位篩選
  - 日期範圍篩選
  - 適合快速查看資料

### 3. getTableSchema
- **功能**: 取得表格結構定義
- **用途**: 了解表格的欄位結構和資料型別
- **特色**: 幫助用戶了解可查詢的欄位

### 4. listAvailableTables
- **功能**: 列出系統中可用的表格
- **用途**: 探索系統中有哪些表格可以查詢
- **特色**: 支援按類型篩選 (系統表格/資料表格)

## 🏗️ 架構設計

### ToolContext
所有工具都接收一個 `ToolContext` 物件，包含：
- `graphqlClient`: GraphQL 客戶端實例

### ToolDefinition
統一的工具定義介面，包含：
- `name`: 工具名稱
- `description`: 工具描述
- `parameters`: Zod 參數驗證架構
- `execute`: 執行函數

## 📦 如何新增工具

1. 在 `tools/` 資料夾中創建新的工具檔案
2. 實作工具函數，回傳 `ToolDefinition`
3. 在 `tools/index.ts` 中匯出新工具
4. 將工具加入 `getAllTools` 函數中

### 範例：

```typescript
// tools/myNewTool.ts
import { z } from 'zod';
import { ToolContext, ToolDefinition } from './types';

export const myNewTool = (context: ToolContext): ToolDefinition => ({
    name: 'myNewTool',
    description: '我的新工具',
    parameters: z.object({
        param1: z.string().describe('參數1'),
    }),
    execute: async (args: { param1: string }) => {
        // 實作邏輯
        return JSON.stringify({ result: 'success' });
    },
});
```

## 🚀 啟動方式

```bash
# 安裝依賴
npm install

# 啟動伺服器
npm start
```

伺服器會在 port 54088 上啟動，並載入所有定義的工具。