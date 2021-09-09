// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const _ = db.command
// 云函数入口函数
exports.main = async (event, context) => {
   let condition = event.condition;
   let region = condition[0];
   let rent = condition[1];
   let money = condition[2];
   let type = condition[3];
   let mon = {
       down:0,
       up:0
   };
   switch(money){
        case "":{
            break;
        }
        case "1":{
            mon = {
                up:1500
            }
            break;
        }
        case "2":{
            mon = {
                dwon:3000,
                up:1500
            }
            break;
        }
        case "3":{
            mon = {
                down:4500,
                up:3000
            }
            break;
        }
        case "4":{
            mon={
                down:6000,
                up:4500
            }
            break;
        }
    }
    if(region==""&&rent==""&&money==""&type!=""){
        return await db.collection("house").where({
            htype:type
        }).get()
    }else if(region==""&&rent==""&&money!=""&type==""){
        if(mon.down==0){
            return await db.collection("house").where({
                rent:_.lt(mon.up),
                issign:0,
                isaudit:1
            }).get()
        }else{
            return await db.collection("house").where({
                rent:_.lt(mon.down).and(_.gte(mon.up)),
                issign:0,
                isaudit:1
            }).get()
        }
    }else if(region==""&&rent==""&&money!=""&type!=""){
        if(mon.down==0){
            return await db.collection("house").where({
                rent:_.lt(mon.up),
                htype:type,
                issign:0,
                isaudit:1
            }).get()
        }else{
            return await db.collection("house").where({
                rent:_.lt(mon.down).and(_.gte(mon.up)),
                htype:type,
                issign:0,
                isaudit:1
            }).get()
        }
    }else if(region==""&&rent!=""&&money==""&type==""){
        return await db.collection("house").where({
            rtype:rent,
            issign:0,
            isaudit:1
        }).get()
    }else if(region==""&&rent!=""&&money==""&type!=""){
        return await db.collection("house").where({
            rtype:rent,
            htype:type,
            issign:0,
            isaudit:1
        }).get()
    }else if(region==""&&rent!=""&&money!=""&type==""){
        if(mon.down==0){
            return await db.collection("house").where({
                rent:_.lt(mon.up),
                rtype:rent,
                issign:0,
                isaudit:1
            }).get()
        }else{
            return await db.collection("house").where({
                rent:_.lt(mon.down).and(_.gte(mon.up)),
                rtype:rent,
                issign:0,
                isaudit:1
            }).get()
        }
    }else if(region==""&&rent!=""&&money!=""&type!=""){
        if(mon.down==0){
            return await db.collection("house").where({
                rent:_.lt(mon.up),
                rtype:rent,
                htype:type,
                issign:0,
                isaudit:1
            }).get()
        }else{
            return await db.collection("house").where({
                rent:_.lt(mon.down).and(_.gte(mon.up)),
                rtype:rent,
                htype:type,
                issign:0,
                isaudit:1
            }).get()
        }
    }else if(region!=""&&rent==""&&money==""&type==""){
        return await db.collection("house").where({
            region:region,
            issign:0,
            isaudit:1
        }).get()
    }else if(region!=""&&rent==""&&money==""&type!=""){
        return await db.collection("house").where({
            region:region,
            htype:type,
            issign:0,
            isaudit:1
        }).get()
    }else if(region!=""&&rent==""&&money!=""&type==""){
        if(mon.down==0){
            return await db.collection("house").where({
                rent:_.lt(mon.up),
                region:region,
                issign:0,
                isaudit:1
            }).get()
        }else{
            return await db.collection("house").where({
                rent:_.lt(mon.down).and(_.gte(mon.up)),
                region:region,
                issign:0,
                isaudit:1
            }).get()
        }
    }else if(region!=""&&rent==""&&money!=""&type!=""){
        if(mon.down==0){
            return await db.collection("house").where({
                rent:_.lt(mon.up),
                region:region,
                htype:type,
                issign:0,
                isaudit:1
            }).get()
        }else{
            return await db.collection("house").where({
                rent:_.lt(mon.down).and(_.gte(mon.up)),
                region:region,
                htype:type,
                issign:0,
                isaudit:1
            }).get()
        }
    }else if(region!=""&&rent!=""&&money==""&type==""){
        return await db.collection("house").where({
            region:region,
            rtype:rent,
            issign:0,
            isaudit:1
        }).get()
    }else if(region!=""&&rent!=""&&money==""&type!=""){
        return await db.collection("house").where({
            region:region,
            rtype:rent,
            htype:type,
            issign:0,
            isaudit:1
        }).get()
    }else if(region!=""&&rent!=""&&money!=""&type==""){
        if(mon.down==0){
            return await db.collection("house").where({
                rent:_.lt(mon.up),
                rtype:rent,
                region:region,
                issign:0,
                isaudit:1
            }).get()
        }else{
            return await db.collection("house").where({
                rent:_.lt(mon.down).and(_.gte(mon.up)),
                rtype:rent,
                region:region,
                issign:0,
                isaudit:1
            }).get()
        }
    }else if(region!=""&&rent!=""&&money!=""&type!=""){
        if(mon.down==0){
            return await db.collection("house").where({
                rent:_.lt(mon.up),
                rtype:rent,
                region:region,
                htype:type,
                issign:0,
                isaudit:1
            }).get()
        }else{
            return await db.collection("house").where({
                rent:_.lt(mon.down).and(_.gte(mon.up)),
                rtype:rent,
                region:region,
                htype:type,
                issign:0,
                isaudit:1
            }).get()
        }
    }
}