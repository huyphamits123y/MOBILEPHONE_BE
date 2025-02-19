const ProductRouter = require('./ProductRouter')
const UserRouter = require('./UserRouter')
const OrderRouter = require('./OrderRouter')

const CategoryRouter = require('./CategoryRouter')
const routes = (app) => {
    const routers = {
        '/api/user': UserRouter,
        '/api/product': ProductRouter,
        '/api/category': CategoryRouter,
        '/api/order': OrderRouter,
    };
    for (const [path, router] of Object.entries(routers)) {
        if (typeof router === 'function' || (typeof router === 'object' && router.stack)) {
            console.log(`Mounting router for ${path}`);
            app.use(path, router);
        } else {
            console.error(`Invalid middleware for ${path}:`, router);
        }
    }


    // app.use('/api/order', OrderRouter)
}
module.exports = routes