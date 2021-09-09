// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
    let house = event.house
    return await db.collection("house").doc(house.id).update({
        data:{
            title:house.title,
            rent:house.rent,
            floor:house.floor,
            area:house.area,
            rtype:house.rtype,
            htype:house.htype,
            region:house.region,
            address:house.address,
            facilities:house.facilities,
            desc:house.desc,
            image:house.image
        }
    })
}