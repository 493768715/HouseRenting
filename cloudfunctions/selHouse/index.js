// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
    let skip = parseInt(event.page)
    return await db.collection("house").where({
        issign:0,
        isaudit:1
    }).skip(skip).limit(5).get()
}