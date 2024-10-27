const {User} = require("./../Models/usersModel")
const router = require("express").Router();
const { register, readUsers, deleteUsers, login, addChildren, invest, deposit, stopInvest, withdrawal } = require("../Controllers/userController");

router.post("/", async (req, res) => {
    const {phone, password, parentPhone} = req.body;
    if (!phone || !password || phone == undefined || password == undefined)
    {
        res.status(400).send("Missing parameters");
        return;
    }
    else
    {
        let elt;
        if (!parentPhone) elt = await register({phone, password, parentPhone : null, });
        else {
            const parent = await User.findOne({phone: parentPhone});
            if (!parent || (parent == null)) {
                res.status(400).json({err : "Invalid parent phone."});
                return;
            }
            else
            {
                elt = await register({phone, password, parentPhone });
                await addChildren({phone : parent.phone, childPhone : phone})
            }
        }

        res.json(elt);
        
        return;
    }
})

router.get("/user", async (req, res) => {
    const { phone, password } = req.query;
    if (!phone || !password) res.status(400).send("Missing phone or password")
        else {
    const user = await login({phone, password});
    res.json(user);
}
})


router.get("/", async (req, res) => {
    const users = await readUsers();
    res.json(users);
    return;
})

router.delete("/", async (req, res) => {
    const users = await deleteUsers();
    res.json({msg : "Deletion successfully occurred"});
    return;
})

router.post("/invest", async (req, res) => {
    const {phone, password, bundleId} = req.body;
    if (!phone || !password || !bundleId) res.status(400).send("Missing phone or password")
    else
    {
        const elt = await invest({phone, password, bundleId})
        if (elt.error){
            res.status(400).json(elt);
            return;
        }
        else
        {
            res.status(200).json(elt);
        }
    }
    
})

router.post("/deposit", async (req, res) => 
{
    
    const {phone, password, transactionId, amount} = req.body;
    if (!phone || !password || !amount || !transactionId) res.status(400).send("Missing parameter")
    else{
        const elt = await deposit({phone, password, amount, transactionId})
        if (elt.error){
            res.status(400).json(elt);
            return;
        }
        else
        {
            res.status(200).json(elt);
        }
    }
    
})

router.post("/withdrawal", async (req, res) => 
{
    const {phone, password, transactionId, amount} = req.body;
    if (!phone || !password || !amount || !transactionId) res.status(400).send("Missing parameter")
    else{
        const elt = await withdrawal({phone, password, amount, transactionId})
        if (elt.error){
            res.status(400).json(elt);
            return;
        }
        else
        {
            res.status(200).json(elt);
        }
    }
    
})

router.post("/stopInvest", async (req, res) => {
    const {phone, password, bundleId} = req.body;
    if (!phone || !password || !bundleId) res.status(400).send("Missing phone or password")
    else{
        const elt = await stopInvest({phone, password, bundleId})
        if (elt.error){
            res.status(400).json(elt);
            return;
        }
        else
        {
            res.status(200).json(elt);
        }
    }

})

module.exports = router;