/** @type {import("prettier").Config} */

const config = {
    semi: true,
    singleQuote: false,
    printWidth: 80,
    tabWidth: 2,
    quoteProps: "as-needed",
    jsxSingleQuote: false,
    trailingComma: "all",
    bracketSpacing: true,
    arrowParens: "always",
    proseWrap: "always",
    htmlWhitespaceSensitivity: "css",
    overrides: [
        {
            files: ["*.json", "*.yaml", "*.yml"],
            options: {
                tabWidth: 2,
            },
        },
        {
            files: ["apps/**/deploy/**/*.yaml"],
            options: {
                bracketSpacing: false
            },
        },
    ],
};

export default config;
