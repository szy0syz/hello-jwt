# hello-jwt

> 使用JWT小demo

## 在http中使用jwt

流程(文字版):

* 分别引入http、jsonwebtoken、bcrypt(C++底层实现密码相关辅助)
* 引入数据库的CURD
* 声明一个签名，很重要jwt里必须要用
* 函数式编程readBody，主要操作对象是http里的req，返回一个Prmoise(为了方便)。监听`data`和`end`事件并最终返回post的json数据
* 创建token函数，jwt相关api操作即可
* postTokens控制器函数，进函数就先用readBody读req的post数据，在解构出email和password，在业务逻辑操作，用bcrypt异步比较密码，密码ok就方法token
* privatePage控制器函数，进函数就先从req的header取出token，用`jwt.verify()`API检查，只有正确时才返回payload，除此情况外都抛异常，必须在catch里操作业务，或者提前判断返回
* 配置一个简单对象路由
* 开启http服务