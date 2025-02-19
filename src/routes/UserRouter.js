const express = require('express')
const router = express.Router();
const userController = require("../controller/UserController");
const { authMiddleWare, authUserMiddleWare, authUserMiddleWare1 } = require('../middleware/authMiddleware');

router.post('/sign-up', userController.createUser);
router.post('/sign-in', userController.loginUser);
// router.put('/update-user/:id', authMiddleWare, userController.updateUser);
router.put('/update-user/:id', userController.updateUser);
// router.delete('/delete-user/:id', authMiddleWare, userController.deleteUser);
router.delete('/delete-user/:id', userController.deleteUser);
// router.get('/getAll', authMiddleWare, userController.getAllUser);
router.get('/getAll', userController.getAllUser);
// router.get('/get-details/:id', authUserMiddleWare, userController.getDetailsUser);
router.get('/get-details/:id', userController.getDetailsUser);
// router.post('/refresh-token', authUserMiddleWare1, userController.refreshtoken);
router.post('/refresh-token', userController.refreshtoken);
router.post('/log-out', userController.logoutUser);
module.exports = router