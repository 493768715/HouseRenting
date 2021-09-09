// pages/myhouse/myhouse.js
const Ctime = require("../utils/Ctime.js")
const Etime = require("../utils/Etime.js") 
Page({

    /**
     * 页面的初始数据
     */
    data: {
        active: 0,
        user:{},
        sign:[],
        signing:[],
        nosign:[],
        lesseename:[],
        leseee:[]
    },
    //确定待签约的房屋
    checkSign(e){
        let that = this
        let id = e.currentTarget.dataset.id
        let sid = e.currentTarget.dataset.sid
        let rent = e.currentTarget.dataset.rent
        let index = e.currentTarget.dataset.index
        let time = Date.now()
        let createtime = Ctime.formatDate(time)
        let endtime = Etime.formatDate(time)
        wx.showModal({
            title:"签约提醒",
            content:"确认签约？",
            success(res){
                if(res.confirm){
                    wx.showLoading({
                        title: '加载中'
                    })
                    wx.cloud.callFunction({
                        name:"selSigningByHid",
                        data:{
                            id
                        }
                    }).then(res=>{
                            wx.cloud.callFunction({
                                name:"updateSignToeeid",
                                data:{
                                    id:sid,
                                    lesseeid:res.result.data[0].lesseeid,
                                    createtime
                                }
                            }).then(res=>{
                                let message = {
                                    type:"签约提醒",
                                    uid:that.data.lessee[index]._id,
                                    createtime,
                                    minfo:"您发起的签约已通过，请在我的签约中查看信息..."
                                }
                                wx.cloud.callFunction({
                                    name:"addMessage",
                                    data:{
                                        message
                                    }
                                })
                                wx.cloud.callFunction({
                                    name:"selSignById",
                                    data:{
                                        signid:sid
                                    }
                                }).then(res=>{
                                    let order = {
                                        hid:id,
                                        uid:that.data.lessee[index]._id,
                                        rent:rent,
                                        createtime:createtime,
                                        endtime:endtime,
                                        ispay:0
                                    }
                                    let order1 = {
                                        hid:id,
                                        uid:that.data.lessee[index]._id,
                                        rent:res.result.data.deposit,
                                        createtime:createtime,
                                        endtime:endtime,
                                        ispay:0
                                    }
                                    wx.cloud.callFunction({//生成订单
                                        name:"addOrder",
                                        data:{
                                            order:order
                                        }
                                    }).then(res=>{
                                        let message = {
                                            type:"交租提醒",
                                            uid:that.data.lessee[index]._id,
                                            createtime,
                                            minfo:"您已成功租屋，房屋房租请在"+endtime+"前交租。"
                                        }
                                        wx.cloud.callFunction({
                                            name:"addMessage",
                                            data:{
                                                message
                                            }
                                        })
                                    })
                                    wx.cloud.callFunction({
                                        name:"addOrder",
                                        data:{
                                            order:order1
                                        }
                                    })
                                })
                                wx.cloud.callFunction({
                                    name:"updateHouseIsSign",
                                    data:{
                                        id,
                                        issign:2
                                    }
                                }).then(res=>{
                                    wx.cloud.callFunction({
                                        name:"delSigningByHid",
                                        data:{
                                            id
                                        }
                                    }).then(res=>{
                                        let result = that.data.signing
                                        let result1 = result.splice(index,1)
                                        that.setData({
                                            signing:result,
                                            sign:[...that.data.sign,result1[0]],
                                            lesseename:[...that.data.lesseename,that.data.lessee[index].name]
                                        })
                                        wx.hideLoading()
                                    })
                                })
                            })
                    })
                }
            }
        })
    },
    refuse(e){
        let id = e.currentTarget.dataset.id
        let index = e.currentTarget.dataset.index
        wx.showLoading({
            title: '加载中'
          })
        wx.cloud.callFunction({
            name:"updateHouseIsSign",
            data:{
                id,
                issign:0
            }
        }).then(res=>{
            wx.cloud.callFunction({
                name:"delSigningByHid",
                data:{
                    id
                }
            }).then(res=>{
                let result = this.data.signing
                let result1 = result.splice(index,1)
                let time = Date.now()
                let createtime = Ctime.formatDate(time)
                let message = {
                    type:"签约提醒",
                    uid:this.data.lessee[index]._id,
                    createtime,
                    minfo:"您发起的签约已被拒绝，请确定原因后再发起签约。"
                }
                wx.cloud.callFunction({
                    name:"addMessage",
                    data:{
                        message
                    }
                })
                this.setData({
                    signing:result
                })
                wx.hideLoading()
            })
        })
    },
    onChange(e){
        this.setData({
            active:e.detail.index
        })
    },
    changeinfo(e){
        wx.navigateTo({
          url: '/pages/edithouse/edithouse?id='+e.currentTarget.dataset.id,
        })
    },
    delete(e){
        let that = this
        let id = e.currentTarget.dataset.id
        let sid = e.currentTarget.dataset.sid
        let index = e.currentTarget.dataset.index
        let house = {}
        wx.showModal({
          title:"提醒",
          content:"是否删除该房屋信息，连同删除合同",
          success(res){
              if(res.confirm){
                  wx.showLoading({
                    title: '加载中'
                  })
                  for(let i=0;i<that.data.nosign.length;i++){
                      if(id==that.data.nosign[i]._id){
                          house = that.data.nosign[i]
                      }
                  }
                  wx.cloud.callFunction({
                      name:"delHouseById",
                      data:{
                          id
                      }
                  }).then(res=>{
                      wx.cloud.deleteFile({
                          fileList:house.image
                      })
                  })
                  wx.cloud.callFunction({
                      name:"delSignById",
                      data:{
                          id:sid
                      }
                  }).then(res=>{
                    let result = that.data.nosign
                    let result1 = result.splice(index,1)
                    that.setData({
                        nosign:result
                    })
                    wx.hideLoading()
                  })
              }
          }
        })
    },  
    //查询用户所有房屋
    selHouseByUid(){
        let that = this
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
            let result = res.result.data
            let nosign = []
            let signing = []
            let sign = []
            for(let i=0;i<result.length;i++){
                if(res.result.data[i].issign==0){
                    nosign.push(res.result.data[i])
                }else if(res.result.data[i].issign==1){
                    signing.push(res.result.data[i])
                }else if(res.result.data[i].issign==2){
                    sign.push(res.result.data[i])
                }
            }
            that.setData({
                nosign,
                signing,
                sign,
                user
            })
            that.selHouseBySigned()
            that.selLesseeBySigning(signing)
            wx.hideLoading()
        })
    },
    //查询用户已签约的房屋
    selHouseBySigned(){
        for(let i=0;i<this.data.sign.length;i++){
            wx.cloud.callFunction({
                name:"selSignById",
                data:{
                    signid:this.data.sign[i].signid
                }
            }).then(res=>{
                wx.cloud.callFunction({
                    name:"selUserById",
                    data:{
                        id:res.result.data.lesseeid
                    }
                }).then(res=>{
                    this.setData({
                       [`lesseename[${i}]`]:res.result.data.name
                    })
                })
            })
        }
    },
    //查询用户待签约的房屋的承租方
    selLesseeBySigning(signing){
        for(let i=0;i<signing.length;i++){
            wx.cloud.callFunction({
                name:"selSigningByHid",
                data:{
                    id:signing[i]._id
                }
            }).then(res=>{
                wx.cloud.callFunction({
                    name:"selUserById",
                    data:{
                        id:res.result.data[0].lesseeid
                    }
                }).then(res=>{
                    this.setData({
                        [`lessee[${i}]`]:res.result.data
                    })
                })
            })
        }
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.selHouseByUid()
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