// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
    let id = event.id
    let lesseeid = event.lesseeid
    let createtime = event.createtime
    return await db.collection("sign").doc(id).update({
        data:{
            lesseeid:lesseeid,
            createtime:createtime
        }
    })
}