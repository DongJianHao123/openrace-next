import type { NextConfig } from "next";

const baseUrl = process.env.HTTP_BASEURL;

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    return [
      // 代理 /web/api/ 到目标地址
      {
        source: '/api/:path*', // 匹配 /web/api/ 开头的所有路径
        destination: `${baseUrl}/api/:path*`, // 转发到目标地址
      },
    ];
  },

  // 可选：配置跨域头（确保代理请求正常）
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, token' },
          { key: 'X-Powered-By', value: 'Next.js 16.1.1' }, // 覆盖而非删除，避免报错
          { key: 'Vary', value: 'Accept-Encoding' }, // 适配压缩
        ],
      },
    ];
  },

  // 核心：开启 Next.js 内置 Gzip 压缩（适配 Web 标准请求）
  compress: true,
  productionBrowserSourceMaps: false,
  output: "standalone",
  reactStrictMode: false,
  experimental: {
    // 允许中间件修改响应体（用于手动 Brotli 压缩）
    proxyPrefetch: 'flexible',
    // ✅ 禁用自动序列化未使用的异步结果
    optimizeServerReact: true, 
    // ✅ 减少服务端组件 props 序列化体积
    // serverComponentsSerialization: {
    //   strict: true, // 仅序列化显式传递的 props
    //   exclude: ["bigint", "symbol"], // 排除无需序列化的类型
    // },
    
  },
  generateBuildId: () => "1", // 固定 buildId，避免序列化随机值
};

export default nextConfig;
