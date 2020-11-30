//  import 'jQuery'
$(function () {
    $(".musicList").mCustomScrollbar()
    var $audio = $("audio")
    var player = new Player($audio)
    var $progressBar = $(".progress_bar")
    var $progressLine = $(".progress_line")
    var $progressDot = $(".progress_dot")
    var progress = new Progress($progressBar, $progressLine, $progressDot)
    var lyric

    //进度条点击事件监听
    progress.progressClick(function (percent) {
        //进度条点击后对应的播放器时间也应该发生变化
        player.musicSeekTo(percent)
        // console.log(player.audio.currentTime)
    })
    
    //进度条拖动事件监听
    progress.progressMove(function (percent) {
        player.musicSeekTo(percent)
    })

    function initEvents () {

        //给.msc标签绑定hover事件 
        $(".musicList").on("mouseenter", ".msc", function () {
            $(this).find(".list_menu").stop().fadeIn(10)
            $(this).find(".length").find("div").stop().fadeIn(10)
            $(this).find(".length span").stop().fadeOut(10)
        })
        $(".musicList").on("mouseleave", ".msc", function () {
            $(this).find(".list_menu").stop(true).fadeOut(10)
            $(this).find(".length").find("div").stop(true).fadeOut(10)
            $(this).find(".length span").stop(true).fadeIn(10)
        })

        //给checkbox绑定click事件,这里用的是事件委托,因为是动态创建的
        $(".musicList").on("click", ".list_check", function () {
            $(this).toggleClass("list_checked")
            if ($(this).attr("class").indexOf("list_checked") != -1) {
                $(this).css("opacity", "1")
            } else {
                $(this).css("opacity", "0.5")
            }

        })

        //切换子菜单播放按钮
        $(".musicList").on("click", ".msc_play", function () {
            var musicPlay = $(".play")
            var fa = $(this).parents(".msc")
            $(this).toggleClass("msc_play2")
            fa.siblings().find(".msc_play").removeClass("msc_play2")
            if ($(this).attr("class").indexOf("msc_play2") != -1) {
                musicPlay.addClass("play2")
                fa.find("div").css("color", "#fff")
                fa.siblings().find("div").css("color", "rgba(255,255,255,0.5)")
            } else {
                musicPlay.removeClass("play2")
                fa.find("div").css("color", "rgba(255,255,255,0.5)")
            }
            fa.find(".id").toggleClass("id2")
            fa.siblings().find(".id").removeClass("id2")

            //播放音乐 
            player.playMusic(fa.get(0).index, fa.get(0).music)

            //切换播放歌曲的信息
            initMusicInfo(fa.get(0).music)
            initLyric(fa.get(0).music)
        })

        //切换底部控制播放按钮
        $(".play").click(function () {
            if (player.currentIndex == -1) {
                // 没有播放过音乐
                $(".msc").eq(0).find(".msc_play").trigger("click")
            } else {
                // 已经播放过音乐
                $(".msc").eq(player.currentIndex).find(".msc_play").trigger("click")
            }
        })
        $(".pre").click(function () {
            $(".msc").eq(player.preIndex()).find(".msc_play").trigger("click")
        })
        $(".next").click(function () {
            $(".msc").eq(player.nextIndex()).find(".msc_play").trigger("click")
        })

        //删除按钮的监听
        $(".musicList").on("click", ".msc_delete", function () {
            var $item = $(this).parents(".msc")
            if ($item.get(0).index == player.currentIndex) {
                $(".next").trigger("click")
            }
            $item.remove()
            player.changeMusic($item.get(0).index)

            //重新排序
            $(".msc").each(function (index, ele) {
                ele.index = index
                $(ele).find(".id").text(index + 1)
            })
        })

        //监听播放的进度
        player.musicTimeUpdate(function (currentTime, duration, timeStr) {
            //同步时间
            $(".footer .timeInfo").text(timeStr)

            //计算播放比例同步进度条
            var percent = currentTime / duration * 100
            progress.setProgress(percent)
            if (percent >= 100) {
                $(".msc").eq(player.nextIndex()).find(".msc_play").trigger("click")
            }

            //实现歌词的同步
            var index = lyric.currentIndex(currentTime)
            var $item = $(".song_lyric li").eq(index)
            $item.addClass("cur")   
            $item.siblings().removeClass("cur")

            if (index >= 2) {
                $(".song_lyric").css({
                    "marginTop": (-index + 2) * 30
                })
            }
        })

        //监听声音按钮的切换
        $(".music_voice_icon").click(function () {
            $(this).toggleClass("music_voice_icon2")
            if ($(this).attr("class").indexOf("music_voice_icon2") != -1) {
                //变为没有声音
                player.musicVoiceSeekTo(0)
            } else {
                // 变为有声音
                player.musicVoiceSeekTo(1)
            }
        })
    }

    initEvents()

    function getPlayerList () {
        $.ajax({
            url: "../source/musiclist.json",
            dataType: "json",
            success: function (data) {
                player.musicList = data
                var musicList = $(".mCSB_container")
                $.each(data, function (index, ele) {
                    var $item = createMusicItem(index, ele)
                    musicList.append($item)
                })
                initMusicInfo(data[0])
                initLyric(data[0])
            },
            error: function (e) {
                console.log(e)
            }
        })
    }
    function createMusicItem (index, music) {
        var item = $(` 
                    <li class="msc">
                        <i class="list_check"></i>
                        <div class="id">`+ (index + 1) + `</div>
                        <div class="song-name">
                            <span>`+ music.name + `</span>
                            <div class="list_menu">
                                <div title="播放" class="msc_play"></div>
                                <div title="添加" class="msc_add"></div>
                                <div title="下载" class="msc_download"></div>
                                <div title="分享" class="msc_share"></div>
                            </div>
                        </div>
                        <div class="singer">`+ music.singer + `</div>
                        <div class="length">
                            <span>`+ music.time + `</span>
                            <div title="删除" class="msc_delete"></div>
                        </div>
                    </li>
            `)
        item.get(0).index = index
        item.get(0).music = music
        return item
    }
    //初始化歌曲信息
    function initMusicInfo (music) {
        //获取对应的信息
        var $songName = $(".song-name a")
        var $singerName = $(".singer-name a")
        var $albumName = $(".album-name a")
        var $songInfo = $(".footer .songInfo")
        var $timeInfo = $(".footer .timeInfo")
        var $pic = $(".song-pic img")
        var $maskBg = $(".mask_bg")

        //给获取到的信息赋值
        $songName.text(music.name)
        $singerName.text(music.singer)
        $albumName.text(music.album)
        $songInfo.text(music.name + "/" + music.singer)
        $timeInfo.text("00:00 / " + music.time)
        $pic.attr("src", music.cover)
        $maskBg.css({
            "background": "url(" + music.cover + ")" + " no-repeat 0 0",
            "background-size": "cover"
        })

    }
    //初始化歌词信息
    function initLyric (music) {
        lyric = new Lyric(music.link_lrc)
        var $lyricContainer = $(".song_lyric")

        //清空上一首音乐的信息
        $lyricContainer.html("")
        lyric.loadLyric(function () {
            $.each(lyric.lyrics, function (index, ele) {
                var $item = `
                    <li>`+ ele + `</li>
                `
                $lyricContainer.append($item)
            })
        })
    }
    getPlayerList()

})