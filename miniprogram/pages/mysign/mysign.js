// pages/mysign/mysign.js
const Ctime  = require("../utils/Ctime.js")
Page({

    /**
     * 页面的初始数据
     */
    data: {
        active:0,
        sign:[], //已签约出租方
        orsign:[], //已签约承租方
        lessee:[], //已签约的承租方
        orcreatetime:[], //已签约
        eecreatetime:[], //已签约
        lessor:[], //已签约
        nosign:[], //未签约

        break:[], //待解约
        breaklessee:[],
        breaklessor:[],
        breakname:[],
        user:{} //用户信息
    },
    onChange(e){
        this.setData({
            active:e.detail.index
        })
        if(e.detail.index==1&&this.data.break.length==0){
            wx.cloud.callFunction({
                name:"selBreakSignByLis",
                data:{
                    listener:this.data.user._id
                }
            }).then(res=>{
                for(let i=0;i<res.result.data.length;i++){
                    wx.cloud.callFunction({
                        name:"selHouseById",
                        data:{
                            id:res.result.data[i].hid
                        }
                    }).then(res1=>{
                        this.setData({
                            [`break[${i}]`]:res1.result.data
                        })
                    })
                    wx.cloud.callFunction({
                        name:"selUserById",
                        data:{
                            id:res.result.data[i].lessorid
                        }
                    }).then(res2=>{
                        if(this.data.user._id!=res.result.data[i].lessorid){
                            this.setData({
                                [`breaklessor[${i}]`]:res2.result.data,
                                [`breakname[${i}]`]:res2.result.data.name
                            })
                        }else{
                            this.setData({
                                [`breaklessor[${i}]`]:res2.result.data
                            })
                        }
                    })
                    wx.cloud.callFunction({
                        name:"selUserById",
                        data:{
                            id:res.result.data[i].lesseeid
                        }
                    }).then(res3=>{
                        if(this.data.user._id!=res.result.data[i].lesseeid){
                             this.setData({
                                [`breaklessee[${i}]`]:res3.result.data,
                                [`breakname[${i}]`]:res3.result.data.name
                            })
                        }else{  
                            this.setData({
                                [`breaklessee[${i}]`]:res3.result.data
                            })
                        }
                    })
                }
            })
        }
    },
    //待解约
    break(e){
        let id = e.currentTarget.dataset.id
        let signid = e.currentTarget.dataset.signid
        let index = e.currentTarget.dataset.index
        let that = this
        wx.showModal({
          title:"解约提醒",
          content:"确定与该用户解约",
          success(res){
              if(res.confirm){
                wx.showLoading({
                    title: '加载中'
                  })
                  wx.cloud.callFunction({
                      name:"delBreakSignByHid",
                      data:{
                          id
                      }
                  }).then(res=>{
                        wx.cloud.callFunction({
                            name:"updateHouseIsSign",
                            data:{
                                id,
                                issign:0
                            }
                        })
                        wx.cloud.callFunction({
                            name:"updateLesseeBySid",
                            data:{
                                signid
                            }
                        }).then(res=>{
                            let result = that.data.break
                            let result1 = result.splice(index,1)
                            that.setData({
                                break:result
                            })
                            let time = Date.now()
                            let createtime = Ctime.formatDate(time)
                            let message = {}
                            if(that.data.breakname[index]==that.data.breaklessor[index].name){
                                message = {
                                    type:"解约提醒",
                                    uid:that.data.breaklessor[index]._id,
                                    createtime,
                                    minfo:"用户"+that.data.breaklessee[index].name+"同意与您的解约申请，双方租赁关系解除。"
                                }
                            }else if(that.data.breakname[index]==that.data.breaklessee[index].name){
                                message = {
                                    type:"解约提醒",
                                    uid:that.data.breaklessee[index]._id,
                                    createtime,
                                    minfo:"用户"+that.data.breaklessor[index].name+"同意与您的解约申请，双方租赁关系解除。"
                                }
                            }
                            wx.cloud.callFunction({
                                name:"addMessage",
                                data:{
                                    message
                                }
                            }).then(res=>{
                                wx.hideLoading()
                            })
                        })
                  })
              }
          }
        })
    },
    back(e){
        let id = e.currentTarget.dataset.id
        let index = e.currentTarget.dataset.index
        let that = this
        wx.showModal({
          title:"解约提醒",
          content:"是否拒绝该用户发起的解约",
          success(res){
              if(res.confirm){
                wx.showLoading({
                    title: '加载中'
                  })
                wx.cloud.callFunction({
                    name:"delBreakSignByHid",
                    data:{
                        id
                    }
                }).then(res=>{
                    wx.cloud.callFunction({
                        name:"updateHouseIsSign",
                        data:{
                            id,
                            issign:2
                        }
                    }).then(res=>{
                        let result = that.data.break
                        let result1 = result.splice(index,1)
                        that.setData({
                            break:result
                        })
                        let time = Date.now()
                        let createtime = Ctime.formatDate(time)
                        let message = {}
                        if(that.data.breakname[index]==that.data.breaklessor[index].name){
                            message = {
                                type:"解约提醒",
                                uid:that.data.breaklessor[index]._id,
                                createtime,
                                minfo:"用户"+that.data.breaklessee[index].name+"拒绝了您的解约申请，请再次协商后再发起解约。"
                            }
                        }else if(that.data.breakname[index]==that.data.breaklessee[index].name){
                            message = {
                                type:"解约提醒",
                                uid:that.data.breaklessee[index]._id,
                                createtime,
                                minfo:"用户"+that.data.breaklessor[index].name+"拒绝了您的解约申请，请再次协商后再发起解约。"
                            }  
                         }
                        wx.cloud.callFunction({
                            name:"addMessage",
                            data:{
                                message
                            }
                        }).then(res=>{
                            wx.hideLoading()
                        })
                    })
                })
              }
          }
        })
    },
    edit(e){
        wx.navigateTo({
          url: '../editsign/editsign?sid='+e.currentTarget.dataset.id+"&rent=0&address=0",
        })
    },
    breakSign(e){  //发起解约
        let id = e.currentTarget.dataset.id
        let listener = e.currentTarget.dataset.listener
        let who = e.currentTarget.dataset.who
        let index = e.currentTarget.dataset.index
        let that = this
        wx.showModal({
          title:"解约提醒",
          content:"确定解约该合同？",
          success(res){
              if(res.confirm){
                wx.showLoading({
                    title: '加载中'
                  })
                  wx.cloud.callFunction({
                      name:"updateHouseIsSign",
                      data:{
                          id:id,
                          issign:3
                      }
                  }).then(res=>{
                      let time = Date.now()
                      let createtime = Ctime.formatDate(time)
                      let breaksign = {}
                      if(who=="lessee"){
                            breaksign = {
                                hid:id,
                                createtime:createtime,
                                lessorid:that.data.user._id,
                                lesseeid:listener._id,
                                listener:listener._id
                            }
                      }else{
                            breaksign = {
                                hid:id,
                                createtime:createtime,
                                lessorid:listener._id,
                                lesseeid:that.data.user._id,
                                listener:listener._id
                            }
                      }  
                      wx.cloud.callFunction({
                        name:"addBreakSign",
                        data:{
                            breaksign 
                        }
                      }).then(res=>{
                          if(who=="lessee"){
                            let result = that.data.sign
                            let result1 = result.splice(index,1)
                            that.setData({
                                sign:result
                            })
                          }else if(who=="lessor"){
                            let result = that.data.orsign
                            let result1 = result.splice(index,1)
                            that.setData({
                                orsign:result
                            })
                            }
                            let message = {
                                type:"解约提醒",
                                uid:listener._id,
                                createtime,
                                minfo:"用户"+that.data.user.name+"向您的房屋发起解约，请尽快确定是否解除双方租赁关系。"
                            }
                            wx.cloud.callFunction({
                                name:"addMessage",
                                data:{
                                    message
                                }
                            }).then(res=>{
                                wx.hideLoading()
                            })
                      })
                  })
              }
          }
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let user = wx.getStorageSync('user')
        wx.showLoading({
            title: '加载中'
          })
        wx.cloud.callFunction({
            name:"selHouseByUid",
            data:{
                id:user._id
            }
        }).then(res=>{
            let nosign = []
            let sign = []
            for(let i=0;i<res.result.data.length;i++){
                 if(res.result.data[i].issign==0){
                    nosign.push(res.result.data[i])
                 }else if(res.result.data[i].issign==2){
                   sign.push(res.result.data[i])
                 }
            }
            this.setData({
                sign,
                nosign,
                user
            })
            this.selSignByHid(sign)
            this.selHouseByLesseeid()
            wx.hideLoading()
        })
    },
    //查询用户已签约的合同
    selSignByHid(sign){
        let lessee = []
        let that = this
        let createtime = []
        for(let i=0;i<sign.length;i++){
            wx.cloud.callFunction({
                name:"selSignById",
                data:{
                    signid:sign[i].signid
                }
            }).then(res=>{
                createtime.push(res.result.data.createtime)
                wx.cloud.callFunction({
                    name:"selUserById",
                    data:{
                        id:res.result.data.lesseeid
                    }
                }).then(res1=>{
                    lessee.push(res1.result.data)
                    if(i==sign.length-1){
                        that.setData({
                            lessee:lessee,
                            eecreatetime:createtime
                        })
                    }
                })
            })
        }
    },
    //查看承租户已签约的房屋
    selHouseByLesseeid(){
        let house = []
        let that = this
        let signCreatetime = []
        let lessor = []
        wx.cloud.callFunction({
            name:"selSignByLesseeId",
            data:{
                lesseeid:this.data.user._id
            }
        }).then(res=>{
            let length = res.result.data.length
            for(let i=0;i<res.result.data.length;i++){
                signCreatetime.push(res.result.data[i].createtime)
                wx.cloud.callFunction({ //查找承租方的房子
                    name:"selHouseBySignId",
                    data:{
                        id:res.result.data[i]._id
                    }
                }).then(res1=>{
                    house.push(res1.result.data[0])
                    wx.cloud.callFunction({ //查找出租方
                        name:"selUserById",
                        data:{
                            id:res.result.data[i].lessorid
                        }
                    }).then(res2=>{
                        lessor.push(res2.result.data)
                        if(i==length-1){
                            that.setData({
                                orsign:house,
                                orcreatetime:signCreatetime,
                                lessor:lessor
                            })
                        }
                    })
                })
            }
        })
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})