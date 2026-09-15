module.exports = {
  npm: {
    module: '@tarojs/plugin-framework-react-v3',
  },
  mini: {
    postcss: {
      pxtransform: {
        enable: true,
        config: {},
      },
    },
  },
  h5: {
    publicPath: '/',
    staticDirectory: 'static',
    postcss: {
      autoprefixer: {
        enable: true,
      },
      pxtransform: {
        enable: true,
        config: {},
      },
    },
  },
  rn: {
    app: {
      entries: ['src/app.tsx'],
    },
  },
};
