
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
  base: "./", // 상대 경로로 설정 유지
  build: {
    outDir: "dist",
    assetsDir: "assets",
    // 모델 파일을 직접 복사하도록 설정
    assetsInlineLimit: 0, // 모든 에셋이 개별 파일로 생성되도록 설정
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          tensorflow: ['@teachablemachine/image'] // 모델 관련 패키지를 별도 청크로 분리
        },
        // 파일 이름 패턴을 안정적으로 설정
        entryFileNames: 'assets/[name].[hash].js',
        chunkFileNames: 'assets/[name].[hash].js',
        assetFileNames: 'assets/[name].[hash].[ext]'
      },
    },
    // 프로덕션 모드에서 소스맵 비활성화 (배포 크기 최적화)
    sourcemap: false,
    // minify 옵션 추가
    minify: 'terser',
    terserOptions: {
      compress: {
        // 프로덕션 모드에서 console 제거 (배포 최적화)
        drop_console: true,
        drop_debugger: true
      }
    },
    // 모든 형태의 코드가 지원되도록 설정 (IE11 제외)
    target: 'es2015'
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
