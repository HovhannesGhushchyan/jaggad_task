const  express = require('express');
const { sendNotification, getMessages } = require("../service/notification.service");
const router = express.Router();

router.post('/add-notifications', async (req, res) => {
   return await sendNotification(req, res);
});

router.get('/messages', async (req, res) => {
   return await getMessages(req, res);
});

module.exports = router;
