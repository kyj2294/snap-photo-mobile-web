
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  base: "/", // 절대 경로로 설정
  build: {
    outDir: "dist",
    assetsDir: "assets",
    // 모델 파일을 직접 복사하도록 설정
    assetsInlineLimit: 0, // 모든 에셋이 개별 파일로 생성되도록 설정
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          model: ['@teachablemachine/image'] // 모델 관련 패키지를 별도 청크로 분리
        },
        // 파일 이름 패턴을 안정적으로 설정
        entryFileNames: 'assets/[name].[hash].js',
        chunkFileNames: 'assets/[name].[hash].js',
        assetFileNames: 'assets/[name].[hash].[ext]'
      },
    },
    // 배포 환경에서 소스맵 설정 (개발 모드에서는 활성화)
    sourcemap: mode === 'development',
    // minify 옵션 추가
    minify: 'terser',
    terserOptions: {
      compress: {
        // 개발 모드에서는 console을 유지
        drop_console: mode !== 'development',
        drop_debugger: mode !== 'development'
      }
    }
  },
  // public 폴더의 파일을 그대로 dist로 복사
  publicDir: 'public',
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
