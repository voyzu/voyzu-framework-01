import pluginJs from "@eslint/js";
import globals from "globals";
import jsdoc from "eslint-plugin-jsdoc";
import eslintPluginUnicorn from "eslint-plugin-unicorn";

export default [
  { languageOptions: { globals: globals.node } },
  pluginJs.configs.recommended,
  jsdoc.configs["flat/recommended"],
  eslintPluginUnicorn.configs["flat/all"],
  {
    ignores: ["**/package-lock.json"],
    rules: {
      ...pluginJs.configs.all.rules,

      "camelcase": "off",
      "consistent-return": "off",
      "default-param-last":"off",
      "func-style": "off",
      "init-declarations": "off",

      // Jsdoc rules
      "jsdoc/check-indentation": "warn",
      "jsdoc/check-line-alignment": "warn",
      "jsdoc/no-bad-blocks": "warn",
      "jsdoc/no-blank-block-descriptions": "warn",
      "jsdoc/require-asterisk-prefix": "warn",
      "jsdoc/require-description": "warn",
      "jsdoc/require-description-complete-sentence": "warn",
      "jsdoc/require-jsdoc": [
        "error",
        {
          publicOnly: true,
        },
      ],
      "jsdoc/require-returns-check": "off",
      "jsdoc/sort-tags": "warn",

      "id-length": ["error", { exceptions: ["i", "j", "k"] }],
      "line-comment-position": "off",
      "max-classes-per-file": "off",
      "max-lines-per-function": "off",
      "max-params": "off",
      "max-statements": "off",
      "no-await-in-loop": "off",
      "no-console": "off",
      "no-continue": "off",
      "no-inline-comments": "off",
      "no-labels": "off",
      "no-magic-numbers": ["error", { ignore: [-1, 0, 1, 2, 3] }],
      "no-multiple-empty-lines": ["error", { max: 1, maxBOF: 0, maxEOF: 0 }],
      "no-plusplus": "off",
      "no-ternary": "off",
      "no-undefined": "off",
      "no-unused-vars": [
        "error",
        { args: "none", ignoreRestSiblings: false, vars: "all" },
      ],
      "no-use-before-define": "off",
      "one-var": "off",
      "prefer-destructuring": "off",
      "radix":"off",
      "require-await":"off",
      "require-unicode-regexp": "off",
      "semi": "error",
      "sort-imports": "off",

      // unicorn
      "unicorn/import-style": "off",
      "unicorn/no-abusive-eslint-disable": "off",
      "unicorn/no-null":"off",
      "unicorn/prefer-top-level-await": "off",
      "unicorn/prevent-abbreviations": "off"
    },
  },
];
