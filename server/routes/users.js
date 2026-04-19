router.get('/', auth, authorize('Admin', 'Project Manager'), userController.getUsersByRole);
router.put('/profile', auth, userController.updateProfile);
router.put('/change-password', auth, userController.changePassword);

module.exports = router;
