import WxValidate from "../utils/WxValidate"
Page({
    /**
     * 页面的初始数据
     */
    data: {
        address:"",
        rent:0,
        desc:"根据甲、乙双方在自愿、平个人房屋租赁协议等、互利的基础上，经协商一致，为明确双方之间的权利义务关系，就甲方将其合法拥有的房屋出租给乙方使用，乙方承租甲方房屋事宜，订立本合同。",
        convention:`    房屋终止，甲方验收无误后，将押金退还乙方，不计利息。
    租赁期满，甲方有权收回出租房屋，乙方应如期交还。乙方如要求续租，则必须在租赁期满前一个月内通知甲方，经甲方同意后，重新签订租赁合同。`,
        sublet:`    租赁期间，未经甲方书面同意，乙方不得擅自转租，转借承租房屋。
    甲方同意乙方转租房屋的，应当单独拟定补充协议，乙方应当依据与甲方的书面协议转租房屋。`,
        breach:`    在租赁期内，乙方有下列行为之一的，甲方有权终止合同，收回该房屋，乙方应向甲方支付合同总租金10%的违约金，若支付的违约金不足弥补甲方损失的，乙方还应负责赔偿直至达到弥补全部损失为止。
    1、未经甲方书面同意，擅自将房屋转租、转借给他人使用的；
    2、未经甲方同意，擅自拆改变动房屋结构或损坏房屋，且经甲方通知，在规定期限内仍未纠正并修复的；
    3、拖欠房租累计一个月以上的。`,
    user:{},
    sign:{
        lessorid:"",
        address:"",
        deadline:"",
        rent:0,
        deposit:0,
        convention:"",
        sublet:"",  
        breach:""
    }
    },
    signSub(e){
        let that = this
        const result = e.detail.value
        if(!this.WxValidate.checkForm(result)){
            const error = this.WxValidate.errorList[0]
            this.showModal(error)   
            return false
        }else{
            this.setData({
                sign:{
                    lessorid:this.data.user._id,
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
                name:"addSign",
                data:{
                    sign:that.data.sign
                },
                success(res){
                    wx.cloud.callFunction({
                        name:"selSignByAddress",
                        data:{
                            address:that.data.sign.address
                        }
                    }).then(res=>{
                        wx.showToast({
                            title: '保存成功',
                            duration:2000,
                            success(res1){
                              wx.setStorageSync('sign', res.result.data[0])
                              setTimeout(()=>{
                                  wx.navigateBack({
                                    delta: 0,
                                  })
                              },2000)
                            }
                          })
                    })
                }
            })
        }
        
    },
    
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.initValidate();
        let user = wx.getStorageSync('user')
        this.setData({
            user:user,
            address:options.address,
            rent:options.rent
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