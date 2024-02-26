const router = require('express').Router();
const testController = require('../controller/test');

router.get('/', testController.getAll);
router.post('/', testController.add);

router.get('/:id', testController.getOne);
router.put('/:id', testController.edit);
router.delete('/:id', testController.delete);

module.exports = router;
