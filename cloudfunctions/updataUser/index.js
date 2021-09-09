// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
    let user = event.user
    return await db.collection("user").where({
        _id:user._id
    }).update({
        data:{
            name:user.name,
            image:user.image,
            sex:user.sex,
            phone:user.phone,
            wxid:user.wxid,
            desc:user.desc
        }
    })
}