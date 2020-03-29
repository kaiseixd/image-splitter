const fs = require('fs');
const util = require('util');
const Koa = require('koa')
const next = require('next')
const Router = require('koa-router')
const sharp = require('sharp');

require('isomorphic-fetch');

const readFile = util.promisify(fs.readFile);

const port = parseInt(process.env.PORT, 10) || 3001
const dev = process.env.NODE_ENV !== 'production'
const n = next({ dev })
const handle = n.getRequestHandler()

const image = sharp('./images/toko.jpg');

n.prepare()
    .then(() => {
        const app = new Koa()
        const router = new Router()

        const image = sharp('./images/toko.jpg');

        // 首页
        router.get('/', async ctx => {
            await n.render(ctx.req, ctx.res, '/', ctx.query)
            ctx.respond = false
        })
        // image
        router.get('/image/get', async ctx => {
            // const meta = await image.metadata()
            const content = await readFile('./images/toko.jpg')
            ctx.set({
                'Content-Type': 'image/jpeg'
            })
            ctx.response.body = {
                status: 200,
                result: {
                    image: content.toString('base64')
                }
            }
        })
        router.get('/image/metadata', async ctx => {
            const metadata = await image.metadata()
            ctx.response.body = {
                status: 200,
                result: {
                    metadata
                }
            }
        })
        // 如果没有配置nginx做静态文件服务，下面代码请务必开启
        router.get('*', async ctx => {
           await handle(ctx.req, ctx.res)
           ctx.respond = false
        })
        // Koa doesn't seems to set the default statusCode.
        // So, this middleware does that.
        app.use(async (ctx, next) => {
            ctx.res.statusCode = 200
            await next()
        })
        app.use(router.routes())
        app.listen(port, () => {
            console.log(`> Ready on http://localhost:${port}`)
        })
    })