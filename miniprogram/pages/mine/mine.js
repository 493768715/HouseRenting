// pages/mine/mine.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        Islogin:false,
        Issex:1,
        userinfo:{}
    },
    getlogin(e){
        let that = this
        let sex = ""
        wx.getUserProfile({
            desc:"用于登陆",
            success:function(res){
                if(res.userInfo.gender==1){
                        sex = "男"
                }else{
                        sex = "女"
                }
                wx.cloud.callFunction({
                    name:"selUserByName",
                    data:{
                        name:res.userInfo.nickName
                    }
                }).then(res1=>{
                    if(res1.result.data.length != 0){
                        if(res1.result.data[0].sex=="男"){
                           that.setData({
                               Issex:1
                           })
                        }else{
                            that.setData({
                                Issex:2
                            })
                        }
                        that.setData({
                            Islogin:true,
                            userinfo:{
                                name:res1.result.data[0].name,
                                image:res1.result.data[0].image,
                                desc:res1.result.data[0].desc,
                            }
                        })
                        wx.setStorageSync('user', res1.result.data[0])
                    }else{
                        wx.cloud.callFunction({
                            name:"addUser",
                            data:{
                                name:res.userInfo.nickName,
                                sex:sex,
                                image:res.userInfo.avatarUrl           
                            }
                        }).then(res2=>{
                            that.setData({
                                Islogin:true,
                                Issex:res.userInfo.gender,
                                userinfo:{
                                    name:res.userInfo.nickName,
                                    image:res.userInfo.avatarUrl,
                                    desc:"",
                                }
                            })
                            wx.cloud.callFunction({
                                name:"selUserByName",
                                data:{
                                    name:res.userInfo.nickName
                                }
                            }).then(res3=>{
                                wx.setStorageSync('user', res3.result.data[0])
                            })
                            
                        })
                    }
                })
               
            }
        })
    },
    
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let that = this
        let user = wx.getStorageSync("user")
        if(user==""||user=="undefined"){
            this.setData({
                Islogin:false
            }
        )}else{
            wx.cloud.callFunction({
                name:"selUserByName",
                data:{
                    name:user.name
                }
            }).then(res1=>{
                if(res1.result.data[0].sex=="男"){
                    that.setData({
                        Issex:1
                    })
                 }else{
                     that.setData({
                         Issex:2
                     })
                 }
                that.setData({
                    Islogin:true,
                    userinfo:{
                        name:res1.result.data[0].name,
                        image:res1.result.data[0].image,
                        desc:res1.result.data[0].desc,
                    }
                })
            })
           
        }
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