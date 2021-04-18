module.exports = {
  extends: "airbnb-base",
  env: {
    browser: true,
    node: true,
  },
  rules: {
    quotes: ["error", "double"],
    "comma-dangle": [
      "error",
      {
        arrays: "only-multiline",
        objects: "only-multiline",
        functions: "never",
      },
    ],
  },
};
