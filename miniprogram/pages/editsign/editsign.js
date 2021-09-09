// pages/editsign/editsign.js
import WxValidate from "../utils/WxValidate"
Page({

    /**
     * 页面的初始数据
     */
    data: {
        desc:"根据甲、乙双方在自愿、平个人房屋租赁协议等、互利的基础上，经协商一致，为明确双方之间的权利义务关系，就甲方将其合法拥有的房屋出租给乙方使用，乙方承租甲方房屋事宜，订立本合同。",
        sign:{},//原来的内容
        rent:0,
        address:"",
        user:{},
        Sign:{}//提交 的内容
    },
    signSub(e){
        let result = e.detail.value
        if(!this.WxValidate.checkForm(result)){
            const error = this.WxValidate.errorList[0]
            this.showModal(error)   
            return false
        }else{
            wx.showLoading({
                title: '加载中'
                })
            this.setData({
                Sign:{
                    id:this.data.sign._id,
                    address:result.address,
                    deadline:result.deadline,
                    rent:result.rent,
                    deposit:result.deposit,
                    convention:result.convention,
                    sublet:result.sublet,
                    breach:result.breach
                }
            })
            wx.cloud.callFunction({
                name:"updateSignById",
                data:{
                    sign:this.data.Sign
                }
            }).then(res=>{
                wx.showToast({
                  title: '完成保存',
                  duration:1500,
                  success(res){
                      setTimeout(()=>{
                          wx.hideLoading()
                          wx.navigateBack({
                            delta: 0,
                          })
                      },1500)
                  }
                })
            })
        }
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
       let signid = options.sid
       let rent = options.rent
       let address = options.address
       let user = wx.getStorageSync('user')
       this.initValidate()
       wx.showLoading({
        title: '加载中'
      })
       wx.cloud.callFunction({
           name:"selSignById",
           data:{
             signid
           }
       }).then(res=>{
            if(rent==0){
                rent = res.result.data.rent
            }
            if(address==0){
                address = res.result.data.address
            }
            this.setData({
                sign:res.result.data,
                rent,
                address,
                user
            })
            wx.hideLoading()
       })
    },

    //错误校验
    showModal(error) {
        wx.showModal({
        content: error.msg,
        showCancel: false,
        })
    },
    initValidate(){
        const rules = {
            deadline:{
                required:true,
            },
            deposit:{
                required:true
            },
            convention:{
                required:true
            },
            sublet:{
                required:true
            },
            breach:{
                required:true
            }
        }
        const messages = {
            deadline:{
                required:"请输入期限"
            },
            deposit:{
                required:"请输入押金"
            },
            convention:{
                required:"请输入约定规则"
            },
            sublet:{
                required:"请输入转租规则"
            },
            breach:{
                required:"请输入违约规则"
            }
        }
        this.WxValidate = new WxValidate(rules, messages)
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