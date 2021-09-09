// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
    let message = event.message
    return await db.collection("message").add({
        data:{
            createtime:message.createtime,
            minfo:message.minfo,
            mtype:0,
            type:message.type,
            uid:message.uid
        }
    })
}