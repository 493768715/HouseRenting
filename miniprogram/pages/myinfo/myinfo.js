import WxValidate from "../utils/WxValidate"
Page({

    /**
     * 页面的初始数据
     */
    data: {
        sex:["男","女"],
        sindex:-1,
        user:{}
    },
    changeSex(e){
        this.setData({
            sindex:e.detail.value
        })
    },
    //提交用户信息
    subUser(e){
        let that = this
        if(!this.WxValidate.checkForm(e.detail.value)){
            const error = this.WxValidate.errorList[0]
            this.showModal(error)   
            return false
        }else{
            wx.showLoading({
                title: '加载中'
              })
            if(e.detail.value.sex==""){
                that.setData({
                    'user.sex':that.data.user.sex
                })
            }else if(e.detail.value.sex=="0"){
                that.setData({
                    'user.sex':"男"
                })
            }else if(e.detail.value.sex=="1"){
                that.setData({
                    'user.sex':"女"
                })
            }
            that.setData({
                user:{
                    _id:that.data.user._id,
                    name:e.detail.value.name,
                    image:that.data.user.image,
                    sex:that.data.user.sex,
                    phone:e.detail.value.phone,
                    wxid:e.detail.value.wxid,
                    desc:e.detail.value.desc
                }
            })
            wx.cloud.callFunction({
                name:"updataUser",
                data:{
                    user:that.data.user
                }
            }).then(res=>{
                wx.showToast({
                    title: '保存成功',
                    duration:2000,
                    success(res){
                        setTimeout(()=>{
                            wx.hideLoading()
                            wx.switchTab({
                                url:"../mine/mine"
                            })
                        },2000)
                    }
                })
            })
        }
    },
    //修改图片地址
    afterRead(e){
        this.setData({
            'user.image':e.detail.file.url
        })
    },
    //错误校验
    showModal(error) {
        wx.showModal({
          content: error.msg,
          showCancel: false,
        })
    },
    //规则函数
    initValidate(){
    const rules = {
        name:{
            required:true
        },
        phone:{
            required:true,
            tel:true
        },
        wxid:{
            required:true
        }
    }
    const messages ={
        name:{
            required:"请输入用户名"
        },
        phone:{
            required:"请输入手机号",
            tel:"请输入正确的手机号"
        },
        wxid:{
            required:"请输入微信号"
        }
    }
    this.WxValidate = new WxValidate(rules, messages)
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.initValidate()
        let user = wx.getStorageSync('user')
        let id = user._id
        wx.cloud.callFunction({
            name:"selUserById",
            data:{
                id:id
            }
        }).then(res=>{
            let index = this.data.sex.indexOf(res.result.data.sex)
            this.setData({
                user:res.result.data,
                sindex:index
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