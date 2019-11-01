# 入门

## 什么是dAPI?

dAPI 是一个用于跟NEO区块链沟通的接口。这些方法将由现存的线上钱包（比如NeoLogin或者O3线上钱包）供应商处理，并有助于减少有关于在Neo上创造dAPPs的开发开销。

通过将NEO区块链的交互职责转移给钱包供应商，dAPP的开发者不需要当心管理用户私人密钥或者如何签署交易并且广播出去。开发者们无需再为如何管理用户安全证书而费心，从而可以更专注的开发他们的dAPP核心内容。

另一方面对用户而言，自从所有需要广播到区块链的交易被用户线上钱包供应商处理，他们可以为此感到安心因为他们无需再复制黏贴他们的私人密钥到dAPP里。任何用户签署的交易都会在线上钱包里完成，以及他们的私人密钥永远都不会向dAPP提供。

## 安装

dAPI客户端集成目前由JS package版本提供，并且可以通过CDN或者NPM导入到你的应用里。

### 通过CDN安装

```html
<script src="https://neologin.io/neologin.js"></script>
```
```typescript
window.neologin
```
```javascript
window.neologin
```

只需在你的HTML中添加引用 `https://neologin.io/neologin.js`的脚本标签即可。

### 通过NPM安装

```bash
npm i --save neologin

or

yarn add neologin
```

```typescript
var neologin = require('neologin');

or

import neologin from 'neologin';
```
```javascript
var neologin = require('neologin');

or

import neologin from 'neologin';
```

[![npm version](https://badge.fury.io/js/neologin.svg)](https://www.npmjs.com/package/neologin)

当你通过NPM安装时，我们建议你将安装在特定版本上的套件版本锁定，或每当有更新时补修你的代码。

## 手机兼容性

我们建议使用电脑浏览器或者Chrome的手机模拟器上进行大部分的开发。当你的app能在电脑上完全运行时，无需任何额外的改动，NeoLogin线上钱包将自动适应，从而能在手机浏览器上使用。 
