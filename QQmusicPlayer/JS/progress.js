(function (window) {
    function Progress ($progressBar, $progressLine, $progressDot) {
        return new Progress.prototype.init($progressBar, $progressLine, $progressDot)
    }
    Progress.prototype = {
        constructor: Progress,
        isMove: false,
        init: function ($progressBar, $progressLine, $progressDot) {
            this.$progressBar = $progressBar
            this.$progressLine = $progressLine
            this.$progressDot = $progressDot
        },
        //进度条点击
        progressClick: function (callback) {
            var $this = this    //这个this是progress
            this.$progressBar.click(function (event) {
                //获取背景距离窗口的位置
                var normalLeft = $(this).offset().left
                // console.log(normalLeft)
                //获取点击的位置距离窗口的位置
                var eventLeft = event.pageX
                // console.log(eventLeft)
                $this.$progressLine.css("width", eventLeft - normalLeft)
                $this.$progressDot.css("left", eventLeft - normalLeft)
                var percent = (eventLeft - normalLeft) / $(this).width()
                callback(percent)
            })
        },
        //进度条移动
        progressMove: function (callback) {
            //监听鼠标按下事件
            var $this = this
            var eventLeft
            var normalLeft = this.$progressBar.offset().left
            this.$progressBar.mousedown(function () {
                $this.isMove = true
                //监听鼠标的移动事件
                $(document).mousemove(function (event) {
                    eventLeft = event.pageX
                    var dis = eventLeft - normalLeft
                    if (dis < 0) dis = 0
                    if (dis > $this.$progressBar.width()) dis = $this.$progressBar.width()
                    $this.$progressLine.css("width", dis)
                    $this.$progressDot.css("left", dis)

                })
            })
            $(document).mouseup(function () {
                $(document).off("mousemove")
                $this.isMove = false
                var percent = (eventLeft-normalLeft) / $this.$progressBar.width()
                callback(percent)
            })
        },
        //重新设置进度条
        setProgress: function (percent) {
            if (this.isMove) return
            if (percent < 0 || percent > 100) return
            this.$progressLine.css({
                "width": percent + "%"
            })
            this.$progressDot.css({
                "left": percent + "%"
            })
        }
    }
    Progress.prototype.init.prototype = Progress.prototype
    window.Progress = Progress
})(window)