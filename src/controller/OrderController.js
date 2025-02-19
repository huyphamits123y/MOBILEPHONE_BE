const { response } = require('express');
const OrderService = require('../service/OrderService')
const JwtService = require('../service/JwtService')
const createOrder = async (req, res) => {
    try {
        const { orderItems, paymentMethod, deliveryMethod, totalPrice, fullName, location, provinces, districts, wards, phone, user } = req.body;
        console.log('delivery', deliveryMethod)
        if (!orderItems || !paymentMethod || !deliveryMethod || !totalPrice || !fullName || !location || !phone || !user || !provinces || !districts || !wards) {
            return res.status(400).json({
                status: 'ERR',
                message: 'The input is required'
            })
        }

        const response = await OrderService.createOrder(req.body);
        return res.status(200).json(response)

    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }


}
const listsOrder = async (req, res) => {
    try {
        const id = req.params.id;
        console.log('id', id)

        if (!id) {
            return res.status(400).json({
                status: 'ERR',
                message: 'Id khong ton tai'
            })
        }
        const response = await OrderService.listOrder(id)
        return res.status(200).json(response)

    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
    // console.log(req.body);
    // return res.send("data success");

}
const listsOrderAll = async (req, res) => {
    try {

        const response = await OrderService.listOrderAll()
        return res.status(200).json(response)

    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
    // console.log(req.body);
    // return res.send("data success");

}
const deleteOrder = async (req, res) => {
    try {
        const orderId = req.params.id;


        if (!orderId) {
            return res.status(400).json({
                status: 'ERR',
                message: 'Id khong ton tai'
            })
        }
        const response = await OrderService.deleteOrder(orderId)
        return res.status(200).json(response)

    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }


}
const paymentOrder = async (req, res) => {
    try {
        const orderId = req.params.id;



        if (!orderId) {
            return res.status(400).json({
                status: 'ERR',
                message: 'Id khong ton tai'
            })
        }
        const response = await OrderService.paymentOrder(orderId)

        return res.status(200).json(response)

    } catch (e) {
        console.log('error', e)
        return res.status(404).json({
            message: e
        })
    }


}
const callbackOrder = async (req, res) => {
    try {
        let dataStr = req.body.data;
        let reqMac = req.body.mac;



        if (!dataStr || !reqMac) {
            return res.status(400).json({
                status: 'ERR',
                message: 'data va req khong ton tai'
            })
        }
        const response = await OrderService.paycallback(dataStr, reqMac)

        return res.status(200).json(response)

    } catch (e) {
        console.log('error', e)
        return res.status(404).json({
            message: e
        })
    }


}
const sendEmailOrder = async (req, res) => {
    try {
        const orderId = req.params.id;
        const email = req.params.email;


        if (!orderId || !email) {
            return res.status(400).json({
                status: 'ERR',
                message: 'Id hoac email khong ton tai'
            })
        }
        const response = await OrderService.sendEmailCreateOrder(email, orderId)
        return res.status(200).json(response)

    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }


}
const getAllOrder = async (req, res) => {
    try {


        const response = await OrderService.getAllOrder();
        return res.status(200).json(response)

    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }


}

module.exports = {
    createOrder,
    listsOrder,
    deleteOrder,
    paymentOrder,
    sendEmailOrder,
    callbackOrder,
    getAllOrder,
    listsOrderAll
}