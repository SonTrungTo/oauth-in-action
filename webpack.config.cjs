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
        automaticNameDelimiter: "-",
        maxSize: 200000,
        minSize: 10000,
        hidePathInfo: false,
        maxAsyncRequests: 10,
        cacheGroups: {
            default: false,
            common: {
                test: /[\\/]node_modules[\\/]/,
                chunks: "all",
                name: (module, chunks, cacheGroupsKey) => {
                    const moduleFileName = module.identifier().split("/").reduceRight(item => item);
                    const allChunksName = chunks.map(item => item.name).sort().join("-");
                    return `${cacheGroupsKey}-${allChunksName}-${moduleFileName}`;
                }
            }
        }
    },

    plugins: [
        new HTMLWebpackPlugin({
            filename: "../page/index.html",
            inject: true,
            template: path.resolve(__dirname, "./resources/index.html"),
            templateParameters: {
                title: "OAuth In Action",
            },
        }),
        new MiniCSSExtractPlugin({
            filename: "styles/[name].css",
        }),
    ],

    watch: true,
    watchOptions: {
        poll: 1000,
        aggregateTimeout: 200,
        ignored: /node_modules/,
    },
}
