// pages/play/index.js
// Page({

//   /**
//    * 页面的初始数据
//    */
//   data: {

//   },

//   /**
//    * 生命周期函数--监听页面加载
//    */
//   onLoad: function (options) {

//   },

//   /**
//    * 生命周期函数--监听页面初次渲染完成
//    */
//   onReady: function () {

//   },

//   /**
//    * 生命周期函数--监听页面显示
//    */
//   onShow: function () {

//   },

//   /**
//    * 生命周期函数--监听页面隐藏
//    */
//   onHide: function () {

//   },

//   /**
//    * 生命周期函数--监听页面卸载
//    */
//   onUnload: function () {

//   },

//   /**
//    * 页面相关事件处理函数--监听用户下拉动作
//    */
//   onPullDownRefresh: function () {

//   },

//   /**
//    * 页面上拉触底事件的处理函数
//    */
//   onReachBottom: function () {

//   },

//   /**
//    * 用户点击右上角分享
//    */
//   onShareAppMessage: function () {

//   }
// })

const app = getApp()

//InnerAudioContext实例
var audioCxt;
 
Page({
 
  /**
   * 页面的初始数据
   */
  data: {
    host: app.config.apiHost,
    //列表第几首歌
    key: null,
    //歌曲图片
    img : '',
    //歌曲名称
    audioAnimation : null,
    //音乐是不是开始
    music_on : true,
    //音乐是不是在播放
    music_playing :true,
    //显示的时间
    musicTime : '00:00',
    //音乐总时间
    musicAllTime : '00:00',
    //音乐进度
    sliderValue : 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    console.log(app.globalData.dataList[options.item]);
    var item = app.globalData.dataList[options.item];
    var self = this;

    audioCxt = wx.createInnerAudioContext();
    audioCxt.src = this.data.host + item.src;
    self.setData({
      key: options.item,
      audioAnimation: item.name + ' ' + item.author,
      img: item.img,
      musicAllTime: item.length,
      music_playing: false,
    })

    this.playMusic();
    this.bindTapPlay();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.bindTapPlay();
    //音乐播放结束触发
    audioCxt.onEnded((res) =>{
      //修改属性。去除css状态
      this.data.music_on = false;
      this.setData({
        music_on: this.data.music_on
      })
      //重新播放
      // audioCxt.seek(0);
      this.setData({
        musicTime: '00:00',
        sliderValue: 0
      })
      this.bindTapNext();
    }),
    //在播放状态，绑定播放进度更新事件。然后控制进度条和时间显示
    audioCxt.onPlay((res) =>{ 
      audioCxt.onTimeUpdate(this.timeUpdate)
    })
  },
 
  //播放按钮事件
  playMusic : function(){
    this.data.music_on = true; 
    this.data.music_playing = true;
    audioCxt.play();
    //图片添加css样式，旋转样式
    this.setData({
      music_on: this.data.music_on,
      music_playing: this.data.music_playing
    })
  },
 
  //暂停按钮事件
  pauseMusic : function(){
    this.data.music_on = true;
    this.data.music_playing = false;
    audioCxt.pause();
    this.setData({
      music_on: this.data.music_on,
      music_playing: this.data.music_playing
    })
  },
 
  //播放暂停变化按钮事件
  bindTapPlay : function(){
    // console.log('bindTapPlay')
    // console.log(this.data.music_playing)
    if (this.data.music_playing === true) {
      this.pauseMusic();
      this.setData({ music_playing: false })
    } else {
      this.playMusic();
      this.setData({ music_playing: true })
    }
  },

  //停止按钮事件
  stopMusic : function(){
    audioCxt.stop();
    this.data.music_on = false;
    this.data.music_playing = false;
    this.setData({
      music_on: this.data.music_on,
      music_playing: this.data.music_playing,
      musicTime: '00:00',
      sliderValue: 0,
    })
  },
 
  //进度条改变后触发事件
  audioChange : function(e){
    var length = audioCxt.duration;
    var percent = e.detail.value;
    //用进度条百分比 *　整个音乐长度
    var musicTime = Math.round(length/100*percent);
    audioCxt.seek(musicTime);
 
    //因为在拖动进度条时，去除了时间绑定，所以进度改变后重新绑定
    audioCxt.onTimeUpdate(this.timeUpdate);

    this.setData({
      musicTime: this.musicTimeFormat(musicTime)
    })
  },

  //进度条拖动过程中触发事件
  audioChanging : function(e){
    //因为在进度条拖动的时候，还会在timeUpdate里面修改进度条的value，倒置拖动受影响，所以当拖动的时候需要取消绑定
    audioCxt.offTimeUpdate();
 
    //拖动时修改时间显示
    var length = audioCxt.duration;
    var percent = e.detail.value;
    var musicTime = Math.round(length / 100 * percent);
    this.setData({
      musicTime: this.musicTimeFormat(musicTime)
    })
  },
 
  //将秒钟转化为mm：ss的时间格式
  musicTimeFormat : function(time){
    var second = Math.floor(time % 60);
    if(second<10){
      second = '0' + second;
    }
    var minute = Math.floor(time / 60);
    if (minute < 10) {
      minute = '0' + minute;
    }
    return minute + ':' + second;
  },
 
  //播放的时候，更新进度条和时间显示
  timeUpdate : function(){
    var time = audioCxt.currentTime;
    var percent = Math.round(time / audioCxt.duration * 100);
    this.setData({
      musicTime: this.musicTimeFormat(time),
      sliderValue: percent
    })
  },

  // 上一曲
  bindTapPrev : function(){

    var key = parseInt(this.data.key) - 1;

    if(app.globalData.dataList[key]){
      var item = app.globalData.dataList[key];
      var self = this;

      audioCxt.src = this.data.host + item.src;
      self.setData({
        key: key,
        audioAnimation: item.name + ' ' + item.author,
        img: item.img,
        musicAllTime: item.length,
      })

      this.playMusic();
      this.bindTapPlay();
      this.onReady();

    } else {
      wx.showToast({
        title: '没有歌曲了！',
        icon: 'none',
        duration: 2000
      })
    }
  },

  // 下一曲
  bindTapNext : function(){

    var key = parseInt(this.data.key) + 1;

    if (app.globalData.dataList[key]) {
      var item = app.globalData.dataList[key];
      var self = this;

      audioCxt.src = this.data.host + item.src;
      self.setData({
        key: key,
        audioAnimation: item.name + ' ' + item.author,
        img: item.img,
        musicAllTime: item.length,
      })

      this.playMusic();
      this.bindTapPlay();
      this.onReady();

    } else {
      wx.showToast({
        title: '没有歌曲了！',
        icon: 'none',
        duration: 2000
      })

      this.stopMusic();

    }
  }
})