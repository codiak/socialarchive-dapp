const path = require('path');
const webpack = require('webpack');
const webpackConfigFile = require('./node_modules/react-scripts/config/webpack.config.js');
const webpackPolyfillConfigFile = require('./config-overrides.js');

module.exports = function(config) {
    let webpackConfig = {};
    {
        const { target, stats, mode, bail, devtool, entry, output, infrastructureLogging,
            resolve, module, plugins, } = webpackConfigFile("development");

        console.log("module rules:", module.rules);
        console.log("module rules1:", module.rules[1].oneOf, module.rules[1].oneOf[3]);

        module.rules = module.rules.map(rule => {
            if(rule.oneOf) {
                rule.oneOf = rule.oneOf.map(oneOf => {
                    if(oneOf.options) {
                        oneOf.options.cacheDirectory = false;
                        delete oneOf.options.cacheIdentifier;
                    }

                    return oneOf
                });
            }

            return rule;
        });

        console.log("NEW! module rules 1:", module.rules[1].oneOf);
        webpackConfig = webpackPolyfillConfigFile({
            cache: false,
            module,
            target, stats, mode, bail, devtool, entry, infrastructureLogging,
            resolve, 
            plugins: [plugins[0], plugins[1],
                plugins[2],
                plugins[3],
                plugins[4],
                plugins[5],
                plugins[7],
                plugins[8],
                // plugins[9]
            ],
            // plugins: [plugins[0], plugins[1], plugins[3], new RewirePlugin()]
        });

        webpackConfig.resolve.alias['@auth2'] = path.resolve(__dirname, 'src/mocks/components/auth/');
        webpackConfig.resolve.alias['@auth'] = path.resolve(__dirname, 'src/mocks/components/auth/');
        webpackConfig.resolve.alias['@components'] = path.resolve(__dirname, 'src/mocks/components/');
        webpackConfig.cache = false;
    }

    console.log("webpack:", webpackConfig);
    console.log("plugins:", webpackConfig.plugins);

    const files = [];

    if(process.env.TESTS == 'system') {
        files.push('tests/system.tests/tests.webpack.js')
    } else if(process.env.TESTS == 'network') {
        files.push('tests/network.tests/tests.webpack.js')
    } else {
        files.push('tests/tests.webpack.js')
    }

    console.log("files:", files);

    config.set({
        browsers: [ 'Chrome' ], //run in Chrome
        singleRun: false,
        frameworks: [ 'webpack', 'mocha' ], //use the mocha test framework
        files,
        browserNoActivityTimeout: 10000,
        plugins: [
            'karma-mocha',
            'karma-webpack',
            'karma-babel-preprocessor',
            'karma-sourcemap-loader',
            'karma-chrome-launcher',
        ],
        preprocessors: {
            'tests/tests.webpack.js': [ 'webpack', 'sourcemap' ], //preprocess with webpack and our sourcemap loader
            'tests/network.tests/tests.webpack.js': [ 'webpack', 'sourcemap' ],
            'tests/system.tests/tests.webpack.js': [ 'webpack', 'sourcemap' ],
        },
        // reporters: [ 'dots' ], //report results in this format
        reporters: ['progress'],

        webpack: webpackConfig,
        webpackServer: {
            noInfo: true //please don't spam the console when running in karma!
        }
    });
}

