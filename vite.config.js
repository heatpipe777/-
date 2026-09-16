import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // 같은 Wi-Fi의 스마트폰에서도 접속해서 확인할 수 있게 해줘요
  },
});
