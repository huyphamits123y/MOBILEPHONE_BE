const Product = require("../models/ProductModel")
const bcrypt = require("bcrypt");
const { generalAccessToken, generalRefreshToken } = require("./JwtService");
const Category = require("../models/CategoryModel");
const createCategory = (newCategory) => {

    return new Promise(async (resolve, reject) => {
        const { name, image } = newCategory;
        try {

            const checkCategory = await Category.findOne({
                name: name
            })
            if (checkCategory !== null) {
                resolve({
                    status: 'ERROR',
                    message: 'Category da ton tai'
                })
            }

            const createdCategory = await Category.create({
                name,
                image

            })
            if (createdCategory) {
                resolve({
                    status: 'OK',
                    message: 'SUCCESS',
                    data: createdCategory
                })
            }
        } catch (e) {
            reject(e)
            console.log('not success')
        }
    })
}

const updateCategory = (id, data) => {

    return new Promise(async (resolve, reject) => {

        try {
            const checkCategory = await Category.findOne({
                _id: id
            })
            if (checkCategory === null) {
                resolve({
                    status: 'ERROR',
                    message: 'id khong ton tai'
                })
            }


            const updatedCategory = await Category.findByIdAndUpdate(id, data, { new: true });
            if (updatedCategory) {
                resolve({
                    status: 'OK',
                    message: 'SUCCESS',
                    data: updatedCategory
                })
            }






        } catch (e) {
            reject(e)
            console.log('not success')
        }
    })
}
const getAllType = () => {
    return new Promise(async (resolve, reject) => {


        try {

            const allType = await Category.distinct('name')
            return resolve({
                status: 'OK',
                message: 'success',
                data: allType,

            });









        } catch (e) {
            reject(e)
            console.log(e)
            console.log('not successccc')
        }
    })

}
const deleteCategory = (id) => {

    return new Promise(async (resolve, reject) => {

        try {
            const deleteCategory = await Category.findOne({
                _id: id
            })
            if (deleteCategory === null) {
                resolve({
                    status: 'ERROR',
                    message: 'id khong ton tai'
                })
            }
            await Category.findByIdAndDelete(id);




            resolve({
                status: 'OK',
                message: 'DELETE SUCCESS',

            })






        } catch (e) {
            reject(e)
            console.log('not success')
        }
    })
}
const getAllCategory = () => {

    return new Promise(async (resolve, reject) => {


        try {

            const totalCategory = await Category.countDocuments();
            const getAllsCategory = await Category.find();
            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: getAllsCategory,
                total: totalCategory,


            })
        } catch (e) {
            reject(e)
            console.log('not success')
        }
    })
}
const detailsCategory = (id) => {

    return new Promise(async (resolve, reject) => {

        try {
            const detailCategory = await Category.findOne({
                _id: id
            })
            if (detailCategory === null) {
                resolve({
                    status: 'ERROR',
                    message: 'id khong ton tai'
                })
            }



            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: detailCategory,
            })






        } catch (e) {
            reject(e)
            console.log('not success')
        }
    })
}
module.exports = {
    createCategory,
    updateCategory,
    deleteCategory,
    getAllCategory,
    detailsCategory,
    getAllType

}