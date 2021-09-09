// pages/bills/bills.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        act:0,
        order:[],
        ordered:[],
        overdue:[],
        orhouse:[],
        ordhouse:[],
        overhouse:[],
        user:{}
    },
    //支付
    pay(e){
        let id = e.currentTarget.dataset.id
        let index = e.currentTarget.dataset.index
        wx.showLoading({
            title: '支付中'
          })
        wx.cloud.callFunction({
            name:"updateOrderById",
            data:{
                id
            }
        }).then(res=>{
            let result = this.data.orhouse
            let result1 = result.splice(index,1)
            this.setData({
                orhouse:result,
                ordhouse:[...this.data.ordhouse,result1[0]],
                ordered:[...this.data.ordered,this.data.order[index]]
            })
            wx.hideLoading()
        })
    },
    //查找该用户的订单信息
    selOrderByUid(id){
        wx.showLoading({
            title: '加载中'
          })
        wx.cloud.callFunction({
            name:"selOrderByUid",
            data:{
                uid:id
            }
        }).then(res=>{
            for(let i=0;i<res.result.data.length;i++){
                if(res.result.data[i].ispay==0){
                    wx.cloud.callFunction({
                        name:"selHouseById",
                        data:{
                            id:res.result.data[i].hid
                        }
                    }).then(res1=>{
                        this.setData({
                            orhouse:[...this.data.orhouse,res1.result.data],
                            order:[...this.data.order,res.result.data[i]]
                        })
                    })
                }else if(res.result.data[i].ispay==1){
                    wx.cloud.callFunction({
                        name:"selHouseById",
                        data:{
                            id:res.result.data[i].hid
                        }
                    }).then(res1=>{
                        this.setData({
                            ordhouse:[...this.data.ordhouse,res1.result.data],
                            ordered:[...this.data.ordered,res.result.data[i]]
                        })
                    })
                }else if(res.result.data[i].ispay==2){
                    wx.cloud.callFunction({
                        name:"selHouseById",
                        data:{
                            id:res.result.data[i].hid
                        }
                    }).then(res1=>{
                        this.setData({
                            overhouse:[...this.data.overhouse,res.result.data],
                            overdue:[...this.data.overdue,res.result.data[i]]
                        })
                    })
                }
            }
            wx.hideLoading()
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let user = wx.getStorageSync('user')
        this.setData({
            user
        })
        this.selOrderByUid(user._id)
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