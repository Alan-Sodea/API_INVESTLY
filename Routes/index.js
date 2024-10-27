const router = require("express").Router();
const userRouter = require("./userRouter");
const suRouter = require("./suRouter");

router.use("/users", userRouter)
router.use("/su", suRouter)

module.exports = router;