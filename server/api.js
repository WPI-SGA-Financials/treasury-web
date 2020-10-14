var router = require('express').Router();

// Define namespaces
router.use('/helloworld', require('./routes/helloworld'));

module.exports = router;