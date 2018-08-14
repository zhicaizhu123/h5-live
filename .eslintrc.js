module.exports = {
    root: true,
    parserOptions: {
        parser: 'babel-eslint'
    },
    env: {
        browser: true,
    },
    extends: [
        // https://github.com/vuejs/eslint-plugin-vue#priority-a-essential-error-prevention
        // consider switching to `plugin:vue/strongly-recommended` or `plugin:vue/recommended` for stricter rules.
        'plugin:vue/essential',
        // https://github.com/standard/standard/blob/master/docs/RULES-en.md
        'airbnb-base', // standard'
    ],
    // required to lint *.vue files
    plugins: [
        'vue'
    ],
    // add your custom rules here
    rules: {
        // allow async-await
        'generator-star-spacing': 'off',
        // allow debugger during development
        'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'no-console': 'off', // 禁用no-console规则
        'semi': ['error', 'never'], // 行尾不使用分号
        'comma-dangle': ['error'],
        'eqeqeq': 0, // 不需要强制使用全等
        'max-len':0,
        'radix': 0,// parseInt不需要传第二个参数
        'linebreak-style': 0, // 强制执行一致的换行样式，windows和mac不一样
        'consistent-return':0, // 箭头函数最后不需要最后强制return值
        'no-param-reassign': ["error", { "props": false }],
        'no-plusplus': ["error", { "allowForLoopAfterthoughts": true }], // 允许在for循环中使用i++
        'no-unused-expressions': ["error", { "allowShortCircuit": true,"allowTernary": true}], // 允许您在表达式中使用三元运算符
        //'eol-last': 0,
        'import/extensions': ['.js', '.vue', '.json', '.scss', '.css'],
        'no-multi-spaces': ['error', { "ignoreEOLComments": true }],
    },
    settings: {
        'import/resolver': {
            node: {
                // paths: ['src'],
                extensions: ['.js', '.vue', '.json', '.scss', '.css']
            },
            // alias: true
            alias: {
                map: [
                   ['@', '../src'],
                ],
                extensions: ['.vue', '.js', '.json']
            },
        }
    }
}
