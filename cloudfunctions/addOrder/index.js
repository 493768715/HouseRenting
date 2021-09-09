// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
   let order = event.order
   return await db.collection("order").add({
      data:{
        hid:order.hid,
        uid:order.uid,
        rent:order.rent,
        createtime:order.createtime,
        endtime:order.endtime,
        ispay:order.ispay
      }
   })
}