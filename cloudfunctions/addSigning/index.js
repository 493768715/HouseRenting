// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
    let signing = event.signing
    return await db.collection("signing").add({
        data:{
            hid:signing.houseid,
            lessorid:signing.masterid,
            lesseeid:signing.userid,
            createtime:signing.createtime
        }
    })
}