const { addMessage, getAllMessage } = require('../controllers/messagesController');

const router = require('express').Router();

router.post("/addMessage", addMessage);
router.post("/getmgs", getAllMessage);

module.exports = router;