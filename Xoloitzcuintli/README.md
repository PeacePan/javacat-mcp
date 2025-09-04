# 共用代碼庫

1. 只允許 interfaces、純 ts 或 js 代碼，不允許引入有其他相依性的套件
1. import 路徑問題
   1. 須將此資料夾加入該專案的 tsconfig.json.compilerOptions.paths 內，以利 ts 編譯
   1. 如果啟用 server 使用的設定檔不同，也需加入 paths（i.e. tsconfig.server.json）
   1. 承上，若啟動 server 是以 ts-node 啟動，不透過 webpack 的話，會需要 [tsconfig-paths](https://www.npmjs.com/package/tsconfig-paths) 註冊路徑
      > 補充：VScode 通常只吃專案底下的 tsconfig.json，固有可能發生 vscode ts 編譯沒問題，但 run server 時編譯沒過
