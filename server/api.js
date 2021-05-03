var router = require('express').Router()

// Functions to run on all API paths (if any)
// TODO 

// Set up different routes
router.use('/budgets', require('./routes/budgets'))
router.use('/budgetSections', require('./routes/budgetSections'))
router.use('/fundingRequests', require('./routes/fundingRequests'))
// router.use('/lineItems', require('./routes/lineItems'))
router.use('/minutes', require('./routes/minutes'))
router.use('/reallocations', require('./routes/reallocations'))
router.use('/studentLifeFee', require('./routes/studentLifeFee'))

// Export router for app to use
module.exports = router