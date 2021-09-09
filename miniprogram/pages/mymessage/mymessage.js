// pages/mymessage/mymessage.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        active:0,
        message:[],
        Message:[]
    },
    //查找信息
    selMessageByUid(id){
        wx.showLoading({
            title: '加载中'
          })
        wx.cloud.callFunction({
            name:"selMessageByUid",
            data:{
                id
            }
        }).then(res=>{
            this.setData({
                message:res.result.data
            })
        })
        wx.cloud.callFunction({
            name:"selMessageByUid",
            data:{
                id:"0"
            }
        }).then(res=>{
            this.setData({
                Message:res.result.data
            })
            wx.hideLoading()
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let user = wx.getStorageSync('user')
        this.selMessageByUid(user._id)
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