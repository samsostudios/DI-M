// eslint.config.js
import config from '@finsweet/eslint-config';

export default [
  ...config,
  {
    files: ['bin/**/*.js', 'build.js'], // adjust for wherever your build scripts live
    languageOptions: {
      globals: {
        console: true,
        process: true,
      },
    },
  },
];
