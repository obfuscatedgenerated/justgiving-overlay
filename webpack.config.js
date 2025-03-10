const path = require("path");

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
    }
};