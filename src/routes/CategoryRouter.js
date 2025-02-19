const express = require('express')
const router = express.Router();
const { authMiddleWare, authUserMiddleWare, authUserMiddleWare1 } = require('../middleware/authMiddleware');
const CategoryController = require("../controller/CategoryController");
router.post('/create', CategoryController.createCategory);
router.put('/update/:id', CategoryController.updateCategory);
router.delete('/delete/:id', CategoryController.deleteCategory);
router.get('/get-all', CategoryController.getAllCategory);
router.get('/detailscategory/:id', CategoryController.detailsCategory);
router.get('/get-all-type-category', CategoryController.getAllType)
module.exports = router