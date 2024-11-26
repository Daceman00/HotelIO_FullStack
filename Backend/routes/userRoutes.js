const express = require('express');
const authController = require('./../controllers/authController');
const userController = require('./../controllers/userController');

const router = express.Router();

router.post('/signup', authController.signup)
router.post('/login', authController.login);
router.post("/forgotPassword", authController.forgotPassword)
router.patch("/resetPassword/:token", authController.resetPassword)

router.use(authController.protect)

router.get("/getMyAccount", userController.getMyAccount, userController.getUser);
router.patch("/updateMyAccount", userController.updateMyAccount);
router.delete("/deleteMyAccount", userController.deleteMyAccount);



router.use(authController.restrictTo('admin'))

router.route('/')
    .get(userController.getAllUsers)
    .post(userController.createUser);

router.route('/:id')
    .get(userController.getUser)
    .patch(userController.updateUser)
    .delete(userController.deleteUser)

module.exports = router;