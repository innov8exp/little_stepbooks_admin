const CracoAntDesignPlugin = require('craco-antd');

module.exports = {
    plugins: [
        {
            plugin: CracoAntDesignPlugin,
            options: {
                customizeTheme: {
                    '@primary-color': '#0BAFFF',
                    '@layout-header-background': '#fff',
                    '@layout-header-padding': '0',
                    '@layout-sider-background': '#FFF',
                    // '@menu-dark-bg': '#222',
                },
            },
        },
    ],
};
