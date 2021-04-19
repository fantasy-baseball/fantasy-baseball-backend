module.exports = {
  extends: "airbnb-base",
  env: {
    browser: true,
    node: true,
  },
  rules: {
    quotes: ["error", "double"],
    "no-underscore-dangle": "off",
    "no-unused-vars": "warn",
  },
};
