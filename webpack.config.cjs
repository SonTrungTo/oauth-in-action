const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HTMLWebpackPlugin = require("html-webpack-plugin");
const MiniCSSExtractPlugin = require("mini-css-extract-plugin");

const { ENV } = process.env;
const DIST = path.join(__dirname, "./dist");
const SOURCE = path.join(__dirname, "./source");

module.exports = {
    mode: ENV === "staging" ? "development" : "production",

    devtool: false,

    entry: path.join(SOURCE, "./client/index.tsx"),

    output: {
        path: path.join(DIST, "/public"),
        filename: "[name].js",
        publicPath: "/public",
    },

    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: [
                    {
                        loader: "ts-loader",
                        options: {
                            configFile: path.join(__dirname, "./tsconfig.web.json")
                        },
                        exclude: path.resolve(__dirname, "node_modules")
                    }
                ],
            },
            {
                test: /\.pug$/,
                loader: "pug-loader",
            },
            {
                test: /\.sass$/,
                use: [
                    MiniCSSExtractPlugin.loader,
                    "css-loader",
                    {
                        loader: "sass-loader",
                        options: {
                            // Prefer 'dart-sass'
                            implementation: require("sass"),
                        },
                    }
                ]
            },
        ]
    },

    resolve: {
        extensions: [".tsx", ".ts", ".js"],
    },

    target: "web",

    optimization: {

    }
}
