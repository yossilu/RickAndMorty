const express = require('express')
const router = express.Router()
const {
  getOne,
  getAll,
  getOptions,
  getLocations
} = require('../controllers/rickAndMortyController.js')

const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/getAll', protect, getAll)
router.get('/getOne/:ramId',protect, getOne);
router.get('/getOptions', protect, getOptions);
router.get('/getLocations', protect, authorize('ADMIN'), getLocations)



module.exports = router