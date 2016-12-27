# gulp 项目模板
***
[TOC]

## 说明


### gulp功能
+ 自动编译sass
+ css自动加前缀+压缩
+ 合并js
+ 压缩js
+ 压缩图片
+ html include
+ js 错误监查

### 目录
**bootstrap:**依赖bootstrap的项目

**uplan:**uplan

**general:**无依赖项目


### sass目录
```
sass/
		//组件样式
	components/ 
		//布局样式 
	layouts/
		//每个页面样式
	pages/
		//变量、混合、funtion、公共类、样式重置
	tools/
		//uplan|bootstrap
	uplan|bootstrap/
		//需要编译成css的sass
	uplan.scss
	style.scss

```

### images 目录
存放图片

### html 目录
存放html
** include/ ** 存放公用html

### plugIn 目录
存放 第三方插件
** ie8/ ** 存放兼容ie8的插件

### fonts 目录
存放字体

### js 目录
存放js脚本
** 子目录 ** 下的js将合并成一个js文件

## 安装

### 1.下载

	git clone http://10.19.157.229:3000/other/gulp.git

### 2.安装 
	cnpm i 


### 3.开发模式
	gulp dev

### 4.编译 
	gulp dist