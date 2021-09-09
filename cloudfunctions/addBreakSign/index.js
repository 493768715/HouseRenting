// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
    let breaksign = event.breaksign
    return await db.collection("breaksign").add({
        data:{
            hid:breaksign.hid,
            createtime:breaksign.createtime,
            lessorid:breaksign.lessorid,
            lesseeid:breaksign.lesseeid,
            listener:breaksign.listener
        }
    })
}