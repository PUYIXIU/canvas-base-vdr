import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path';
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  build:{
    lib:{
      // 入口
      entry: path.resolve(__dirname, 'src/packages/index.js'),
      name:'canvas-base-vdr',
      fileName:'canvas-base-vdr'
    },
    rollupOptions:{
      // 不需要打包进库的依赖，忽略vue
      external:['vue'],
      output:{
        globals:{
          vue:'Vue'
        }
      }
    }
  }
})
