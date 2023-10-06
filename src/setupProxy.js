import { createProxyMiddleware } from 'http-proxy-middleware'

export default function (app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:8081',
      // target: 'http://sat-alb-aws-dev-343315788.us-east-1.elb.amazonaws.com/api',
      changeOrigin: true,
      pathRewrite: {
        '^/api': '',
      },
    }),
  )
  app.use(
    '/s3',
    createProxyMiddleware({
      target: 'https://s3.amazonaws.com',
      changeOrigin: true,
      pathRewrite: {
        '^/s3': '',
      },
    }),
  )
}
