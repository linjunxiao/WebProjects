(function (window) {
    function Lyric (path) {
        return new Lyric.prototype.init(path)
    }
    Lyric.prototype = {
        constructor: Lyric,
        times: [],
        lyrics: [],
        index:-1,
        init: function (path) {
            this.path = path
        },
        //加载歌词
        loadLyric: function (callback) {
            var $this = this
            $.ajax({
                url: $this.path,
                dataType: "text",
                success: function (data) {
                    $this.parseLyric(data)
                    callback($this.lyrics)
                },
                error: function (e) {
                    console.log(e)
                }
            })
        },
        //解析歌词
        parseLyric: function (data) {
            var $this = this

            //清空上一首歌曲的歌词和时间
            $this.times = []
            $this.lyrics = []
            var array = data.split('\n')
            var timeRex = /\[(\d*:\d*\.\d*)\]/
            $.each(array, function (index, ele) {
                var res = timeRex.exec(ele)
                var lrc = ele.split("]")[1]

                //排除空字符串
                if (lrc == "") return true
                if (res == null) return true
                var timeStr = res[1]
                var res2 = timeStr.split(":")
                var sec = parseFloat((parseInt(res2[0]) * 60 + parseFloat(res2[1])).toFixed(2))
                $this.times.push(sec)
                $this.lyrics.push(lrc)
            })
            console.log($this.times)
            console.log($this.lyrics)
        },
        //获取索引的变化
        currentIndex: function (currentTime) {
            if (currentTime >= this.times[0]) {
                this.index++
                this.times.shift()//删除数组最前面的元素
            }
            return this.index
        }
    }
    Lyric.prototype.init.prototype = Lyric.prototype
    window.Lyric = Lyric
})(window)