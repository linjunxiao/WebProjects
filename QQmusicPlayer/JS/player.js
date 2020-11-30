(function (window) {
    function Player ($audio) {
        return new Player.prototype.init($audio)
    }
    Player.prototype = {
        constructor: Player,
        musicList: [],
        init: function ($audio) {
            this.$audio = $audio
            this.audio = $audio.get(0)

        },
        currentIndex: -1,
        curMusicIndex: 0,
        //播放音乐
        playMusic: function (index, music) {
            //console.log(music)
            if (this.currentIndex == index) {
                if (this.audio.paused) {
                    this.audio.play()
                } else {
                    this.audio.pause()
                }
            } else {

                this.$audio.attr("src", music.link_url)
                this.audio.play()
                this.currentIndex = index
                this.curMusicIndex = index
            }
        },
        //上一首音乐
        preIndex: function () {
            var index = this.currentIndex - 1
            return index >= 0 ? index : this.musicList.length - 1
        },
        //下一首音乐
        nextIndex: function () {
            var index = this.currentIndex + 1
            return index <= this.musicList.length - 1 ? index : 0
        },
        //删除音乐
        changeMusic: function (index) {
            this.musicList.splice(index, 1)
            if (index < this.currentIndex) {
                this.currentIndex -= 1
            }
        },
        //获取总播放时间
        getMusicDuration: function () {
            return this.audio.duration
        },
        //获取当前音乐播放的时间
        getMusicCurrentTime: function () {
            return this.audio.currentTime
        },
        //监听音乐的时间变化
        musicTimeUpdate: function (callback) {
            var $this = this
            this.$audio.on("timeupdate", function () {
                var duration = $this.audio.duration
                var currentTime = $this.audio.currentTime
                var timeStr = $this.formatDate(currentTime, duration)
                if(isNaN(duration))return
                callback(currentTime,duration,timeStr)
            })
        },
        //控制时间的格式
        formatDate: function (currentTime, duration) {
            var endMin = parseInt(duration / 60)
            var endSec = parseInt(duration % 60)
            if (endMin < 10) {
                endMin = "0" + endMin
            }
            if (endSec < 10) {
                endSec = "0" + endSec
            }
            var curMin = parseInt(currentTime / 60)
            var curSec = parseInt(currentTime % 60)
            if (curMin < 10) {
                curMin = "0" + curMin
            }
            if (curSec < 10) {
                curSec = "0" + curSec
            }
            return curMin + ":" + curSec + " / " + endMin + ":" + endSec
           // return curMin + ":" + curSec + " / " + duration

        },
        //控制音乐跳转
        musicSeekTo: function (percent) {
           if(isNaN(percent)) return;
            // console.log(this.audio.duration*percent)
            this.audio.currentTime = this.audio.duration * percent
        },
        //控制声音变化
        musicVoiceSeekTo: function (value) {
           if (isNaN(value)) return;
            if(value <0 || value > 1) return;
            this.audio.volume = value
        }
    }
    Player.prototype.init.prototype = Player.prototype
    window.Player = Player
})(window)