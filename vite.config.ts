import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
    root: './',
    build: {
        target: 'esnext',
        lib: {
            entry: resolve(__dirname, 'src/simple-calendar.ts'),
            name: 'SimpleCalendar',
            formats: ['es']
        },
        outDir: 'dist',
        sourcemap: true,
        rollupOptions: {
            external: ['lit'],
            input: {
                main: resolve(__dirname, 'src/simple-calendar.ts')
            },
            output: {
                globals: {
                    lit: 'lit',
                }
            }
        },
      },
      esbuild: {
        jsxFactory: 'html',
        jsxFragment: 'html'
      },
      resolve: {
        alias: {
            'lit': 'lit',
            '@': resolve(__dirname, 'src')
        }
      }
})