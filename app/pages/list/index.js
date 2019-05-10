// pages/list/index.js
const app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    dataList:[],
    host: app.config.apiHost,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getDataList(options);
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

  },

  toDetail: function(e) {
    var index = e.currentTarget.dataset.item;
    // console.log(index);
    wx.navigateTo({
      url: '/pages/play/index?item=' + index,
    })
  },

  getDataList: function (options){
    var self = this;
    var uid = options.uid;
    wx.request({
      url: app.config.apiUrl + '/audio/' + uid,
      method: 'GET',
      data: {},
      success(res) {
        // console.log(res.data.data)
        self.setData({
          dataList: res.data.data,
        })
        app.globalData.dataList = res.data.data
      }
    })
  }
})