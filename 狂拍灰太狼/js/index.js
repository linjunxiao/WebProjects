$(function () {
    $('img').on('mousedown', function (e) {
        e.preventDefault();
    });
    $("ul").width(1080 * $("img").length);
    var timer;
    var score = 0;
    var psArr = [
        { "top": 160, "left": 18 },
        { "top": 112, "left": 96 },
        { "top": 140, "left": 185 },
        { "top": 190, "left": 100 },
        { "top": 218, "left": 18 },
        { "top": 290, "left": 28 },
        { "top": 270, "left": 120 },
        { "top": 208, "left": 200 },
        { "top": 293, "left": 205 },
    ];

    $($("input")[0]).click(function () {
        $(this).stop().fadeOut(100);
        progressHandler();
        start_();
    });


    // 进度条变换函数
    function progressHandler () {
        $(".time").css("width", "181");
        var timer2 = setInterval(function () {
            var newW = $(".time").width() - 1;
            $(".time").css("width", newW);
            if (newW <= 0) {
                clearInterval(timer2);
                end_();
                $(".gameover").stop().fadeIn(1000);
            }
        }, 100)
    };

    //重新开始
    $(".reb").click(function () {
        $(".gameover").stop().fadeOut(10);
        progressHandler();
        start_();
    })
    // $($("input")[1]).click(function () {
    //     $("ul")[0].style.left = "108px";
    //     flag = 0;
    //     clearInterval(timer);
    // })

    //点击游戏规则,出现规则
    $(".rules").click(function () {
        $(".rule").fadeIn(1000);
    })

    //点击规则规则框消失
    $(".rule").click(function () {
        $(this).fadeOut(1000);
    })

    //变换div位置和img内容的函数
    function changePos () {
        clearInterval(timer);
        var cnt = Math.floor(Math.random() * 9);
        var newPos = psArr[cnt];
        var wolfType = Math.round(Math.random()) == 0 ? "../img/redWolf.png" : "../img/grayWolf.png";
        $("img").attr("src", wolfType);
        $(".wolf").css({
            "top": newPos.top,
            "left": newPos.left
        });
    }

    //游戏规则
    function gameRules ($now) {
        $now.one("click", function () {
            clearInterval(timer);
            score += ($("img").attr("src") == "../img/redWolf.png" ? -10 : 5);
            $(".score").text(score);
            var l = -648; var speed = -108;
            var target1 = -1080; var target2 = 108;
            changePic(l, speed, target1, target2);
        })
    }


    //切换图片的函数
    function changePic (l, speed, target1, target2) {
        clearInterval(timer);
        timer = setInterval(function () {
            l += speed;
            if (l <= target1) {
                speed *= -1;
            } else if (l >= target2) {
                clearInterval(timer);
                changePos();
                start_();
            }
            $("ul")[0].style.left = l + "px";
        }, 100)
    }

    //开始函数
    function start_ () {
        // clearInterval(timer)
        var l = 0; var speed = -108;
        var target1 = -540; var target2 = 108;
        changePic(l, speed, target1, target2);
        gameRules($(".wolf"));
    }

    //结束函数
    function end_ () {
        clearInterval(timer);
        $("ul")[0].style.left = "108px";
    }
});