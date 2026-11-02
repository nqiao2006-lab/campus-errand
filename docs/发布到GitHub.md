# 仓库与发布说明

本仓库地址：`https://github.com/nqiao2006-lab/campus-errand`
开源协议：MIT · 仓库名称含义：campus-errand（校园跑腿）

---

## 一、仓库基本信息

| 项目 | 内容 |
| --- | --- |
| Repository name | `campus-errand` |
| Description | 校园互助跑腿平台 · 微信小程序（原生开发） |
| Visibility | Public（公开） |
| Topics | `wechat` `miniprogram` `weapp` `campus` `小程序` `校园` |
| Default branch | `main` |
| 初始版本 | `v0.1.0` |

---

## 二、后续更新代码怎么推

本地仓库已 `git init` 并完成首次提交（`main` 分支），之后改动按下面流程走：

```bash
cd campus-errand

git status                       # 看看改了什么
git add -A
git commit -m "fix: 描述你的改动"
git push origin main
```

提交信息建议遵循 CONTRIBUTING.md 中的约定（`feat` / `fix` / `docs` / `style` / `refactor` / `chore`）。

---

## 三、如果需要在另一台机器上重新发布

### 方式一：GitHub Desktop（无需命令行）

1. 打开 GitHub Desktop 并登录。
2. **File → Add Local Repository…** → **Choose…** 选中本文件夹。
3. 若提示 "not a git repository"，点击 **create a repository**，默认设置即可。
4. 填写 Summary 后 **Commit to main** → **Publish repository**。

### 方式二：命令行

```bash
git init -b main
git add .
git commit -m "init: 荔园帮帮校园互助小程序开源"

# 在 GitHub 网页新建一个空仓库（不要勾选 README / .gitignore / LICENSE），然后：
git remote add origin https://github.com/nqiao2006-lab/campus-errand.git
git push -u origin main
```

使用 SSH：

```bash
git remote add origin git@github.com:nqiao2006-lab/campus-errand.git
git push -u origin main
```

---

## 四、发布后的收尾清单

- [ ] 右上角 ⚙ 填写 Description 与 Website
- [ ] 添加 Topics 标签，方便检索
- [ ] Settings → General → Features 开启 Issues
- [ ] 把 8 个页面截图放进 `docs/images/`，README 会自动展示
- [ ] Releases → Create a new release → Tag `v0.1.0`

---

## 五、安全检查（每次提交前）

- [ ] 不含真实 AppID（当前为占位值 `touristappid`）
- [ ] 不含真实手机号、学号、人脸 / 学生证照片
- [ ] 不含 `project.private.config.json`（已被 `.gitignore` 忽略）
- [ ] 不含密钥、token、`.env` 文件
