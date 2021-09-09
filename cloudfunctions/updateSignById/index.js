// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
    let sign = event.sign
    let rent = parseInt(sign.rent)
    let deadline = parseInt(sign.deadline)
    let deposit = parseInt(sign.deposit)
    return await db.collection("sign").doc(sign.id).update({
        data:{
            address:sign.address,
            deadline,
            rent,
            deposit,
            convention:sign.convention,
            breach:sign.breach,
            sublet:sign.sublet
        }
    })
}