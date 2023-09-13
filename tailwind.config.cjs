// import skeleton from '@skeletonlabs/skeleton/tailwind/skeleton.cjs'
// const typography = require('@tailwindcss/typography')
// const forms = require('@tailwindcss/forms')
import { join } from 'path'
import forms from '@tailwindcss/forms'
import typography from '@tailwindcss/typography'
import skeleton from '@skeletonlabs/skeleton/tailwind/skeleton.cjs'

const config = {
    content: [
        './src/**/*.{html,js,svelte,ts}',
        join(
            require.resolve('@skeletonlabs/skeleton'),
            '../**/*.{html,js,svelte,ts}'
        ),
    ],
    darkMode: 'class',
    theme: {
        extend: {},
    },
    plugins: [forms, typography, ...skeleton()],
}

module.exports = config
