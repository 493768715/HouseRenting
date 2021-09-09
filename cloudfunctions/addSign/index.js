// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
    const sign = event.sign
    let deadline = parseInt(sign.deadline)
    let rent = parseInt(sign.rent)
    let deposit = parseInt(sign.deposit)
    return await db.collection("sign").add({
        data:{
            lessorid:sign.lessorid,
            address:sign.address,
            deadline:deadline,
            rent:rent,
            deposit:deposit,
            convention:sign.convention,
            sublet:sign.sublet,
            breach:sign.breach
        }
    })
}