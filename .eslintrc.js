module.exports = {
  extends: ["next", "next/core-web-vitals"],
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: "./tsconfig.json"
  },
  rules: {
    "no-console": ["warn", { allow: ["info", "warn", "error"] }]
  }
};
