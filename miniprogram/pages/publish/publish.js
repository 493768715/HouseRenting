const Ctime  = require("../utils/Ctime.js")
import WxValidate from "../utils/WxValidate"
Page({
    /**
     * 页面的初始数据
     */
    data: {
        user:{}, //用户信息
        result:[], //复选框结果
        mo:["整租","单租"],
        type:["未选择","一室一厅","两室一厅","三室一厅","一室两厅","两室两厅","三室两厅","其他"],
        location: ["未选择","荔湾区","海珠区","越秀区","天河区","白云区","黄埔区","番禺区","花都区","南沙区","从化区","增城区"],
        mindex:-1, 
        tindex:0,
        lindex:0,
        rent:0,//租金
        latitude:0, //地图初次加载时的纬度坐标
        longitude: 0, //经度
        address:"", //地图名字
        fileList:[],//预览图片
        ImgUrls:[], //上传图片
        istrue:true,
        facilities:[{
            name:"freezer",
            Name:"冰箱"
        },{
            name:"air-coditionor",
            Name:"空调"
        },{
            name:"elevator",
            Name:"电梯"
        },{
            name:"gallery",
            Name:"阳台"
        },{
            name:"wardrobe",
            Name:"衣柜"
        },{
            name:"washer",
            Name:"洗衣机"
        },{
            name:"water-heater",
            Name:"热水器"
        },{
            name:"washroom",
            Name:"独卫"
        },{
            name:"WIFI",
            Name:"无线网"
        }],
        Signid:"",
        house:{
            title:"",
            image:[],
            rent:0,
            floor:"",
            area:0,
            htype:"",
            rtype:"",
            region:"",
            address:[],
            facilities:[],
            desc:"",
            createtime:"",
            uid:"",
            signid:"",
            isaudit:0
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
            success:function(res){
                that.setData({
                    address:res.address,
                    latitude:res.latitude,
                    longitude:res.longitude
                })
            },
            fail:function(err){
                console.log(err)
            }
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
           fileList:file
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
            let cloudPath = Date.now();
             wx.cloud.uploadFile({
                cloudPath:"house/"+cloudPath+".jpg",  //文件名
                filePath:file[i].url,
            })
            this.setData({
                ImgUrls:this.data.ImgUrls.concat("cloud://xgj-yu-8gcmkkh897ae1354.7867-xgj-yu-8gcmkkh897ae1354-1305256125/house/"+cloudPath+".jpg")
            }) 
           
        }
    },
    getRent(e){
        this.setData({
            rent:e.detail.value
        })
    },
    //拟定协议
    wSign(e){
        this.setData({
            istrue:false
        })
        wx.navigateTo({
            url:"/pages/sign/sign?address="+this.data.address+"&rent="+this.data.rent
        })
    },
    //提交表单
    formSub(e){
        let that = this;
        let result = e.detail.value
        if(!this.WxValidate.checkForm(result)){
            const error = this.WxValidate.errorList[0]
            this.showModal(error)   
            return false
        }else{
            this.uploadImg(that.data.fileList)
            let time = Date.now()
            let createtime = Ctime.formatDate(time)
            let sign =  wx.getStorageSync('sign')
            this.setData({
                house:{
                    title:result.title,
                    image:that.data.ImgUrls,
                    rent:result.rent,
                    floor:result.floor,
                    area:result.area,
                    rtype:that.data.mo[result.rtype],
                    htype:that.data.type[result.htype],
                    region:that.data.location[result.region],
                    address:[that.data.latitude,that.data.longitude,result.address],
                    facilities:result.facilities,
                    desc:result.desc,
                    createtime:createtime,
                    uid:that.data.user._id,
                    signid:sign._id,
                    isaudit:0,
                    issign:0
                }
            })
            wx.showLoading({
              title: '加载中',
            })
            wx.cloud.callFunction({
                name:"addHouse",
                data:{
                    house:that.data.house
                },success(res){
                    wx.showToast({
                    title: '提交成功',
                    duration:2000,
                    success(res){
                        setTimeout(()=>{
                            wx.hideLoading()
                            wx.switchTab({
                                url: '/pages/index/index',
                            })
                        },2000)
                    }
                    })
                }
            })
        }
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
            rtype:{
                required:true
            },
            htype:{
                required:true
            },
            region:{
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
                rtype:{
                    required:"请选择租房方式"
                },
                htype:{
                    required:"请选择房屋类型"
                },
                region:{
                    required:"请选择房屋所在区域"
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
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.initValidate();
        let user = wx.getStorageSync('user')
        let that = this
        that.setData({
            user:user
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