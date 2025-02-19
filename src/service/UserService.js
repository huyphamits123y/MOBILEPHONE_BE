const User = require("../models/UserModel")
const bcrypt = require("bcrypt");
const { generalAccessToken, generalRefreshToken } = require("./JwtService");
// xu li lien quan den api
const createUser = (newUser) => {

    return new Promise(async (resolve, reject) => {
        const { email, password } = newUser;
        try {
            const checkUser = await User.findOne({
                email: email
            })
            if (checkUser !== null) {
                reject({
                    status: 'ERROR',
                    message: 'Email da ton tai'
                })
            }
            //ma hoa password
            const hash = bcrypt.hashSync(password, 10)
            const createdUser = await User.create({

                email,
                password: hash,

            })
            if (createdUser) {
                resolve({
                    status: 'OK',
                    message: 'SUCCESS',
                    data: createdUser
                })
            }






        } catch (e) {
            reject(e)
            console.log('not success', e)
        }
    })
}
const loginUser = (userLogin) => {

    return new Promise(async (resolve, reject) => {
        const { email, password } = userLogin;
        try {
            const checkUser = await User.findOne({
                email: email
            })
            if (checkUser === null) {
                resolve({
                    status: 'ERROR',
                    message: 'Email khong ton tai'
                })
            }
            console.log('password', password);
            console.log('check pass', checkUser.password)
            const comparePassword = bcrypt.compareSync(password, checkUser.password);

            console.log('comparePassword', comparePassword)

            if (!comparePassword) {
                // resolve({
                //     status: 'OK',
                //     message: 'The password or user is incorrect'
                // })
                return reject({
                    status: 'ERROR',
                    message: 'The password or user is incorrect'
                });
            }
            const access_token = await generalAccessToken({
                id: checkUser.id,
                isAdmin: checkUser.isAdmin
            })
            console.log('access_token', access_token)
            const refresh_token = await generalRefreshToken({
                id: checkUser.id,
                isAdmin: checkUser.isAdmin
            })



            resolve({
                status: 'OK',
                message: 'SUCCESS',
                access_token: access_token,
                refresh_token: refresh_token


            })

            //ma hoa password
            // const hash = bcrypt.hashSync(password, 10)
            // const createdUser = await User.create({
            //     name,
            //     email,
            //     password: hash,
            //     confirmPassword: hash,
            //     phone
            // })








        } catch (e) {
            reject(e)
            console.log('not successs', e)
        }
    })
}
const updateUser = (id, data) => {

    return new Promise(async (resolve, reject) => {

        try {
            const checkUser = await User.findOne({
                _id: id
            })
            console.log('checkUser', checkUser)
            if (checkUser === null) {
                resolve({
                    status: 'OK',
                    message: 'The user is not defined'
                })
            }
            const updatedUser = await User.findByIdAndUpdate(id, data, { new: true });
            console.log('updatedUser thanh cong', updatedUser);
            if (data.password) {
                const hash = bcrypt.hashSync(data.password, 10);
                updatedUser.password = hash;
                await updatedUser.save(); // Lưu user với mật khẩu đã băm
                console.log('hashed password:', hash);
            }

            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: updatedUser


            })









        } catch (e) {
            reject(e)
            console.log('not successs')
        }
    })
}
const deleteUser = (id) => {
    return new Promise(async (resolve, reject) => {

        try {
            const checkUser = await User.findOne({
                _id: id
            })
            console.log('checkUser', checkUser)
            if (checkUser === null) {
                resolve({
                    status: 'ERROR',
                    message: 'The user is not defined'
                })
            }
            const deletedUser = await User.findByIdAndDelete(id);
            console.log('xoa user thanh cong');
            resolve({
                status: 'OK',
                message: 'DELETE USER SUCCESS',
            })

        } catch (e) {
            reject(e)
            console.log('not successs')
        }
    })
}
const getAllUser = () => {
    return new Promise(async (resolve, reject) => {

        try {
            const allUser = await User.find();
            resolve({
                status: 'OK',
                message: 'user success',
                data: allUser,
            })


            // resolve({
            //     status: 'OK',
            //     message: 'DELETE USER SUCCESS',



            // })









        } catch (e) {
            reject(e)
            console.log('not successs')
        }
    })
}
const getDetailsUser = (id) => {
    return new Promise(async (resolve, reject) => {

        try {
            const user = await User.findOne({
                _id: id
            })

            if (User === null) {
                resolve({
                    status: 'ERROR',
                    message: 'The user is not defined'
                })
            }



            resolve({
                status: 'OK',
                message: 'lay thong tin user thanh cong',
                data: user


            })









        } catch (e) {
            reject(e)
            console.log('lay thong tin user that bai')
        }
    })
}

module.exports = {
    createUser,
    loginUser,
    updateUser,
    deleteUser,
    getAllUser,
    getDetailsUser,

}