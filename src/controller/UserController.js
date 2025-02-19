const { response } = require('express');
const UserService = require('../service/UserService')
const JwtService = require('../service/JwtService')
const createUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const reg = /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;

        const isCheckEmail = reg.test(email);
        if (!email || !password) {
            return res.status(400).json({
                status: 'ERR',
                message: 'The input is required'
            })
        } else if (!isCheckEmail) {
            return res.status(400).json({
                status: 'ERR',
                message: 'The input is email'
            })
        }
        console.log('isCheckEmail', isCheckEmail);

        console.log(req.body);
        console.log('success');
        const response = await UserService.createUser(req.body)
        return res.status(200).json(response)

    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
    // console.log(req.body);
    // return res.send("data success");

}
const loginUser = async (req, res) => {

    try {
        const { email, password } = req.body;
        const reg = /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;

        const isCheckEmail = reg.test(email);
        if (!email || !password) {
            return res.status(400).json({
                status: 'ERR',
                message: 'The input is required'
            })
        } else if (!isCheckEmail) {
            return res.status(400).json({
                status: 'ERR',
                message: 'The input is email'
            })
            // } else if (confirmPassword !== password) {
            //     return res.status(400).json({
            //         status: 'ERR',
            //         message: 'The input is equal'
            //     })
        }
        console.log('isCheckEmail', isCheckEmail);

        console.log(req.body);
        console.log('success');
        const response = await UserService.loginUser(req.body)
        const { refresh_token, ...newRespone } = response
        // console.log('response', response)
        res.cookie('refresh_token', refresh_token, {
            httpOnly: true,
            secure: false,
            samsite: 'strict'
        })


        return res.status(200).json(response)

    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}
const updateUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const data = req.body;
        if (!userId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The userId is required'
            })
        }
        console.log('userId', userId);

        const respone = await UserService.updateUser(userId, data)
        return res.status(200).json(respone)


    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }

}
const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const token = req.headers;

        if (!userId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The userId is required'
            })
        }
        console.log('userId', userId);
        console.log('token', token);

        const respone = await UserService.deleteUser(userId)
        console.log('deleteuser thanh cong')
        return res.status(200).json(respone)


    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }

}
const getAllUser = async (req, res) => {
    try {

        const respone = await UserService.getAllUser();

        return res.status(200).json(respone)


    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }

}
const getDetailsUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const token = req.headers;

        if (!userId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The userId is required'
            })
        }

        console.log('userId', userId);
        console.log('token', token);

        const respone = await UserService.getDetailsUser(userId)

        return res.status(200).json(respone)


    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }

}
const refreshtoken = async (req, res) => {

    // console.log('req.cookies', req.cookie);






    console.log('req.cookie.refreh_token', req.cookies.refresh_token);
    try {
        const token = req.cookies.refresh_token

        if (!token) {
            return resolve.status(200).json({
                status: 'ERR',
                message: 'The token is required'
            })
        }
        const respone = await JwtService.refreshTokenJwtService(token)
        return res.status(200).json(respone)



    } catch (e) {
        return res.status(400).json({
            message: e
        })
    }
}
const logoutUser = async (req, res) => {


    try {
        console.log("logout")
        res.clearCookie('access_token')
        res.clearCookie('access_token')
        res.clearCookie('refresh_token')
        return res.status(200).json({
            status: 'OK',
            message: 'logout successfully'
        })



    } catch (e) {
        return res.status(400).json({
            message: e
        })
    }
}
module.exports = {
    createUser,
    loginUser,
    updateUser,
    deleteUser,
    getAllUser,
    getDetailsUser,
    refreshtoken,
    logoutUser
}


