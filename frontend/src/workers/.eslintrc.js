module.exports = {
  env: {
    worker: true,
  },
  rules: {
    'no-restricted-globals': ['error', 'window', 'document', 'navigator'],
  },
};