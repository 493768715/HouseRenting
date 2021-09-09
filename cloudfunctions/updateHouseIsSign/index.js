// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
    let id = event.id
    let issign = event.issign
    return await db.collection("house").doc(id).update({
        data:{
            issign:issign
        }
    })
}