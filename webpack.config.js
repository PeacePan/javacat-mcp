import path from 'path';
import { fileURLToPath } from 'url';
import nodeExternals from 'webpack-node-externals';
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin';

// ES 模塊中獲取 __dirname 的替代方案
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {  mode: 'production',
  entry: ['babel-polyfill', './src/index.ts'],
  target: 'node',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js',
    clean: true,
    // 輸出 CommonJS 模塊，這樣可以確保與 Node.js 更好的相容性
    module: false,
    library: {
      type: 'commonjs2'
    },
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: {
          loader: 'ts-loader',
          options: {
            transpileOnly: false,
            compilerOptions: {
              module: 'CommonJS', // 使用 CommonJS 模塊格式
            }
          }
        },
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
    plugins: [new TsconfigPathsPlugin()], // 解析 tsconfig 中的路徑
  },
};
