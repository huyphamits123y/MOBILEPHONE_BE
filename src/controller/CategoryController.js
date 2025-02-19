const { response } = require('express');

const CategoryService = require('../service/CategoryService')
const JwtService = require('../service/JwtService')
const createCategory = async (req, res) => {
    try {
        const { name, image } = req.body;
        console.log('check', req.body)
        if (!name || !image) {
            return res.status(400).json({
                status: 'ERR',
                message: 'The input is required'
            })
        }

        const response = await CategoryService.createCategory(req.body)
        return res.status(200).json(response)

    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }

}
const getAllType = async (req, res) => {
    try {
        const respone = await CategoryService.getAllType()
        return res.status(200).json(respone)
    } catch (e) {
        return res.status(400).json({
            message: e
        })
    }

}
const detailsCategory = async (req, res) => {
    try {
        const categoryId = req.params.id;
        console.log(categoryId)

        if (!categoryId) {
            return res.status(400).json({
                status: 'ERR',
                message: 'Id khong ton tai'
            })
        }
        const response = await CategoryService.detailsCategory(categoryId)
        return res.status(200).json(response)

    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }


}

const updateCategory = async (req, res) => {
    try {
        const categoryId = req.params.id;
        if (!categoryId) {
            return res.status(400).json({
                status: 'ERR',
                message: 'Id khong ton tai'
            })
        }
        const response = await CategoryService.updateCategory(categoryId, req.body)
        return res.status(200).json(response)

    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }


}

const deleteCategory = async (req, res) => {
    try {
        const categoryId = req.params.id;


        if (!categoryId) {
            return res.status(400).json({
                status: 'ERR',
                message: 'Id khong ton tai'
            })
        }
        const response = await CategoryService.deleteCategory(categoryId)
        return res.status(200).json(response)

    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }


}
const getAllCategory = async (req, res) => {
    try {


        const response = await CategoryService.getAllCategory();
        return res.status(200).json(response)

    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }


}

module.exports = {
    createCategory,
    updateCategory,
    deleteCategory,
    getAllCategory,
    detailsCategory,
    getAllType

}