const { override, fixBabelImports, addWebpackAlias } = require('customize-cra');
const path = require('path')

module.exports = override(
    fixBabelImports('import', {
        libraryName: 'antd',
        libraryDirectory: 'es',
        style: 'css'
    }),
    addWebpackAlias({
        react: path.resolve('./node_modules/react')
    })
)