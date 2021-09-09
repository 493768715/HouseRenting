// pages/detail/detail.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        iscl:0,
        islo:0,
        markers:[{
            //标记点 id
               id: 1,
               //标记点纬度
               latitude: 23,
               //标记点经度
               longitude:103,
               name: '当前的位置'
        }],
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
        fac:[],
        detail:{},
        user:{},
        User:{}
    },
    changeimgbyc(e){
        let that = this
        if(this.data.iscl==0){//wei选中
            this.setData({
                iscl:1
            })
            wx.cloud.callFunction({
                name:"addHouseToCol",
                data:{
                    houseid:that.data.detail._id,
                    uid:that.data.User._id
                }
            })
        }else{//取消
            this.setData({
                iscl:0
            })
            wx.cloud.callFunction({
                name:"delColByTId",
                data:{
                    houseid:that.data.detail._id,
                    uid:that.data.User._id
                }
            })
        }
    },
    changeImgByL(e){
        let that = this
        if(this.data.islo==0){
            this.setData({
                islo:1
            })
            wx.cloud.callFunction({
                name:"addHouseToFo",
                data:{
                    houseid:that.data.detail._id,
                    uid:that.data.User._id
                }
            })
        }else{
            this.setData({
                islo:0
            })
            wx.cloud.callFunction({
                name:"delFoByTId",
                data:{
                    houseid:that.data.detail._id,
                    uid:that.data.User._id
                }
            })
        }
    },
    //判断是否关注
    isFocus(hid,uid){
        let that = this
        wx.cloud.callFunction({
            name:"selFoByTId",
            data:{
                houseid:hid,
                uid:uid
            }
        }).then(res=>{
            if(res.result.data.length!=0){
                that.setData({
                    islo:1
                })
            }else{
                that.setData({
                    islo:0
                })
            }
        })
    },
    //判断是否收藏
    isCollection(hid,uid){
        let that = this
        wx.cloud.callFunction({
            name:"selColByTId",
            data:{
                houseid:hid,
                uid:uid
            }
        }).then(res=>{
            if(res.result.data.length!=0){
                that.setData({
                    iscl:1
                })
            }else{
                that.setData({
                    iscl:0
                })
            }
        })
    },
    //预览图片
    preview(e){
        let currentUrl = e.currentTarget.dataset.url
        wx.previewImage({
            current: currentUrl, // 当前显示图片的http链接
            urls: this.data.detail.image // 需要预览的图片http链接列表
          }) 
    },
    onClickButton(){
        if(this.data.User._id==this.data.user.id){
            wx.showToast({
              title: '无法签约自己',
              icon:'error',
              duration:1500
            })
            return;
        }else{
            wx.navigateTo({
                url: '../signing/signing?masterid='+this.data.user.id+"&mastername="+this.data.user.name+"&houseid="+this.data.detail._id+"&signid="+this.data.detail.signid
            })
        }
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let that = this
        let arr = []
        let id = options.id
        let User = wx.getStorageSync('user')
        this.setData({
            User:User
        })
        wx.showLoading({
            title: '加载中'
          })
        wx.cloud.callFunction({
            name:"selHouseById",
            data:{
                id:id
            }
        }).then(res=>{
            for(let j=0;j<that.data.facilities.length;j++){
                for(let i=0;i<res.result.data.facilities.length;i++){
                    if(that.data.facilities[j].name==res.result.data.facilities[i]){
                        arr.push(that.data.facilities[j])
                    }
                }
            }
            that.isCollection(res.result.data._id,User._id)
            that.isFocus(res.result.data._id,User._id)
            that.setData({
                detail:res.result.data,
                fac:arr,
                markers:[{
                    id:1,
                    latitude:res.result.data.address[0],
                    longitude:res.result.data.address[1],
                    name:"当前位置"
                }]
            })
            wx.cloud.callFunction({
                name:"selUserById",
                data:{
                    id:res.result.data.uid
                }
            }).then(res1=>{
                that.setData({
                    user:{
                        id:res1.result.data._id,
                        name:res1.result.data.name,
                        image:res1.result.data.image,
                        phone:res1.result.data.phone,
                        wxid:res1.result.data.wxid
                    }
                })
                wx.hideLoading()
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