```js
// koa2 template
const n = next({ dev })
const handle = n.getRequestHandler()

n.prepare()
.then(() => {
  const app = new Koa()
  const router = new Router()

  router.get('*', async ctx => {
    await handle(ctx.req, ctx.res)
    ctx.respond = false
  })

  app.use(async (ctx, next) => {
    // Koa doesn't seems to set the default statusCode.
    // So, this middleware does that
    ctx.res.statusCode = 200
    await next()
  })

  app.use(router.routes())

  app.listen(3000)
})
```