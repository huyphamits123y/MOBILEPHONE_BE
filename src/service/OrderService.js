const User = require("../models/UserModel")
const bcrypt = require("bcrypt");
const { generalAccessToken, generalRefreshToken } = require("./JwtService");
const Order = require("../models/OrderModel");
const express = require('express');
require('dotenv').config()
const qs = require('qs')
const axios = require('axios').default; // npm install axios
const CryptoJS = require('crypto-js'); // npm install crypto-js
const moment = require('moment');
const nodemailer = require("nodemailer");

// xu li lien quan den api
const createOrder = (newOrder) => {

    return new Promise(async (resolve, reject) => {

        const { orderItems, paymentMethod, deliveryMethod, totalPrice, fullName, location, provinces, districts, wards, phone, user } = newOrder;
        try {
            const createdOrder = await Order.create({
                orderItems,
                shippingAddress: {
                    fullName,
                    location,
                    provinces,
                    districts,
                    wards,
                    phone
                },
                paymentMethod,
                deliveryMethod,
                totalPrice,
                user: user,
            })
            if (createdOrder) {
                return resolve({
                    status: 'OK',
                    message: 'SUCCESS',
                    data: createdOrder
                })
            }






        } catch (e) {
            console.log('loi', e)
            reject(e)
            console.log('not success')
        }
    })
}
const listOrder = (user) => {

    return new Promise(async (resolve, reject) => {

        try {
            const listsOrder = await Order.find({ user: user });
            console.log('data', listsOrder)
            if (listsOrder === null) {
                return reject({
                    status: 'ERROR',
                    message: 'id khong ton tai'
                })
            }



            return resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: listsOrder,
            })






        } catch (e) {
            reject(e)
            console.log('not success')
        }
    })
}
const listOrderAll = () => {

    return new Promise(async (resolve, reject) => {

        try {
            const listsOrder = await Order.find();




            return resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: listsOrder,
            })






        } catch (e) {
            reject(e)
            console.log('not success')
        }
    })
}
const deleteOrder = (id) => {

    return new Promise(async (resolve, reject) => {

        try {
            const deleteOrder = await Order.findOne({
                _id: id
            })
            if (deleteOrder === null) {
                return reject({
                    status: 'ERROR',
                    message: 'id khong ton tai'
                })
            }
            await Order.findByIdAndDelete(id);




            return resolve({
                status: 'OK',
                message: 'DELETE SUCCESS',

            })






        } catch (e) {
            reject(e)
            console.log('not success')
        }
    })
}
const config = {
    app_id: `${process.env.app_id}`,
    key1: `${process.env.key1}`,
    key2: `${process.env.key2}`,
    endpoint: `${process.env.endpoint}`
}
// const paymentOrder = async (id) => {
//     console.log('app', config.app_id)
//     console.log('key1', config.key1)
//     console.log('key2', config.key2)
//     console.log('endpoint', config.endpoint)
//     const embed_data = {
//         redirecturl: "http://localhost:3000/"
//     };
//     const paymentOrder = await Order.findOne({
//         _id: id
//     })

//     const items = [{ paymentOrder }];
//     console.log('itemm', items)
//     const transID = Math.floor(Math.random() * 1000000);
//     const order = {
//         app_id: config.app_id,
//         app_trans_id: `${moment().format('YYMMDD')}_${transID}`, // translation missing: vi.docs.shared.sample_code.comments.app_trans_id
//         app_user: "huypham",
//         app_time: Date.now(), // miliseconds
//         item: JSON.stringify(items),
//         embed_data: JSON.stringify(embed_data),
//         amount: 50000,
//         description: `Lazada - Payment for the order #${transID}`,
//         bank_code: "",
//         callback_url: "https://123d-2001-ee0-5531-6a00-4587-be4f-eade-4fe7.ngrok-free.app/callback"
//     };

//     // appid|app_trans_id|appuser|amount|apptime|embeddata|item
//     const data = config.app_id + "|" + order.app_trans_id + "|" + order.app_user + "|" + order.amount + "|" + order.app_time + "|" + order.embed_data + "|" + order.item;
//     order.mac = CryptoJS.HmacSHA256(data, config.key1).toString();

//     try {
//         console.log('test', { params: order })
//         console.log('config', config.endpoint)

//         const result = await axios.post(config.endpoint, null, { params: order });
//         console.log(result.data);
//     } catch (error) {
//         console.log('loicccccccccc')
//         console.log(error.message);

//     }

// }
const paymentOrder = async (id) => {
    return new Promise(async (resolve, reject) => {

        try {
            try {
                // Logging configuration values for debugging


                // Find the order by ID
                const paymentOrder = await Order.findOne({ _id: id });


                if (!paymentOrder) {
                    throw new Error('Order not found');
                }

                // Create order details
                const embed_data = { redirecturl: "http://localhost:3000/" };
                const items = [{

                }];

                const transID = Math.floor(Math.random() * 1000000);
                const order = {
                    app_id: config.app_id,
                    app_trans_id: `${moment().format('YYMMDD')}_${transID}`,
                    app_user: paymentOrder.shippingAddress.fullName,
                    app_time: Date.now(), // milliseconds
                    item: JSON.stringify(items),
                    embed_data: JSON.stringify(embed_data),
                    amount: paymentOrder.totalPrice,
                    // amount: 1000000,
                    description: `Lazada - Payment for the order #${transID}`,
                    bank_code: "",
                    callback_url: "https://3207-2001-ee0-5533-2900-fc1-427e-1416-ba4a.ngrok-free.app/callback"
                };

                // Generate MAC (Message Authentication Code)
                const data = `${config.app_id}|${order.app_trans_id}|${order.app_user}|${order.amount}|${order.app_time}|${order.embed_data}|${order.item}`;
                order.mac = CryptoJS.HmacSHA256(data, config.key1).toString();
                console.log('hello huy')

                try {
                    console.log('hello huy')


                    // Send request to payment endpoint
                    console.log('endpoint', config.endpoint)
                    const result = await axios.post(config.endpoint, null, { params: order });
                    if (result?.data) {

                        paymentOrder.orderToken = order.app_trans_id
                        console.log('oay', paymentOrder.orderToken)
                        await updateOrderToken(id, order.app_trans_id)

                    }
                    resolve({
                        data: result.data,
                        status: 'OK',
                        message: 'payment SUCCESS',

                    })

                    // const result = await axios.post(config.endpoint, { params: order });

                    // Log the entire response object for better insight
                    console.log('Response data:', result.data);
                    console.log('Response status:', result.status);

                } catch (error) {
                    console.error('An error occurred during the request.');
                    console.error('Error message:', error.message);

                    // Log additional error information if available
                    if (error.response) {
                        console.error('Error response data:', error.response.data);
                        console.error('Error response status:', error.response.status);
                        console.error('Error response headers:', error.response.headers);
                    } else if (error.request) {
                        console.error('No response received. Request details:', error.request);
                    } else {
                        console.error('Request setup error:', error.message);
                    }
                }

            } catch (error) {
                console.error('Error processing payment order:', error.message);
                throw error;
            }










        } catch (e) {
            console.log('error', e)
            console.log('not success', e)
        }
    })

};
const paycallback = (dataStr, reqMac) => {
    return new Promise(async (resolve, reject) => {
        let result = {};

        try {
            // let dataStr = req.body.data;
            // let reqMac = req.body.mac;

            let mac = CryptoJS.HmacSHA256(dataStr, config.key2).toString();
            console.log("mac =", mac);


            // kiểm tra callback hợp lệ (đến từ ZaloPay server)
            if (reqMac !== mac) {
                // callback không hợp lệ
                result.return_code = -1;
                result.return_message = "mac not equal";
            }
            else {
                // thanh toán thành công
                // merchant cập nhật trạng thái cho đơn hàng
                let dataJson = JSON.parse(dataStr, config.key2);
                console.log("update order's status = success where app_trans_id =", dataJson["app_trans_id"]);

                result.return_code = 1;
                result.return_message = "success";
                resolve({
                    status: 'OK',
                    message: 'goi cal back thanh cong'
                })


            }
        } catch (ex) {
            result.return_code = 0; // ZaloPay server sẽ callback lại (tối đa 3 lần)
            result.return_message = ex.message;
        }

        // thông báo kết quả cho ZaloPay server
        res.json(result);


    })

}
const configEmail = {
    account: `${process.env.MAIL_ACCOUNT}`,
    password: `${process.env.MAIL_PASSWORD}`,

}

// const sendEmailCreateOrder = async (email, id) => {
//     return new Promise(async (resolve, reject) => {

//         try {
//             const paymentOrder = await Order.findOne({ _id: id });
//             console.log('account', configEmail.account)
//             console.log('password', configEmail.password)
//             paymentOrder.orderItems.map((item) => {
//                 console.log('iamge', item.name)
//                 console.log('link image', item.image)
//             })
//             if (!email || typeof email !== 'string' || !email.trim()) {
//                 return reject(new Error("Invalid email address"));

//             }
//             else {
//                 console.log("Sending email to:", email);
//             }



//             try {
//                 const transporter = nodemailer.createTransport({
//                     host: "smtp.gmail.com",
//                     port: 465,
//                     secure: true,
//                     auth: {
//                         user: configEmail.account,
//                         pass: configEmail.password,
//                     },
//                 });
//                 // const test = paymentOrder.orderItems.map((item) => {
//                 //     console.log('iamge', item.orderItems.image, 'price', item.orderItems.price)
//                 // })

//                 // Generate HTML for the ordered products
//                 const productsHtml = paymentOrder.orderItems.map(item => `

//                   <tr>
//                     <td style="border: 1px solid #ddd; padding: 8px;">
//                       <img src="${item.image}" alt="${item.name}" style="height: 50px; vertical-align: middle; margin-right: 10px;">
//                       ${item.name}
//                     </td>
//                     <td style="border: 1px solid #ddd; padding: 8px;">${item.price}</td>
//                     <td style="border: 1px solid #ddd; padding: 8px;">${item.amount}</td>
//                     <td style="border: 1px solid #ddd; padding: 8px;">${item.price * item.amount}</td>
//                   </tr>
//                 `).join('');

//                 const info = await transporter.sendMail({
//                     from: configEmail.account,
//                     to: email,
//                     subject: "Cảm ơn bạn đã đặt hàng từ HUYPHAM ✔",
//                     text: "HUYPHAM cảm ơn bạn đã đặt hàng. Chúc bạn 1 ngày làm việc thật năng suất.",
//                     html: `
//                     <section style="max-width: 600px; margin: 0 auto; padding: 16px; font-family: Arial, sans-serif; background-color: #f9f9f9;">

//                       <main>
//                         <h2>Chào ${paymentOrder.shippingAddress.fullName},</h2>
//                         <p>Cảm ơn bạn đã đặt hàng từ HUYPHAM! Dưới đây là chi tiết đơn hàng của bạn:</p>
//                         <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
//                           <thead>
//                             <tr>
//                               <th style="border: 1px solid #ddd; padding: 8px;">Sản phẩm</th>
//                               <th style="border: 1px solid #ddd; padding: 8px;">Giá</th>
//                               <th style="border: 1px solid #ddd; padding: 8px;">Số lượng</th>
//                               <th style="border: 1px solid #ddd; padding: 8px;">Tổng</th>
//                             </tr>
//                           </thead>
//                           <tbody>
//                             ${productsHtml}
//                           </tbody>
//                           <tfoot>
//                             <tr>
//                               <td colspan="3" style="border: 1px solid #ddd; padding: 8px; text-align: right;">Tổng cộng (đã bao gồm phí vận chuyển):</td>
//                               <td style="border: 1px solid #ddd; padding: 8px;">${paymentOrder.totalPrice}</td>
//                             </tr>
//                           </tfoot>
//                         </table>
//                         <p>Địa chỉ giao hàng: ${paymentOrder.shippingAddress.address}</p>
//                         <p>Phương thức thanh toán: ${paymentOrder.paymentMethod}</p>
//                         <p>HUYPHAM cảm ơn bạn đã đặt hàng. Chúc bạn một ngày làm việc thật năng suất.</p>
//                       </main>
//                       <footer style="text-align: center; margin-top: 16px;">
//                         <p>HUYPHAM</p>
//                         <p><a href="https://localhost:3000" style="color: #1a0dab;">Truy cập website của chúng tôi</a></p>
//                       </footer>
//                     </section>
//                   `,
//                 });

//                 console.log("Message sent: %s", info.messageId);
//                 resolve(info);
//             } catch (error) {
//                 console.error("Error sending email:", error);
//             }







//         } catch (e) {
//             reject(e)
//             console.log('not success')
//         }
//     })
// }







const sendEmailCreateOrder = async (email, id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const paymentOrder = await Order.findOne({ _id: id });

            if (!email || typeof email !== 'string' || !email.trim()) {
                return reject(new Error("Invalid email address"));
            } else {
                console.log("Sending email to:", email);
            }

            let a = 0;
            if (paymentOrder?.deliveryMethod === 'FAST') {
                a = 40000
            } else {
                a = 30000
            }
            console.log('gmail', configEmail.account)
            console.log('pass', configEmail.password)

            const transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 465,
                secure: true,
                auth: {
                    user: configEmail.account,
                    pass: configEmail.password,
                },
            });


            // Generate HTML for the ordered products
            const productsHtml = paymentOrder.orderItems.map((item, index) => `
                <tr>
                    <td style="border: 1px solid #ddd; padding: 8px;">
                        <img src="cid:image${index}" alt="${item.name}" style="height: 50px; vertical-align: middle; margin-right: 10px;">
                        ${item.name}
                    </td>
                    <td style="border: 1px solid #ddd; padding: 8px;">${item.price}</td>
                    <td style="border: 1px solid #ddd; padding: 8px;">${item.amount}</td>
                    <td style="border: 1px solid #ddd; padding: 8px;">${item.price * item.amount}</td>
                </tr>
            `).join('');

            // Create attachments for images
            const attachments = paymentOrder.orderItems.map((item, index) => ({
                filename: `image${index}.jpg`,
                content: item.image.replace(/^data:image\/jpeg;base64,/, ''),
                encoding: 'base64',
                cid: `image${index}`  // Content-ID
            }));

            const info = await transporter.sendMail({
                from: configEmail.account,
                to: email,
                subject: "Cảm ơn bạn đã đặt hàng từ TopZone ✔",
                text: "HUYPHAM cảm ơn bạn đã đặt hàng. Chúc bạn 1 ngày làm việc thật năng suất.",
                html: `
                <section style="max-width: 600px; margin: 0 auto; padding: 16px; font-family: Arial, sans-serif; background-color: #f9f9f9;">
                    <main>
                        <h2>Chào ${paymentOrder.shippingAddress.fullName},</h2>
                        <p>Cảm ơn bạn đã đặt hàng từ HUYPHAM! Dưới đây là chi tiết đơn hàng của bạn:</p>
                        <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
                            <thead>
                                <tr>
                                    <th style="border: 1px solid #ddd; padding: 8px;">Sản phẩm</th>
                                    <th style="border: 1px solid #ddd; padding: 8px;">Giá</th>
                                    <th style="border: 1px solid #ddd; padding: 8px;">Số lượng</th>
                                    <th style="border: 1px solid #ddd; padding: 8px;">Tổng</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${productsHtml}
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td colspan="3" style="border: 1px solid #ddd; padding: 8px; text-align: right;">Tổng cộng (đã bao gồm phí vận chuyển):</td>
                                    <td style="border: 1px solid #ddd; padding: 8px;">${paymentOrder.totalPrice - a}</td>
                                </tr>
                            </tfoot>
                        </table>
                        <p>Địa chỉ giao hàng: ${paymentOrder.shippingAddress.provinces} ${paymentOrder.shippingAddress.districts} ${paymentOrder.shippingAddress.wards} ${paymentOrder.shippingAddress.location}</p>
                        <p>Phương thức thanh toán: ${paymentOrder.paymentMethod}</p>
                        <p>HUYPHAM cảm ơn bạn đã đặt hàng. Chúc bạn một ngày làm việc thật năng suất.</p>
                    </main>
                    <footer style="text-align: center; margin-top: 16px;">
                        <p>HUYPHAM</p>
                        <p><a href="https://localhost:3000" style="color: #1a0dab;">Truy cập website của chúng tôi</a></p>
                    </footer>
                </section>
                `,
                attachments
            });

            console.log("Message sent: %s", info.messageId);
            resolve(info);
        } catch (e) {
            console.error("Error sending email:", e);
            reject(e);
        }
    });
};

const updateOrderToken = async (id, orderToken) => {



    try {
        const checkOrder = await Order.findOne({
            _id: id
        })
        if (checkOrder === null) {
            resolve({
                status: 'OK',
                message: 'id khong ton tai'
            })
        }


        await Order.findByIdAndUpdate(
            id,
            { orderToken: orderToken }, // Cập nhật orderToken
            { new: true } // Trả về bản ghi đã được cập nhật
        );







    } catch (e) {

        console.log('not success')
    }
}
const updateisPaid = async (id) => {



    try {
        const checkOrder = await Order.findOne({
            _id: id
        })
        if (checkOrder === null) {
            return reject({
                status: 'ERROR',
                message: 'id khong ton tai'
            })
        }


        await Order.findByIdAndUpdate(
            id,
            { isPaid: true }, // Cập nhật orderToken
            { new: true } // Trả về bản ghi đã được cập nhật
        );







    } catch (e) {

        console.log('not success')
    }
}
const getAllOrder = () => {
    return new Promise(async (resolve, reject) => {

        try {
            const allOrder = await Order.find();
            return resolve({
                status: 'OK',
                message: 'get all order',
                data: allOrder,
            })




        } catch (e) {
            reject(e)
            console.log('not successs')
        }
    })
}
module.exports = {
    createOrder,
    listOrder,
    deleteOrder,
    paymentOrder,
    sendEmailCreateOrder,
    paycallback,
    getAllOrder,
    updateisPaid,
    listOrderAll


}