# 荔园帮帮 · Liyuan BangBang

![平台](https://img.shields.io/badge/平台-微信小程序-07C160?logo=wechat)
![技术栈](https://img.shields.io/badge/技术栈-原生小程序%20WXML%2FWXSS%2FJS-blue)
![基础库](https://img.shields.io/badge/基础库-3.15.1-orange)
![依赖](https://img.shields.io/badge/第三方依赖-0-brightgreen)
![License](https://img.shields.io/badge/License-MIT-green)

> 一个面向校园场景的**互助跑腿 / 校园交易平台**微信小程序。
> 用户可以发布代拿快递、代购餐食等需求，其他同学接单完成，双方在小程序内沟通交付。

---

## 目录导航

- [项目背景](#项目背景)
- [功能一览](#功能一览)
- [项目截图](#项目截图)
- [技术栈](#技术栈)
- [快速开始](#快速开始)
- [目录结构](#目录结构)
- [数据模型](#数据模型)
- [已知限制](#已知限制)
- [后续规划](#后续规划)
- [参与贡献](#参与贡献)
- [免责声明](#免责声明)
- [许可证](#许可证)

---

## 项目背景

校园里"顺路帮忙"的需求非常高频：快递柜太远、饭点排长队、宵夜街懒得走、下雨天不想出门。
**荔园帮帮**希望把这类零散需求集中到一个平台上：

- **发布方**：花几块钱发布一个跑腿需求，写清取件点、送达点、期望时间；
- **接单方**：利用碎片时间顺路接单，赚点零花钱；
- **平台**：通过学号 / 学生证认证机制保证校内身份真实，降低线下交易风险。

当前仓库是**课程项目原型（Prototype）**：前端交互完整、业务流程跑通，数据全部存放在微信本地缓存中，**尚未接入后端服务**。

---

## 功能一览

| 模块 | 页面路径 | 说明 |
| --- | --- | --- |
| 身份认证 | `pages/login/login` | 昵称 / 手机号 / 学号 + 学生证照片 + 人脸拍照，提交后进入审核流程 |
| 首页 | `pages/home/home` | 待接单数量统计、最近订单、快捷入口（下单 / 接单 / 消息） |
| 发布需求 | `pages/place/place` | 4 种订单类型、取送地点、期望送达时长、等待接单时长、赏金价格、私密信息（取件码 / 门牌号 / 联系电话） |
| 接单大厅 | `pages/receive/receive` | 实时展示他人发布的待接订单，一键抢单，自动过滤自己发布的单 |
| 订单中心 | `pages/orders/orders` | "我发布的" / "我接的" 双 Tab，支持取消订单、确认完成 |
| 消息列表 | `pages/chatList/chatList` | 会话列表，展示对方昵称、最后一条消息、未读数、关联订单 |
| 聊天页 | `pages/chat/chat` | 单聊会话，进入即已读，支持实时发送与滚动到底部 |
| 个人中心 | `pages/profile/profile` | 用户信息、信用分、订单统计、缓存管理、用户协议 / 隐私政策、退出登录 |

### 细节亮点

- **订单类型**：快递代拿 / 食堂代购 / 宵夜街代购 / 其他，四种场景分类
- **时间校验**：期望送达时间小于等待接单时长时，界面即时给出提示
- **价格输入**：限制两位小数，另提供快捷价格按钮
- **私密信息隔离**：取件码、门牌号、联系电话单独存放于 `privateInfo` 字段，不随列表公开展示
- **接单防冲突**：接单前二次校验订单状态，已被抢走则提示"订单已被接走"

---

## 项目截图

> 截图请在 `docs/images/` 目录下补充，命名参考下表（仓库中已放置占位说明文件）。

| 首页 | 发布需求 | 接单大厅 | 订单中心 |
| :---: | :---: | :---: | :---: |
| `docs/images/home.png` | `docs/images/place.png` | `docs/images/receive.png` | `docs/images/orders.png` |

| 认证登录 | 消息列表 | 聊天页 | 个人中心 |
| :---: | :---: | :---: | :---: |
| `docs/images/login.png` | `docs/images/chatList.png` | `docs/images/chat.png` | `docs/images/profile.png` |

---

## 技术栈

- **框架**：微信小程序原生开发（WXML + WXSS + JavaScript），未使用任何 UI 组件库
- **基础库**：`3.15.1`
- **状态与存储**：`wx.getStorageSync / wx.setStorageSync` 本地缓存 + `App.globalData`
- **UI**：自定义样式，主题色 `#2266ff`，背景色 `#f8fafd`，`tabBar` 五项导航
- **构建**：零构建、零第三方依赖，`clone` 下来即可在开发者工具中直接运行

---

## 快速开始

### 1. 准备环境

1. 下载安装 [微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)（稳定版 Stable Build）。
2. 拥有一个微信小程序账号（[微信公众平台](https://mp.weixin.qq.com/) 注册），或用**测试号**体验。

### 2. 导入项目

```bash
git clone https://github.com/nqiao2006-lab/campus-errand.git
cd campus-errand
```

开发者工具中：**项目 → 导入项目**，目录选择本仓库根目录，AppID 填写你自己的 AppID，后端服务选择「不使用云服务」。

### 3. 修改 AppID（重要）

仓库中的 `project.config.json` 出于安全考虑，AppID 已被替换为占位值：

```json
{
  "appid": "touristappid"
}
```

请将其改为你自己的 AppID；若只是本地预览，可保持 `touristappid` 以**游客模式**运行。

### 4. 调试设置

开发者工具右上角「详情 → 本地设置」中，建议勾选：

- ☑ 不校验合法域名、web-view（业务域名）、TLS 版本以及 HTTPS 证书
- ☑ ES6 转 ES5

### 5. 体验流程

由于采用本地存储模拟，建议按以下顺序体验：

1. 进入**登录页**，填写昵称 / 手机号 / 学号，上传任意两张图片（学生证 + 人脸），勾选协议后提交 → 自动通过审核。
2. 在**下单**页发布一条需求 → 订单写入本地缓存。
3. 在**接单**页查看待接订单（同一设备上看不到自己发布的单，可清缓存后重新注册一个身份，或用另一台设备 / 另一个微信号体验）。
4. 在**订单**页完成取消 / 完成操作。

> 提示：数据存在本地缓存中，切换微信号、清理缓存、更换设备都会导致数据丢失，这是原型阶段的既定设计，接入后端后会解决。

---

## 目录结构

```
campus-errand/
├── app.js                  # 小程序入口：全局数据、登录态校验、审核状态检查
├── app.json                # 全局配置：页面注册、tabBar、窗口样式
├── app.wxss                # 全局样式
├── sitemap.json            # 索引配置
├── project.config.json     # 项目配置（AppID 已脱敏为 touristappid）
├── pages/
│   ├── login/              # 校园身份认证
│   ├── home/               # 首页概览
│   ├── place/              # 发布需求（下单）
│   ├── receive/            # 接单大厅
│   ├── orders/             # 订单中心（我发布的 / 我接的）
│   ├── chatList/           # 会话列表
│   ├── chat/               # 单聊会话
│   └── profile/            # 个人中心
├── docs/
│   ├── images/             # 项目截图（待补充）
│   ├── 数据模型.md
│   ├── 后续规划.md
│   └── 发布到GitHub.md
├── .gitignore
├── CHANGELOG.md
├── CONTRIBUTING.md
├── LICENSE                 # MIT
└── README.md
```

---

## 数据模型

当前所有数据通过微信本地缓存（`wx.setStorageSync`）持久化，核心 key 如下：

| Key | 结构 | 说明 |
| --- | --- | --- |
| `userInfo` | `{ id, nickname, phone, studentId, verified, avatar, joinDate, credit, completedOrders, publishedOrders }` | 当前登录用户 |
| `orders` | `Order[]` | 全部订单 |
| `conversations` | `Conversation[]` | 会话列表 |
| `messages` | `Message[]` | 聊天消息 |
| `token` | `string` | 登录凭证（接入后端后生效） |

`Order` 主要字段：

```js
{
  id, creatorId, creatorNickname, creatorPhone,
  orderType,            // express | canteen | snack | other
  orderTypeText,        // 快递代拿 | 食堂代购 | 宵夜街代购 | 其他
  description, pickupLocation, deliveryLocation,
  price, waitMinutes, expectedDeliveryMinutes, expectedDeliveryText,
  remark,
  status,               // waiting | accepted | completed | canceled
  createTime, expireTime,
  takerId, takerNickname, takerPhone, takerAcceptTime, completeTime,
  privateInfo: { pickupCode, roomNumber, contactPhone }
}
```

完整字段说明见 [`docs/数据模型.md`](docs/数据模型.md)。

---

## 已知限制

开源的意义在于真实，以下是本项目当前**确实存在**的问题，欢迎提 PR 修复：

1. **无后端服务**：全部数据存于本地缓存，多设备之间不同步，清理缓存即丢失。
2. **认证为前端模拟**：`pages/login/login.js` 中审核逻辑为 `setTimeout` 模拟，学生证与人脸照片仅转 base64 后丢弃，未做任何校验。
3. **缺失审核等待页**：`app.js` 的 `navigateToAuditPending()` 跳转 `/pages/audit-pending/audit-pending`，该页面尚未创建。
4. **聊天对方信息无法解析**：`chatList.js` 的 `getOtherUserInfo()` 依赖未写入的 `verifiedUsers` 缓存，对方昵称通常恒为"同学"。
5. **接单后未自动建会话**：`conversations` 需外部写入，接单流程尚未串联创建会话的逻辑。
6. **订单过期未生效**：`expireTime` 已计算但没有定时任务清理超时订单。
7. **API 地址为占位**：`app.js` 中请求地址为 `https://your-api.com/...`，接入后端时需替换。
8. **未实现支付、评价、信用分联动**。

---

## 后续规划

- [ ] 接入后端服务（用户、订单、消息三张核心表 + REST API）
- [ ] 真实身份认证（学生证 OCR + 人脸比对）
- [ ] WebSocket 实时消息推送
- [ ] 订单超时自动取消 + 定时任务
- [ ] 评价体系与信用分联动
- [ ] 在线支付 / 赏金托管
- [ ] 消息未读红点、订阅消息通知

详见 [`docs/后续规划.md`](docs/后续规划.md)。

---

## 参与贡献

欢迎 Issue 与 Pull Request，请先阅读 [`CONTRIBUTING.md`](CONTRIBUTING.md)。

```bash
# 1. Fork 本仓库
# 2. 新建分支
git checkout -b feature/your-feature
# 3. 提交
git commit -m "feat: 描述你的改动"
# 4. 推送并发起 PR
git push origin feature/your-feature
```

---

## 免责声明

- 本项目为**课程设计与学习用途的原型**，不具备生产环境可用性，请勿直接用于真实交易。
- 项目涉及学号、手机号、学生证照片、人脸图像等敏感个人信息。若进行二次开发并上线，请务必遵守《中华人民共和国个人信息保护法》及微信小程序平台运营规范，完成合规的隐私协议与数据加密存储。
- 项目中出现的"深圳大学""丽湖校区"等字样仅为原型阶段的示例文案，可自行替换为你的学校与校区。

---

## 许可证

本项目基于 [MIT License](LICENSE) 开源，Copyright (c) 2026 吴念乔。

你可以自由使用、修改、分发本项目（包括商业用途），只需保留版权声明。软件按"原样"提供，作者不承担任何明示或默示的担保责任。
