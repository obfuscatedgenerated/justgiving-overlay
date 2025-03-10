const path = require("path");
const { DefinePlugin } = require("webpack");

module.exports = {
    entry: "./src/index.ts",
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: "ts-loader",
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"],
    },
    output: {
        filename: "public/bundle.js",
        path: path.resolve(__dirname, "dist"),
    },
    devServer: {
        port: 3000,
        static: {
            directory: path.join(__dirname, "/"),
        }
    },
    plugins: [
        new DefinePlugin({
            __MODE__: JSON.stringify(process.env.NODE_ENV || "development")
        })
    ]
};
