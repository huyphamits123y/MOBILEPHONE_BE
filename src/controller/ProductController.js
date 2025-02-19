const { response } = require('express');
const ProductService = require('../service/ProductService')
const JwtService = require('../service/JwtService')
const createProduct = async (req, res) => {
    try {
        const { name, image, type, price, countInStock, description } = req.body;
        console.log('check', req.body)
        if (!name || !image || !type || !price || !countInStock || !description) {
            return res.status(400).json({
                status: 'ERR',
                message: 'The input is required'
            })
        }

        const response = await ProductService.createProduct(req.body);
        return res.status(200).json(response)

    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }

}

const updateProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        if (!productId) {
            return res.status(400).json({
                status: 'ERR',
                message: 'Id khong ton tai'
            })
        }
        const response = await ProductService.updateProduct(productId, req.body);
        return res.status(200).json(response)

    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }


}
const getAllType = async (req, res) => {
    try {
        const respone = await ProductService.getAllType()
        return res.status(200).json(respone)
    } catch (e) {
        return res.status(400).json({
            message: e
        })
    }

}
const detailsProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        console.log(productId)

        if (!productId) {
            return res.status(400).json({
                status: 'ERR',
                message: 'Id khong ton tai'
            })
        }
        const response = await ProductService.detailsProduct(productId);
        return res.status(200).json(response)

    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }


}
const deleteProduct = async (req, res) => {
    try {
        const productId = req.params.id;


        if (!productId) {
            return res.status(400).json({
                status: 'ERR',
                message: 'Id khong ton tai'
            })
        }
        const response = await ProductService.deleteProduct(productId);
        return res.status(200).json(response)

    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }


}
const getAllProduct = async (req, res) => {
    try {


        const response = await ProductService.getAllProduct();
        return res.status(200).json(response)

    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }


}
const getAllProductSearchCategory = async (req, res) => {

    try {
        const type = req.query.type
        const response = await ProductService.getAllProductSearchCategory(type);
        return res.status(200).json(response)

    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }


}
const getAllProductSearch = async (req, res) => {
    try {

        const { limit, page, sort, filter } = req.query;
        const response = await ProductService.getAllProductSearch(Number(limit) || 3, Number(page) || 0, sort, filter);
        return res.status(200).json(response)

    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }


}
module.exports = {
    createProduct,
    updateProduct,
    detailsProduct,
    deleteProduct,
    getAllProduct,
    getAllProductSearch,
    getAllType,
    getAllProductSearchCategory

}