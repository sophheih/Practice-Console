module.exports = {
    env: {
        browser: true,
    },
    extends: ["plugin:react/recommended", "google"],
    parser: "@typescript-eslint/parser",
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
        ecmaVersion: 12,
        sourceType: "module",
        project: "./tsconfig.json",
    },
    settings: {
        react: { version: "detect" },
    },
    plugins: ["react", "@typescript-eslint"],
    rules: {
        "max-len": ["error", 140],
        "object-curly-spacing": ["error", "always"],
        "indent": ["error", 4],
        "quotes": ["error", "double"],
        "no-unused-vars": "off",
        "no-invalid-this": "off",
        "@typescript-eslint/no-unused-vars": "warn",
        "@typescript-eslint/naming-convention": [
            "error",
            {
                selector: "memberLike",
                modifiers: ["private"],
                format: ["camelCase"],
                leadingUnderscore: "require",
            },
        ],
        "require-jsdoc": 0,
        "@typescript-eslint/naming-convention": [
            "error",
            {
                selector: "variable",
                types: ["boolean"],
                format: ["PascalCase"],
                prefix: ["is", "should", "has", "can", "did", "will", "ok"],
            },
        ],
    },
};
