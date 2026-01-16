// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  // 核心：覆盖所有使用 Tailwind 的文件路径（必填）
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}", // App 路由所有文件（页面/布局/组件）
    "./components/**/*.{js,ts,jsx,tsx,mdx}", // 自定义组件目录
    "./src/**/*.{js,ts,jsx,tsx,mdx}", // 若有 src 目录，需包含
    "./lib/**/*.{js,ts}", // 工具函数目录（如有使用 Tailwind 类名字符串）
  ],
  theme: {
    extend: {}, // 自定义主题（可选）
  },
  plugins: [],
};