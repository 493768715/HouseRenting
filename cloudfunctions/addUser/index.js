// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database();
// 云函数入口函数
exports.main = async (event, context) => {
    let name = event.name;
    let sex = event.sex;
    let image = event.image
    let phone = event.phone
    let wxid = event.wxid
    let desc = event.desc
    try{
        return await db.collection("user").add({
            data:{
                name:name,
                sex:sex,
                image:image,
                phone:phone.image,
                wxid:wxid,
                desc:desc
            }
        })
    }catch(e){
        console.error(e)
    }
   
}