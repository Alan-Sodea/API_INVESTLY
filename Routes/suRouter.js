const router = require("express").Router();
const {drop, login, getNotification, deposit, withdrawal, register } = require("../Controllers/suController");


router.post("/", (req, res) => 
{
    register();
    res.json({success: true});
})

router.get("/", async (req, res) => {
    const {password} = req.query;
    const elt = await login({password})
    if (elt.error) {res.status(400).json(elt.error);}
    else res.json(elt);
})

router.delete("/", async (req, res) => {
    await drop();
    res.json({msg: "Deletion successfully occurred"});
})

router.post("/accept", async (req, res) => {
    const { notificationId } = req.body;
    if (!notificationId) {res.status(404).json({error : "Notification not found"}); return}
    const elt1 = await getNotification();
    const elt = await elt1.notifications; 
    const myNotif1 = elt.filter((notification) => notification._id == notificationId)
    if(myNotif1.length == 0) {res.status(404).json({error : "Notification not found"}); return} 
    const myNotif = myNotif1[0];
    // console.log({myNotif});
    if (myNotif.processed) {res.status(400).json({error : "Notification already processed"}); return};
    
    if (myNotif.transactionType == "DEPOSIT"){
        const response1 = deposit({phone : myNotif.phone, password : myNotif.password, amount : myNotif.amount})
        if (response1.errors)
        {   
            res.status(400).json(response1);
            return;
        }
        else
        {
            myNotif.processed = true;
            await elt1.save();
            res.status(200).json({msg: "success"});
        }
    }
    else if (myNotif.transactionType == "WITHDRAWAL"){
        const response2 = withdrawal({phone : myNotif.phone, password : myNotif.password, amount : myNotif.amount})
        if (response2.errors)
        {   
            res.status(400).json(response2);
            return;
        }
        else
        {
            myNotif.processed = true;
            await elt1.save();
            res.status(200).json({msg: "success"});
        }
    }
    else
    {
        console.log(myNotif.transactionType);
        res.status(400).json({error : "Invalid transaction type"});
    }
})

module.exports = router;