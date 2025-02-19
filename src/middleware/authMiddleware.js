const jwt = require('jsonwebtoken')
require('dotenv').config()
const authMiddleWare = (req, res, next) => {
    console.log('checkToken', req.headers.token)
    const token = req.headers.token.split(' ')[1]
    jwt.verify(token, process.env.ACCESS_TOKEN, function (err, user) {
        if (err) {
            return res.status(404).json({
                message: 'The authencation',
                status: 'ERROR',
            })
        }
        if (user?.isAdmin) {
            next()
        } else {
            return res.status(404).json({
                message: 'The authencation',
                status: 'ERROR',
            })
        }
        console.log('User', user)
    });


}
const authUserMiddleWare = (req, res, next) => {

    console.log('req.header', req.headers)
    const token = req.headers.token.split(' ')[1]
    const userId = req.params.id;
    jwt.verify(token, process.env.ACCESS_TOKEN, function (err, user) {
        if (err) {
            console.log('err', err);
            return res.status(404).json({
                message: 'The authencation',
                status: 'ERRORRRRRR',
            })
        }
        // const { payload } = user
        // console.log('payload', payload);
        console.log('user', user);
        if (user?.isAdmin || user?.id == userId) {
            next()
        } else {
            return res.status(404).json({
                message: 'The authencation',
                status: 'ERROR',
            })
        }
        console.log('User', user)
    });


}
const authUserMiddleWareCheck = (req, res, next) => {

    console.log('req.header', req.headers)
    const token = req.headers.token.split(' ')[1]
    const userId = req.params.id;
    jwt.verify(token, process.env.ACCESS_TOKEN, function (err, user) {
        if (err) {
            console.log('err', err);
            return res.status(404).json({
                message: 'The authencation',
                status: 'ERRORRRRRR',
            })
        }
        // const { payload } = user
        // console.log('payload', payload);
        console.log('user', user);
        if (user?.id == userId) {
            next()
        } else {
            return res.status(404).json({
                message: 'The authencation',
                status: 'ERROR',
            })
        }
        console.log('User', user)
    });


}
const authUserMiddleWare1 = (req, res, next) => {

    const token = req.headers.token.split(' ')[1]
    const userId = req.params.id;
    jwt.verify(token, process.env.REFRESH_TOKEN, function (err, user) {
        if (err) {
            console.log('err', err);
            return res.status(404).json({
                message: 'The authencation',
                status: 'ERRORRRRRR',
            })
        }
        const { payload } = user
        console.log('payload', payload);
        if (payload?.isAdmin || payload?.id == userId) {
            next()
        } else {
            return res.status(404).json({
                message: 'The authencation',
                status: 'ERROR',
            })
        }
        console.log('User', user)
    });


}
module.exports = {
    authMiddleWare,
    authUserMiddleWare,
    authUserMiddleWare1,
    authUserMiddleWareCheck,
}