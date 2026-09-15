import { defineConfig, defineAppConfig } from 'tarojsTypes';

export default defineConfig<{
  mini: Record<string, any>;
  h5: Record<string, any>;
}>({
  mini: {
    compiler: 'webpack5',
    postcss: {
      pxtransform: {
        enable: true,
        config: {},
      },
    },
  },
  h5: {
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
});
