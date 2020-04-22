const { override, overrideDevServer, addBabelPreset } = require('customize-cra')

module.exports = {
  webpack: override(
    addBabelPreset('@emotion/babel-preset-css-prop')
  ),
  devServer: overrideDevServer(
    addBabelPreset('@emotion/babel-preset-css-prop')
  )
}
