import { createInertiaApp } from '@inertiajs/react'
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers'
import axios from 'axios'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../css/app.css'
import { initializeTheme } from '@/hooks/use-appearance'
import '@fontsource-variable/geist'

const basePath = import.meta.env.VITE_BASE_PATH || ''
if (basePath) {
    axios.defaults.baseURL = basePath
}

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    resolve: (name) =>
        resolvePageComponent(
            `./pages/${name}.tsx`,
            import.meta.glob('./pages/**/*.tsx'),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <StrictMode>
                <App {...props} />
            </StrictMode>,
        );
    },
    progress: {
        color: '#4B5563',
    },
});

initializeTheme();
