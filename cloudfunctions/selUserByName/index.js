// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
    let name = event.name
    console.log(name)
    return await db.collection("user").where({
        name:name
    }).get()
}