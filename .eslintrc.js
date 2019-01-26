module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
      "plugin:vue/essential",
      "plugin:prettier/recommended"
  ],
  rules: {
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",
    'no-unused-vars': ['warn'],
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'no-case-declarations': ['off'],
    'comma-dangle': ['warn'],
  },
  parserOptions: {
    parser: "babel-eslint"
  }

};
