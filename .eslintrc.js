module.exports = {
    "env": {
        "browser": true,
        "es6": true,
        "node": true
    },
    "extends": [
      "eslint:recommended",
      "airbnb",
      "plugin:react/recommended",
      "plugin:css-modules/recommended"
    ],
    "parser": 'babel-eslint',
    "parserOptions": {
        "ecmaFeatures": {
            "jsx": true
        },
        "ecmaVersion": 2018
    },
    "plugins": [
        "react",
        "css-modules"
    ],
    "rules": {
        "indent": [
            "error",
            2
        ],
        "react/jsx-filename-extension": [1, { "extensions": [".js", ".jsx"] }],
        "jsx-a11y/click-events-have-key-events": "off",
        "linebreak-style": [
            "error",
            "unix"
        ],
        "quotes": [
            "error",
            "single"
        ],
        "semi": [
            "error",
            "always"
        ],
        "css-modules/no-unused-class": [2, { "camelCase": "dashes-only" }],
        "css-modules/no-undef-class": [2, { "camelCase": "dashes-only" }]
    }
};