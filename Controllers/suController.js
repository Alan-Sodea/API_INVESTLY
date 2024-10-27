const {Su} = require("./../Models/suModel")
const {User} = require("./../Models/usersModel")

exports.register = async () => 
{
    const newSu = await Su.create({password : "1234", notification : []});
    return newSu;
}

exports.drop = async () => 
{
    const newSu = await Su.deleteMany();
    return newSu;
}

exports.login = async ({password}) => {
    const elt = await Su.findOne({password});
    if (!elt || (elt == null)) return {error : "Invalid password"}; 
    else {
        return elt;
    }
}

exports.modify = async ({password, newPassword}) =>
{
    const elt = await Su.findOne({password});
    if (!elt || (elt == null)) return {error : "Invalid password"}; 
    else {
        elt.password = newPassword;
        elt.save();
        return elt;
    }
}

exports.deposit = async ({phone, password, amount}) => {
    const elt = await User.findOne({phone, password});
    if (!elt || (elt == null)) return {error : "Invalid phone or password"}; 
    // if (elt.networth + amount < 0) return {error : "Not enough money in your account"};
    else{
        elt.networth += amount;
        console.log({"deposit" : elt.networth});
        await elt.save();
        return elt;
    }
}

exports.withdrawal = async ({phone, password, amount}) => {
    const elt = await User.findOne({phone, password});
    if (!elt || (elt == null)) return {error : "Invalid phone or password"}; 
    if (elt.networth - amount < 0) return {error : "Not enough money in the account"};
    else{
        elt.networth -= amount;
        console.log({"withdrawal" : elt.networth});
        await elt.save();
        return elt;
    }
}

exports.getNotification = async (notificationId) => {
    const su = await Su.findOne({});
    return su;
}

exports