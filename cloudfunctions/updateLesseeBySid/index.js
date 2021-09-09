// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
let db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
   let id = event.signid
   return await db.collection("sign").doc(id).update({
       data:{
           lesseeid:"",
           createtime:""
       }
   })
}