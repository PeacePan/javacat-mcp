const path = require('path');

module.exports = {
  entry: './src/index.ts',
  target: 'node',
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: {
          loader: 'ts-loader',
          options: {
            transpileOnly: true, // 跳過型別檢查
            compilerOptions: {
              noEmitOnError: false,
              skipLibCheck: true,
              noResolve: false,
            }
          }
        },
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
    alias: {
      '@norwegianForestLibs': path.resolve(__dirname, 'NorwegianForest/libs'),
      '@norwegianForestTypes': path.resolve(__dirname, 'NorwegianForest/libs/@types/index'),
      '@xolo': path.resolve(__dirname, 'Xoloitzcuintli'),
      // 添加更多缺失的路徑映射
      '@norwegianForestTables': path.resolve(__dirname, 'NorwegianForest/tables'),
      '@javaCat': path.resolve(__dirname, 'JavaCat'),
    },
  },
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist'),
  },
  externals: {
    // 排除 Node.js 內建模組和 npm 依賴
    ...require('webpack-node-externals')(),
  },
  optimization: {
    minimize: false, // 保持可讀性
  },
  stats: {
    errorDetails: false,
    warnings: false,
  },
  ignoreWarnings: [
    /Critical dependency/,
    /Can't resolve/,
    /Module not found/,
  ],
};