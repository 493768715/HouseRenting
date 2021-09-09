// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
    let lesseeid = event.lesseeid
    return await db.collection("sign").where({
        lesseeid:lesseeid
    }).get()
}