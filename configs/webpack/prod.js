// production config
const merge = require('webpack-merge');
const {resolve} = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');

const commonConfig = require('./common');
const dstPath = resolve(__dirname, '../../dist');

module.exports = merge(commonConfig, {
    mode: 'production',
    entry: './index.tsx',
    externals: {
        "react": "React",
        "vis": "vis"
    },
    optimization: {
        minimize: true,
        minimizer: [new TerserPlugin({
            terserOptions: {
                parse: {
                    ecma: 8
                },
                compress: {
                    ecma: 5,
                    warnings: false,
                    comparisons: false,
                    inline: 2
                },
                mangle: {
                    safari10: true
                },
                output: {
                    ecma: 5,
                    comments: false,
                    ascii_only: true
                }
            },
            cache: true,
            parallel: true,
            sourceMap: true, // Must be set to true if using source-maps in production
        })],
        splitChunks: {
            cacheGroups: {
                styles: {
                    name: 'styles',
                    test: /\.css$/,
                    chunks: 'all',
                    enforce: true,
                },
            },
        },
    },
    module: {
        rules: [
            {
                test: /\.(sa|sc|c)ss$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader
                    },
                    'css-loader',
                    'sass-loader',
                ],
            }
        ]
    },
    output: {
        filename: 'bundle.[hash].min.js',
        path: dstPath,
        publicPath: '/',
    },
    devtool: 'source-map',
    plugins: [new MiniCssExtractPlugin({
        filename: '[name].css',
    })],
});