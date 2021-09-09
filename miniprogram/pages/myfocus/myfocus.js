// pages/myfocus/myfocus.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        focus:[],
        user:{}
    },
    deleteFocus(e){
        let hid = e.currentTarget.dataset.id
        let uid = this.data.user._id
        let that = this
        wx.showModal({
          title:"提示",
          content:"确认取消关注？",
          success(res){
            if(res.confirm){
                wx.showLoading({
                    title: '加载中'
                  })
                wx.cloud.callFunction({
                    name:"delFoByTId",
                    data:{
                        houseid:hid,
                        uid:uid
                    }
                }).then(res=>{
                    that.selFo(uid)
                    wx.hideLoading()
                })
            }
          }
        })
    },
    selFo(id){
        let that = this
        let house = []
        wx.showLoading({
            title: '加载中'
          })
        wx.cloud.callFunction({
            name:"selFoById",
            data:{
                uid:id
            }
        }).then(res=>{
            for(let i=0;i<res.result.data.length;i++){
                wx.cloud.callFunction({
                    name:"selHouseById",
                    data:{
                        id:res.result.data[i].hid
                    }
                }).then(res1=>{
                    house.push(res1.result.data)
                    if(house.length==res.result.data.length){
                        that.setData({
                            focus:house
                        })
                        wx.hideLoading()
                    }
                })
            }
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let user = wx.getStorageSync('user')
        let id = user._id
        this.setData({
            user:user
        })
        this.selFo(id)
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