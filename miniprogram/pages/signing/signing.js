// pages/signing/signing.js
const Ctime  = require("../utils/Ctime.js")
Page({

    /**
     * 页面的初始数据
     */
    data: {
        desc:"根据甲、乙双方在自愿、平个人房屋租赁协议等、互利的基础上，经协商一致，为明确双方之间的权利义务关系，就甲方将其合法拥有的房屋出租给乙方使用，乙方承租甲方房屋事宜，订立本合同。",
        sign:{
            lessorid:"",
            address:"",
            deadline:"",
            rent:0,
            deposit:0,
            convention:"",
            sublet:"",  
            breach:""
        },
        masterid:"",
        mastername:"",
        user:{},
        houseid:"",
        signing:{}
    },
    signSub(e){
        let that = this
        let datetime = Date.now();
        let createtime = Ctime.formatDate(datetime)
        wx.showLoading({
            title: '提交中'
          })
        this.setData({
            signing:{
                houseid:this.data.houseid,
                userid:this.data.user._id,
                masterid:this.data.masterid,
                createtime:createtime
            }
        })
        wx.cloud.callFunction({
            name:"updateIsSign",
            data:{
               houseid:that.data.houseid 
            }
        }).then(res=>{
            wx.cloud.callFunction({
                name:"addSigning",
                data:{
                    signing:that.data.signing
                }
            }).then(res=>{
                that.addMessage(createtime)
                wx.showToast({
                  title: '成功',
                  duration:1500,
                  success(res){
                      setTimeout(()=>{
                          wx.hideLoading()
                          wx.navigateBack({
                            delta: 2,
                          })
                      },1500)
                  }
                })
            })
        })
    },
    //向房东发送签约消息
    //向关注此房屋的用户发送信息
    addMessage(createtime){
        let message = {
            type:"签约提醒",
            uid:this.data.masterid,
            createtime,
            minfo:"用户"+this.data.user.name+"向您的房屋发起签约，请到我的房源中确定。"
        }
        wx.cloud.callFunction({
            name:"addMessage",
            data:{
                message
            }
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let masterid = options.masterid
        let mastername = options.mastername
        let houseid = options.houseid
        let signid = options.signid
        let user = wx.getStorageSync('user')
        wx.showLoading({
            title: '加载中'
          })
        wx.cloud.callFunction({
            name:"selSignById",
            data:{
                signid:signid
            }
        }).then(res=>{
            this.setData({
                masterid:masterid,
                mastername:mastername,
                user:user,
                sign:res.result.data,
                houseid:houseid
            })
            wx.hideLoading()
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