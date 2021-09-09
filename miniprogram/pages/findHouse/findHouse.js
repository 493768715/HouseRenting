// pages/findHouse/findHouse.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        location: ["未选择","荔湾区","海珠区","越秀区","天河区","白云区","黄埔区","番禺区","花都区","南沙区","从化区","增城区"],
        rentT:["未选择","单租","整租"],
        money:["未选择","1.5k↓","1.5k-3k","3k-4.5","4.5k-6k"],
        type:["未选择","一室一厅","两室一厅","一室两厅","两室两厅","三室两厅","其他"],
        Lindex: 0,
        Rindex: 0,
        Mindex: 0,
        Tindex: 0,
        Lstatus: 0,
        Rstatus: 0,
        Mstatus: 0,
        Tstatus: 0,
        searchfor:["","","",""], //条件筛选信息
        house:[], //房屋信息
    },
    bindRegionChange: function (e) {
        let that = this
        if(e.detail.value==0){
            this.setData({
                Lstatus: 0,
                'searchfor[0]':""
            })
        }else{
            this.setData({
                Lindex: e.detail.value,
                Lstatus: 1,
                'searchfor[0]':this.data.location[e.detail.value]
            })
        }
        wx.showLoading({
          title: '加载中'
        })
        wx.cloud.callFunction({
            name:"selHouseByCondition",
            data:{
                condition:this.data.searchfor
            }
        }).then(res=>{
            that.setData({
                house:res.result.data
            })
            wx.hideLoading()
        })
    },
    bindRentChange: function (e) {
        let that = this
        if(e.detail.value==0){
            this.setData({
                Rstatus: 0,
                'searchfor[1]':""
            })
        }else{
            this.setData({
                Rstatus: 1,
                Rindex:e.detail.value,
                'searchfor[1]':this.data.rentT[e.detail.value]
            })
        }
        wx.showLoading({
            title: '加载中'
          })
        wx.cloud.callFunction({
            name:"selHouseByCondition",
            data:{
                condition:this.data.searchfor
            }
        }).then(res=>{
            that.setData({
                house:res.result.data
            })
            wx.hideLoading()
        })
    },
    bindMoneyChange:function (e) {
        let that = this
        if(e.detail.value==0){
            this.setData({
                Mstatus: 0,
                'searchfor[2]':""
            })
        }else{
            this.setData({
                Mstatus: 1,
                Mindex:e.detail.value,
                'searchfor[2]':e.detail.value
            })
        }
        wx.showLoading({
            title: '加载中'
          })
        wx.cloud.callFunction({
            name:"selHouseByCondition",
            data:{
                condition:this.data.searchfor
            }
        }).then(res=>{
            that.setData({
                house:res.result.data
            })
            wx.hideLoading()
        })
    },
    bindTypeChange:function(e){
        let that = this
        if(e.detail.value==0){
            this.setData({
                Tstatus: 0,
                'searchfor[3]':""
            })
        }else{
            this.setData({
                Tstatus: 1,
                Tindex:e.detail.value,
                'searchfor[3]':this.data.type[e.detail.value]
            })
        }
        wx.showLoading({
            title: '加载中'
          })
        wx.cloud.callFunction({
            name:"selHouseByCondition",
            data:{
                condition:this.data.searchfor
            }
        }).then(res=>{
            that.setData({
                house:res.result.data
            })
            wx.hideLoading()
        })
    },
    getInfo(e){
        let that = this
        wx.showLoading({
          title: '加载中',
        })
        wx.cloud.callFunction({
            name:"search",
            data:{
                info:e.detail.value
            }
        }).then(res=>{
            that.setData({
                house:res.result.data
            })
            wx.hideLoading()
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let rtype = options.rtype
        let that = this;
        if(rtype==undefined){
            wx.cloud.callFunction({
                name:"selHouse",
                data:{
                    page:0
                }
            }).then(res=>{
                that.setData({
                    house:res.result.data
                })
            })
        }else{
            this.setData({
                Rstatus:1,
                Rindex:rtype,
                'searchfor[1]':this.data.rentT[rtype]
            })
            wx.cloud.callFunction({
                name:"selHouseByCondition",
                data:{
                    condition:this.data.searchfor
                }
            }).then(res=>{
                that.setData({
                    house:res.result.data
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
    onRefresh(){
        let page = this.data.house.length
      wx.cloud.callFunction({
        name:"selHouse",
            data:{
              page:page
            }
        }).then(res=>{
            if(res.result.data.length==0){
                return;
            }    
            let oldArr = this.data.house
            let newArr = oldArr.concat(res.result.data)
            this.setData({
                house:newArr
            })
        })
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
        this.onRefresh()
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})