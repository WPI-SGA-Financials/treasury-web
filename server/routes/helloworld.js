var router = require('express').Router();

/**
 * @swagger
 *
 * /helloworld/example:
 *   get:
 *     description: Hello world
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: string
 */
router.get('/example', (req, res) => {
    res.send({"message": "Hello World", "time": Date.now()});
});

module.exports = router;