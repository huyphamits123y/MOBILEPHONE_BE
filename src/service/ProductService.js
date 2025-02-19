const Product = require("../models/ProductModel")
const bcrypt = require("bcrypt");
const { generalAccessToken, generalRefreshToken } = require("./JwtService");
const createProduct = (newProduct) => {

    return new Promise(async (resolve, reject) => {
        const { name, image, type, price, countInStock, description } = newProduct;
        try {
            console.log('data', newProduct)
            const checkProduct = await Product.findOne({
                name: name
            })
            if (checkProduct !== null) {
                resolve({
                    status: 'ERROR',
                    message: 'Product da ton tai'
                })
            }

            const createdProduct = await Product.create({
                name,
                image,
                type,
                countInStock,
                price,
                description,
            })
            if (createdProduct) {
                resolve({
                    status: 'OK',
                    message: 'SUCCESS',
                    data: createdProduct
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

            const allType = await Product.distinct('type')
            return resolve({
                status: 'OK',
                message: 'success',
                data: allType,

            });









        } catch (e) {
            reject(e)
            console.log(e)
            console.log('not success')
        }
    })

}
const updateProduct = (id, data) => {

    return new Promise(async (resolve, reject) => {

        try {
            const checkProduct = await Product.findOne({
                _id: id
            })
            if (checkProduct === null) {
                resolve({
                    status: 'ERROR',
                    message: 'id khong ton tai'
                })
            }


            const updatedProduct = await Product.findByIdAndUpdate(id, data, { new: true });
            if (updatedProduct) {
                resolve({
                    status: 'OK',
                    message: 'SUCCESS',
                    data: updatedProduct
                })
            }






        } catch (e) {
            reject(e)
            console.log('not success')
        }
    })
}
const detailsProduct = (id) => {

    return new Promise(async (resolve, reject) => {

        try {
            const detailsProduct = await Product.findOne({
                _id: id
            })
            if (detailsProduct === null) {
                resolve({
                    status: 'ERROR',
                    message: 'id khong ton tai'
                })
            }



            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: detailsProduct,
            })






        } catch (e) {
            reject(e)
            console.log('not success')
        }
    })
}
const deleteProduct = (id) => {

    return new Promise(async (resolve, reject) => {

        try {
            const deleteProduct = await Product.findOne({
                _id: id
            })
            if (deleteProduct === null) {
                resolve({
                    status: 'ERROR',
                    message: 'id khong ton tai'
                })
            }
            await Product.findByIdAndDelete(id);




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
const getAllProductSearch = (limit, page, sort, filter) => {

    return new Promise(async (resolve, reject) => {


        try {
            console.log('sort', sort);
            const totalProduct = await Product.countDocuments();
            console.log('filter', filter);
            if (filter) {
                const label = filter[0];
                console.log('label', label)
                const allObjectFilter = await Product.find({
                    [label]: { '$regex': filter[1] }
                }).limit(limit).skip(page * limit)
                resolve({
                    status: 'OK',
                    message: 'SUCCESS',
                    data: allObjectFilter,
                    total: totalProduct,
                    pageCurrent: Number(page + 1),
                    totalPage: Math.ceil(totalProduct / limit),

                })
            }

            if (sort) {
                console.log('okok')
                const objectSort = {}
                objectSort[sort[1]] = sort[0]
                const getAllsProductSort = await Product.find().limit(limit).skip(page * limit).sort(objectSort)
                resolve({
                    status: 'OK',
                    message: 'GET ALL PRODUCT',
                    data: getAllsProductSort,
                    total: totalProduct,
                    pageCurrent: Number(page + 1),
                    totalPage: Math.ceil(totalProduct / limit),

                })
                console.log('objectSort', objectSort)

            }

            const getAllsProduct = await Product.find().limit(limit).skip(page * limit);
            return resolve({
                status: 'OK',
                message: 'GET ALL PRODUCT',
                data: getAllsProduct,
                total: totalProduct,
                pageCurrent: Number(page + 1),
                totalPage: Math.ceil(totalProduct / limit),
            });




        } catch (e) {
            reject(e)
            console.log(e)
            console.log('not successccc')
        }
    })
}
const getAllProductSearchCategory = (typeObj) => {
    return new Promise(async (resolve, reject) => {
        try {



            const typeValue =
                typeof typeObj === "string"
                    ? typeObj
                    : typeof typeObj === "object" && typeObj?.type
                        ? typeObj.type
                        : null;

            if (!typeValue) {
                throw new Error(
                    'Invalid type: The type object must be a string or have a "type" property'
                );
            }



            // Tìm kiếm sản phẩm dựa trên giá trị 'type'
            const products = await Product.find({ type: typeValue });
            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: products,



            })
        } catch (e) {
            reject(e)
            console.log('not success', e)
        }

    })

}
const getAllProduct = () => {

    return new Promise(async (resolve, reject) => {


        try {

            const totalProduct = await Product.countDocuments();
            const getAllsProduct = await Product.find();
            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: getAllsProduct,
                total: totalProduct,


            })
        } catch (e) {
            reject(e)
            console.log('not success')
        }
    })
}
module.exports = {
    createProduct,
    updateProduct,
    detailsProduct,
    deleteProduct,
    getAllProduct,
    getAllProductSearch,
    getAllType,
    getAllProductSearchCategory,


}