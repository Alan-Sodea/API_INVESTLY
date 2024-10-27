const {User} = require("./../Models/usersModel")
const {Su} = require("./../Models/suModel")
const {checkBundles, joursEntreDates} = require("./bundles");


const actualDate = () => {
    // return new Date().toISOString().split('T')[0]
    return "2024-10-27";
}

exports.register = async ({phone, password, parentPhone}) => {
    const elt = await User.findOne({phone});
    if (elt && (elt != null)) return {error : "User already found"}; 
    const newUser = await User.create({phone, password, parentPhone, networth:0})
    return newUser;
}

exports.readUsers = async () => {
    const users = await User.find();
    return users; 
}

exports.deleteUsers = async () => {
    const elt = await User.deleteMany();
    return ; 
}

exports.login = async ({phone, password}) => {
    const elt = await User.findOne({phone, password});
    if (!elt || (elt == null)) return {error : "Invalid phone or password"}; 
    else {
        let somme = elt.networth;
        for (let i = 0; i < elt.invests.length; i++) {
            somme += joursEntreDates(actualDate(), elt.invests[i].Date) * checkBundles(elt.invests[i].Bundle).ROI
        }
        elt.networth = somme;
        return elt;
    }
}

exports.addChildren = async ({phone, childPhone}) => {
    const elt = await User.findOne({phone});
    if (!elt || (elt == null)) return {error : "Invalid phone or password"}; 
    else{
        elt.childrenPhone.push(childPhone);
        await elt.save();
        return elt;
    }
}

exports.invest = async ({phone, password, bundleId}) => {
    const elt = await User.findOne({phone, password});
    const bundle = checkBundles(bundleId);
    
    if (!elt || (elt == null)) return {error : "Invalid phone or password"}; 
    if (!bundle) return {error : "Bundle not available"};
    
    else{
        if (elt.networth - bundle.amount < 0) {return {error : "Not enough money in your account"};}
        elt.networth -= bundle.amount;
        elt.invests.push({Bundle : bundle.id, Date : new Date().toISOString().split('T')[0]});
        await elt.save();
        return elt;
    }
}

exports.stopInvest = async ({phone, password, bundleId}) => {
    const elt = await User.findOne({phone, password});
    const bundle = checkBundles(bundleId);
    
    if (!elt || (elt == null)) return {error : "Invalid phone or password"}; 
    if (!bundle) return {error : "Bundle not available"};

    else
    {
        const newInvest = elt.invests.find(invest => invest.Bundle== bundleId);
        if (!newInvest)return {error : "Bundle not subscribed to"};
        const earns = checkBundles(newInvest.Bundle).ROI * joursEntreDates(actualDate(), newInvest.Date);
        elt.networth += earns;
        elt.invests = elt.invests.filter(invest => invest._id != newInvest._id)
        await elt.save();
        return elt;
    }

}

exports.deposit = async ({phone, password, transactionId, amount}) => {
    const elt = await User.findOne({phone, password});
    const su = await Su.findOne({});
    const list = su.notifications.filter(notification => notification.transactionId == transactionId)
    if (list.length != 0) return {error : "Transaction id already used"};
    if (!elt || (elt == null)) return {error : "Invalid phone or password"};
    else{
        su.notifications.push({
            transactionType : "DEPOSIT",
            amount,
            date : new Date().toISOString().split('T')[0],
            transactionId,
            phone,
            password,
            processed: false,
        })
        su.save();
        return {msg: "success"}
    }
}

exports.withdrawal = async ({phone, password, transactionId, amount}) => {
    const elt = await User.findOne({phone, password});
    const su = await Su.findOne({});
    const list = su.notifications.filter(notification => notification.transactionId == transactionId)
    if (list.length != 0) return {error : "Transaction id already used"};
    if (!elt || (elt == null)) return {error : "Invalid phone or password"};
    else if (elt.networth - amount < 0) return {error : "Not enough money in the account"};
    else{
        su.notifications.push({
            transactionType : "WITHDRAWAL",
            amount,
            date : new Date().toISOString().split('T')[0],
            transactionId,
            phone,
            password,
            processed: false,
        })
        su.save();
        return {msg: "success"}
    }
}