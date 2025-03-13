const path = require("path");
const { DefinePlugin } = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

// detect if server is running or this is a build
const is_server = process.env.WEBPACK_SERVE === "true";

module.exports = {
    entry: "./src/index.ts",
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: "ts-loader",
                exclude: /node_modules/,
            },
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"],
            },
        ],
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"],
    },
    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname, "dist"),
        publicPath: is_server ? path.resolve(__dirname, "dist") : "https://ollieg.codes/justgiving-overlay/"

    },
    devServer: {
        port: 3000,
        static: {
            directory: path.join(__dirname, "dist"),
        },
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./src/index.html",
            inject: false
        }),
        new CopyPlugin({
            patterns: [
                { from: "public", to: "public" },
            ],
        }),
        new DefinePlugin({
            __MODE__: JSON.stringify(process.env.NODE_ENV || "development")
        })
    ]
};
