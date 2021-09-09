// pages/edithouse/edithouse.js
import WxValidate from "../utils/WxValidate"
const Ctime = require("../utils/Ctime.js")
Page({

    /**
     * 页面的初始数据
     */
    data: {
        mo:["整租","单租"],
        type:["未选择","一室一厅","两室一厅","一室两厅","两室两厅","三室两厅","其他"],
        location: ["未选择","荔湾区","海珠区","越秀区","天河区","白云区","黄埔区","番禺区","花都区","南沙区","从化区","增城区"],
        mindex:-1, 
        tindex:0,
        lindex:0,
        rent:0,
        ImgUrls:[], //上传图片
        fileList:[],//预览图片
        house:{
            id:"",
            title:"",
            rent:0,
            floor:"",
            area:0,
            rtype:"",
            htype:"",
            region:"",
            address:[],
            facilities:[],
            desc:"",
            image:[]
        }
    },
    changeMode:function(e){
        if(e.detail.value==-1){
            this.setData({
                mindex:-1
            })
        }else{
            this.setData({
                mindex:e.detail.value
            })
        }
    },
    changeType:function(e){
        if(e.detail.value==0){
            this.setData({
                tindex:0
            })
        }else{
            this.setData({
                tindex:e.detail.value
            })
        }
    },
    changeLoc:function(e){
        if(e.detail.value==0){
            this.setData({
                lindex:0
            })
        }else{
            this.setData({
                lindex:e.detail.value
            })
        }
    },
    moveToLocation:function(e){
        let that = this;
        wx.chooseLocation({
            latitude:that.data.house.address[0],
            longitude:that.data.house.address[1],
            success:function(res){
                that.setData({
                    "house.address":[res.latitude,res.longitude,res.address]
                })
            },
            fail:function(err){
                console.log(err)
            }
        })
    },
    getRent(e){
        this.setData({
            rent:e.detail.value
        })
    },
    onChange:function(e){
        this.setData({
            result: e.detail,
        });
    },
    // 图片预览
    afterRead(event) {
         const { file } = event.detail; // 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
         this.setData({
           fileList:this.data.fileList.concat(file)
         })
    },
    // 删除图片
    delete(event) {
        let imgDelIndex = event.detail.index        
        let fileList = this.data.fileList        
        fileList.splice(imgDelIndex,1)        
        this.setData({
           fileList        
        })       
    },       
    // 上传图片  
    uploadImg(file){
     // 多张图片上传
        for(var i=0;i<file.length;i++){
            if(file[i].name==undefined){
                if(this.data.house.image[i]){
                    wx.cloud.deleteFile({
                        fileList:[this.data.house.image[i]],
                    })
                }
                let cloudPath = Date.now()
                wx.cloud.uploadFile({
                    cloudPath:"house/"+cloudPath+".jpg",  //文件名
                    filePath:file[i].url,
                })
                this.setData({
                    ImgUrls:this.data.ImgUrls.concat("cloud://xgj-yu-8gcmkkh897ae1354.7867-xgj-yu-8gcmkkh897ae1354-1305256125/house/"+cloudPath+".jpg")
                }) 
            }else{
                this.setData({
                    ImgUrls:this.data.ImgUrls.concat(file[i].url)
                })
            }
         }
    },
    //编辑协议
    wSign(e){
       wx.navigateTo({
         url: '/pages/editsign/editsign?sid='+this.data.house.signid+'&rent='+this.data.rent+'&address='+this.data.house.address[2]
       })
    },
    //保存
    formSub(e){
        let that = this
        let result = e.detail.value
        let rtype = ""
        let htype = ""
        let region = ""
        if(!this.WxValidate.checkForm(result)){
            const error = this.WxValidate.errorList[0]
            this.showModal(error)   
            return false
        }else{
            wx.showModal({
              title:"修改",
              content:"确认修改?",
              success(res){
                  wx.showLoading({
                    title: '加载中',
                  })
                  if(res.confirm){
                    if(result.rtype==""){
                        rtype = that.data.house.rtype
                    }else{
                        rtype = that.data.mo[result.rtype]
                    }
                    if(result.htype==""){
                        htype = that.data.house.htype
                    }else{
                        htype = that.data.type[result.htype]
                    }
                    if(result.region==""){
                        region = that.data.house.region
                    }else{
                        region = that.data.location[result.region]
                    }
                    that.uploadImg(that.data.fileList)  //上传图片
                    that.setData({
                        house:{
                            id:that.data.house.id,
                            title:result.title,
                            rent:result.rent,
                            floor:result.floor,
                            area:result.area,
                            rtype:rtype,
                            htype:htype,
                            region:region,
                            address:that.data.house.address,
                            facilities:result.facilities,
                            desc:result.desc,
                            image:that.data.ImgUrls
                        }
                    })
                    wx.cloud.callFunction({
                        name:"updateHouseById",
                        data:{
                            house:that.data.house
                        }
                    }).then(res=>{
                       that.addMessage() //增加信息
                        wx.showToast({
                          title: '修改成功',
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
                  }else if(res.cancel){
                    return;
                  }
              }
            })
        }
    },
    //向关注此房屋的用户发送信息
    addMessage(){
        let time = Date.now()
        let createtime = Ctime.formatDate(time)
        let name = this.data.house.title.slice(0,4)
        wx.cloud.callFunction({
            name:"selFoByTId",
            data:{
                houseid:this.data.house.id
            }
        }).then(res=>{
            for(let i=0;i<res.result.data.length;i++){
                let message = {
                    type:"关注提醒",
                    uid:res.result.data[i].uid,
                    createtime,
                    minfo:"您关注的房屋("+name+")信息有变动，请查看。"
                }
                wx.cloud.callFunction({
                    name:"addMessage",
                    data:{
                        message
                    }
                })
            }
        })
        
    },
    //查询房屋信息
    selHouseById(id){
        let that = this
        wx.showLoading({
            title: '加载中'
          })
        wx.cloud.callFunction({
            name:"selHouseById",
            data:{
                id
            }
        }).then(res=>{
            let result = res.result.data
            let mindex = that.data.mo.indexOf(result.rtype)
            let tindex = that.data.type.indexOf(result.htype)
            let lindex = that.data.location.indexOf(result.region)
            let fileList = []
            for(let i=0;i<result.image.length;i++){
                fileList[i] = {
                    name:i,
                    url:result.image[i]
                }
            }
            that.setData({
                mindex,
                tindex,
                lindex,
                fileList:fileList,
                house:{
                    id:result._id,
                    title:result.title,
                    rent:result.rent,
                    floor:result.floor,
                    area:result.area,
                    rtype:result.rtype,
                    htype:result.htype,
                    region:result.region,
                    address:result.address,
                    facilities:result.facilities,
                    signid:result.signid,
                    desc:result.desc,
                    image:result.image
                }
            })
            wx.hideLoading()
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let id = options.id
        this.initValidate()
        this.selHouseById(id)
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
        title:{
            required:true
        },
        rent:{
            required:true
        },
        floor:{
            required:true
        },
        area:{
            required:true
        },
        address:{
            required:true
        },
        facilities:{
            required:true
        },
        imgUrl:{
            required:true
        }
    }
    const messages ={
            title:{
                required:"请输入房屋标题"
            },
            imgUrl:{
                required:"请上传房屋图片"
            },
            rent:{
                required:"请输入房屋租金"
            },
            floor:{
                required:"请输入房屋所在楼层"
            },
            area:{
                required:"请输入房屋面积"
            },
            address:{
                required:"请选择房屋详细地址"
            },
            facilities:{
                required:"请选择房屋设施"
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