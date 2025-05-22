
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
    // 모델 파일을 직접 복사하도록 설정 - 인라인 제한 조정
    assetsInlineLimit: 0, // 모든 에셋이 개별 파일로 생성되도록 설정
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          model: ['@teachablemachine/image'] // 모델 관련 패키지를 별도 청크로 분리
        },
      },
    },
    // 배포 환경에서 소스맵 비활성화
    sourcemap: false,
  },
  // public 폴더의 파일을 그대로 dist로 복사 - 명시적으로 설정
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
