const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const Dotenv = require("dotenv-webpack");

module.exports = {
  entry: "./src/index.js",

  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "main.js",
    publicPath: "/",
  },

  mode: "development",
  devtool: "cheap-module-source-map",
  devServer: {
    // host: "0.0.0.0",
    port: 9000,
    allowedHosts: "all",
    historyApiFallback: true,
    // add the proxy to the webpack substitutes the ngrok service
    proxy: {
      "/api": {
        target: "http://localhost:9000",
        router: () => "http://localhost:3000",
        logLevel: "debug",
      },
      "/socket.io": {
        target: "http://localhost:9000",
        router: () => "http://localhost:3000",
        ws: true,
      },
      "/": {
        target: "http://localhost:9000",
        router: () => "http://localhost:3000",
        secure: false,
      },
    },
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"],
          },
        },
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, { loader: "css-loader", options: { importLoaders: 1 } }, "postcss-loader"],
      },
      {
        test: /\.(woff|woff2|ttf|otf|eot)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              outputPath: "fonts",
            },
          },
        ],
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              outputPath: "images",
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "main.css",
    }),
    new HtmlWebpackPlugin({
      template: "./public/index.html",
      inject: "body",
    }),
    new CopyWebpackPlugin({
      patterns: [{ from: path.resolve(__dirname, "./src/assets"), to: "./assets" }],
    }),
    new Dotenv(),
  ],
};
