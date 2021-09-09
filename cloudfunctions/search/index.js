// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const _ = db.command
// 云函数入口函数
exports.main = async (event, context) => {
    let e = event.info
    return await db.collection("house").where(_.or([
        {
            title:db.RegExp({
                regexp:e,
                option:'i'
            })
        },
        {
            region:db.RegExp({
                regexp:e,
                option:'i'
            })
        },
        {
            createtime:db.RegExp({
                regexp:e,
                option:'i'
            })
        },
        {
            htype:db.RegExp({
                regexp:e,
                option:'i'
            })
        }
    ])).and({
        issign:0,
        isaudit:1
    }).get()
}