const postcssJitProps = require('postcss-jit-props');
const path = require('path');

module.exports = {
    plugins: [
        require('postcss-nesting'),
        require('postcss-custom-media'),
        postcssJitProps({
            files: [
                path.resolve(__dirname, 'node_modules/open-props/open-props.min.css'),
                path.resolve(__dirname, 'node_modules/open-props/media.min.css'),
            ]
        }),
    ]
}
