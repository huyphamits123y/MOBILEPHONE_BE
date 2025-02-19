require('dotenv').config();

const config = {
    port: process.env.PORT || 3001,
    mongoURI: process.env.MONGO_DB,
    corsOptions: {
        origin: 'http://localhost:3000', // Địa chỉ frontend
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        credentials: true, // Cho phép gửi cookie và thông tin xác thực cùng với yêu cầu
    },
    appConfig: {
        app_id: process.env.app_id,
        key1: process.env.key1,
        key2: process.env.key2,
        endpoint: process.env.endpoint
    }
};

module.exports = config;
