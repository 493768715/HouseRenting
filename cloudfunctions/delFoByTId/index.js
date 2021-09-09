// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
    let houseid = event.houseid;
    let uid = event.uid
    return await db.collection("focus").where({
        hid:houseid,
        uid:uid
    }).remove()
}