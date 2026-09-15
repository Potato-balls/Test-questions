import { defineConfig } from '@tarojs/cli';

export default defineConfig(async (merge, { command, mode }) => {
  const baseConfig = {
    projectName: 'address-list',
    date: '2026-09-15',
    designWidth: 750,
    deviceRatio: {
      640: 2.34 / 2,
      750: 1,
      375: 2,
      828: 1.81 / 2,
    },
    sourceRoot: 'src',
    outputRoot: 'dist',
    framework: 'react',
    plugins: ['@tarojs/plugin-framework-react'],
    defineConstants: {},
    copy: {
      patterns: [],
      options: {},
    },
    weapp: {
      compiler: 'vite',
      postcss: {
        pxtransform: {
          enable: true,
          config: {},
        },
      },
    },
    h5: {
      compiler: 'vite',
      publicPath: '/',
      staticDirectory: 'static',
      router: {
        mode: 'hash',
      },
      devServer: {
        port: 10086,
      },
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
      compiler: 'vite',
    },
  };

  return merge(baseConfig, {});
});
