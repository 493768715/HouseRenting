// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
    let house = event.house;
    let rent = parseInt(house.rent)
    let area = parseInt(house.area)
    let isaudit =  parseInt(house.isaudit)
    let issign =  parseInt(house.issign)
    return await db.collection("house").add({
       data:{
           title:house.title,
           image:house.image,
           rent:rent,
           floor:house.floor,
           area:area,
           htype:house.htype,
           rtype:house.rtype,
           region:house.region,
           address:house.address,
           facilities:house.facilities,
           desc:house.desc,
           createtime:house.createtime,
           uid:house.uid,
           signid:house.signid,
           isaudit:isaudit,
           issign:issign
       }
    });
}