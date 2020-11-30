# QQ音乐播放器BUG

1.当未点击播放按钮时直接拖动进度条,会报错,原因是

![image-20201129170622055](C:\Users\pc\AppData\Roaming\Typora\typora-user-images\image-20201129170622055.png)

考虑初始化问题

2.当拖动进度条后在页面中点击鼠标会发生进度条回退,原因暂未查明

3.

一开始加载的时候结束时间显示为NaN:NaN

![image-20201129170946241](C:\Users\pc\AppData\Roaming\Typora\typora-user-images\image-20201129170946241.png)

原因:可能是因为duration未加载出来之类的问题

解决方案

![image-20201129171037169](C:\Users\pc\AppData\Roaming\Typora\typora-user-images\image-20201129171037169.png)

判定duration是否为NaN,若为NaN,则不执行回调函数

4.

![image-20201129171702810](C:\Users\pc\AppData\Roaming\Typora\typora-user-images\image-20201129171702810.png)

原因暂未查明

5.拖动进度条歌词无法同步,暂停歌词会回到最初

原因:

![image-20201130133229255](C:\Users\pc\AppData\Roaming\Typora\typora-user-images\image-20201130133229255.png)

这个函数应该不能这样单纯的判断

具体的解决思路还未得出

# QQ音乐播放器未完成功能

1.随机播放、循环播放等功能的实现

2.声音进度条与播放器声音的同步

3.一些收藏等功能的切换效果