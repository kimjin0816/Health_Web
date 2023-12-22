const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: [
    'vuetify'
  ],
  lintOnSave: false,
  outputDir: '../backend/public',
  devServer: {
    proxy: {
      '/api': {
        target: 'https://datasciencediary.tistory.com',
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  }
})
