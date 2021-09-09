// pages/signdetail/signdetail.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        desc:"根据甲、乙双方在自愿、平个人房屋租赁协议等、互利的基础上，经协商一致，为明确双方之间的权利义务关系，就甲方将其合法拥有的房屋出租给乙方使用，乙方承租甲方房屋事宜，订立本合同。",
        sign:{},
        lessorname:"",
        lesseename:""
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let id = options.id
        let lessorname = options.lessorname
        let lesseename = options.lesseename
        wx.cloud.callFunction({
            name:"selSignById",
            data:{
                signid:id
            }
        }).then(res=>{
            if(lesseename==0){
                this.setData({
                    sign:res.result.data,
                    lessorname
                })
            }else{
                this.setData({
                    sign:res.result.data,
                    lessorname,
                    lesseename
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