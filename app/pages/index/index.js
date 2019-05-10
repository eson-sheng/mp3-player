//index.js
//获取应用实例
var app = getApp()
Page({
    data: {
        audioList: [],
        audioIndex: 0,
        pauseStatus: true,
        listShow: false,
        timer: '',
        currentPosition: 0,
        duration: 0,
        userID: null,
        host: app.config.apiHost
    },
    onLoad: function () {
        console.log('onLoad')
        console.log(this.data.audioList.length)
        this.login()
        //  获取本地存储存储audioIndex
        var audioIndexStorage = wx.getStorageSync('audioIndex')
        console.log(audioIndexStorage)
        if (audioIndexStorage) {
            this.setData({audioIndex: audioIndexStorage})
        }
    },
    onReady: function (e) {
        console.log('onReady')
        // 使用 wx.createAudioContext 获取 audio 上下文 context
        // this.audioCtx = wx.createAudioContext('audio')
    },
    bindSliderchange: function (e) {
        // clearInterval(this.data.timer)
        let value = e.detail.value
        let that = this
        console.log(e.detail.value)
        wx.getBackgroundAudioPlayerState({
            success: function (res) {
                console.log(res)
                let {status, duration} = res
                if (status === 1 || status === 0) {
                    that.setData({
                        sliderValue: value
                    })
                    wx.seekBackgroundAudio({
                        position: value * duration / 100,
                    })
                }
            }
        })
    },
    bindTapPrev: function () {
        console.log('bindTapNext')
        let length = this.data.audioList.length
        let audioIndexPrev = this.data.audioIndex
        let audioIndexNow = audioIndexPrev
        if (audioIndexPrev === 0) {
            audioIndexNow = length - 1
        } else {
            audioIndexNow = audioIndexPrev - 1
        }
        this.setData({
            audioIndex: audioIndexNow,
            sliderValue: 0,
            currentPosition: 0,
            duration: 0,
        })
        let that = this
        setTimeout(() => {
            if (that.data.pauseStatus === true) {
                that.play()
            }
        }, 1000)
        wx.setStorageSync('audioIndex', audioIndexNow)
    },
    bindTapNext: function () {
        console.log('bindTapNext')
        let length = this.data.audioList.length
        let audioIndexPrev = this.data.audioIndex
        let audioIndexNow = audioIndexPrev
        if (audioIndexPrev === length - 1) {
            audioIndexNow = 0
        } else {
            audioIndexNow = audioIndexPrev + 1
        }
        this.setData({
            audioIndex: audioIndexNow,
            sliderValue: 0,
            currentPosition: 0,
            duration: 0,
        })
        let that = this
        setTimeout(() => {
            if (that.data.pauseStatus === false) {
                that.play()
            }
        }, 1000)
        wx.setStorageSync('audioIndex', audioIndexNow)
    },
    bindTapPlay: function () {

        console.log('bindTapPlay')
        console.log(this.data.pauseStatus)

        var BackgroundAudioManager = wx.getBackgroundAudioManager()
        if (!BackgroundAudioManager.src) {
            this.play();
        }

        if (this.data.pauseStatus === true) {
            BackgroundAudioManager.play()
            this.setData({pauseStatus: false})
        } else {
            BackgroundAudioManager.pause()
            this.setData({pauseStatus: true})
        }

    },
    bindTapList: function (e) {
        console.log('bindTapList')
        console.log(e)
        this.setData({
            listShow: true
        })
    },
    bindTapChoose: function (e) {
        console.log('bindTapChoose')
        console.log(e)
        this.setData({
            audioIndex: parseInt(e.currentTarget.id, 10),
            listShow: false
        })
        let that = this
        setTimeout(() => {
            if (that.data.pauseStatus === false) {
                that.play()
            }
        }, 1000)
        wx.setStorageSync('audioIndex', parseInt(e.currentTarget.id, 10))
        this.play();
        this.setData({pauseStatus: false})
    },
    play() {
        let {audioList, audioIndex} = this.data

        wx.playBackgroundAudio({
            dataUrl: app.config.apiHost + audioList[audioIndex].src,
            title: audioList[audioIndex].name,
            coverImgUrl: app.config.apiHost + audioList[audioIndex].poster
        })

        let that = this
        let timer = setInterval(function () {
            that.setDuration(that)
        }, 1000)
        this.setData({timer: timer})
    },
    setDuration(that) {
        wx.getBackgroundAudioPlayerState({
            success: function (res) {
                // console.log(res)
                let {status, duration, currentPosition} = res
                if (status === 1 || status === 0) {
                    that.setData({
                        currentPosition: that.stotime(currentPosition),
                        duration: that.stotime(duration),
                        sliderValue: Math.floor(currentPosition * 100 / duration),
                    })
                }
            }
        })
    },
    stotime: function (s) {
        let t = '';
        if (s > -1) {
            // let hour = Math.floor(s / 3600);
            let min = Math.floor(s / 60) % 60;
            let sec = s % 60;
            // if (hour < 10) {
            //   t = '0' + hour + ":";
            // } else {
            //   t = hour + ":";
            // }

            if (min < 10) {
                t += "0";
            }
            t += parseInt(min) + ":";
            if (sec < 10) {
                t += "0";
            }
            t += parseInt(sec);
        }

        return t;
    },
    onShareAppMessage: function () {
        let that = this
        return {
            title: 'light轻音乐：' + that.data.audioList[that.data.audioIndex].name,
            success: function (res) {
                wx.showToast({
                    title: '分享成功',
                    icon: 'success',
                    duration: 2000
                })
            },
            fail: function (res) {
                wx.showToast({
                    title: '分享失败',
                    icon: 'cancel',
                    duration: 2000
                })
            }
        }
    },
    login: function () {
        var self = this;

        if (!app.globalData.userInfo) {
            wx.navigateTo({
                url: '/pages/login/index'
            })
        }

        wx.showLoading({
            title: '加载扫描目录中...',
            mask: true,
        })

        wx.login({
            success(res) {
                if (res.code) {
                    wx.request({
                        url: app.config.apiUrl + '/login',
                        data: {
                            code: res.code,
                            info: app.globalData.userInfo,
                        },
                        success(res) {
                            wx.hideLoading()
                            console.log(res);
                            // 返回uid进行设置
                            if (res.data.status) {
                                self.getList(res.data.data.uid)
                                self.setData({
                                    userID: res.data.data.uid,
                                })
                            }
                        }
                    })
                } else {
                    console.log('登录失败！' + res.errMsg)
                }
            }
        })

    },
    getList: function (id) {
        var self = this;
        var uid = id;
        wx.request({
            url: app.config.apiUrl + '/audio/' + uid,
            method: 'GET',
            data: {},
            success(res) {
                self.setData({
                    audioList: res.data.data,
                })
            }
        })
    }
})
