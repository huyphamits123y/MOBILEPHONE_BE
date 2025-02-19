// jwt service
const jwt = require('jsonwebtoken')

require('dotenv').config()
const generalAccessToken = (payload) => {
    console.log('payload', payload)
    const access_token = jwt.sign({
        ...payload
    }, process.env.ACCESS_TOKEN, { expiresIn: '365d' })
    return access_token

}
const generalRefreshToken = (payload) => {
    console.log('payload', payload)
    const refresh_token = jwt.sign({
        ...payload
    }, process.env.REFRESH_TOKEN, { expiresIn: '365d' })
    return refresh_token

}
const refreshTokenJwtService = async (token) => {
    return new Promise((resolve, reject) => {

        try {

            console.log('token', token)
            jwt.verify(token, process.env.REFRESH_TOKEN, async (err, user) => {
                if (err) {
                    console.log('err', err)
                    resolve({
                        status: 'ERR',
                        message: 'The authentication'
                    })
                }
                // const { payload } = user;
                const access_token = await generalAccessToken({
                    id: user?.id,
                    isAdmin: user?.isAdmin
                })
                console.log('access_token', access_token)
                resolve({
                    status: 'OK',
                    message: 'Success',
                    access_token: access_token



                })


            })









        } catch (e) {
            reject(e)

        }
    })

}
module.exports = {
    generalAccessToken,
    generalRefreshToken,
    refreshTokenJwtService
}