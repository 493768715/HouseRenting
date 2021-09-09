Page({  

  /**
   * 页面的初始数据
   */
  data: {
    dataObj:"",
    result:[],
    new:[],
    active:0
  },
  onChange(e){
    this.setData({
      active:e.detail.index
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    wx.cloud.callFunction({
      name:"selHouse",
      data:{
        page:0
      }
    }).then(res=>{
      that.setData({
        result:res.result.data
      })
    }) 
    wx.cloud.callFunction({
      name:"selHouseByCT",
      data:{
        page:0
      }
    }).then(res=>{
      that.setData({
        new:res.result.data
      })
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
  onRefresh(){
    wx.showLoading({
      title: "加载中",
    })
    if(this.data.active==0){
      let page = this.data.result.length
      wx.cloud.callFunction({
        name:"selHouse",
        data:{
          page:page
        }
      }).then(res=>{
        if(res.result.data.length==0){
          wx.hideLoading()
          return;
        }
        let oldArr = this.data.result
        let newArr = oldArr.concat(res.result.data)
        this.setData({
          result:newArr
        })
        wx.hideLoading()
      })
    }else{
      let page = this.data.new.length
      wx.cloud.callFunction({
        name:"selHouseByCT",
        data:{
          page:page
        }
      }).then(res=>{
        if(res.result.data.length==0){
          wx.hideLoading()
          return;
        }
        let oldArr = this.data.new
        let newArr = oldArr.concat(res.result.data)
        this.setData({
          new:newArr
        })
        wx.hideLoading()
      })
    }
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