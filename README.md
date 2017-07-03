# nodeweb

采用webpack2+nodejs(koa2)+mysql搭建的基础web服务器框架

## 文件夹及其作用

1. server => 服务端代码
  - controllers => 控制层代码
  - lib => 必须的服务端代码库
  - middlewares => koa2中间件
  - services => 页面所需的api操作接口

2. scripts => 脚本文件

3. logs => 日志文件

4. config => webpack等全局配置文件

5. mock => mock数据文件

6. app => 前端文件

7. build => webpack打包后的文件