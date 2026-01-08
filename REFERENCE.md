# 🚀 Fusion Alpha Manager - 快速参考

## 一键启动

```bash
cd /Users/zxc/codeField/fusion-alpha/BotViewer
npm run dev
```

## 常用命令

| 命令 | 说明 |
|------|------|
| `npm install` | 安装依赖 |
| `npm run dev` | 开发模式 |
| `npm run build` | 生产构建 |
| `npm run preview` | 预览构建 |
| `npm run lint` | 代码检查 |

## 项目入口

| 类型 | 路径 |
|------|------|
| 主应用 | src/App.tsx |
| React 入口 | src/main.tsx |
| Electron 主进程 | electron/main.ts |
| API 客户端 | src/services/api.ts |
| 类型定义 | src/types/index.ts |

## 核心组件

| 组件 | 路径 | 功能 |
|------|------|------|
| Dashboard | src/components/Dashboard.tsx | 仪表盘 |
| UserManagement | src/components/UserManagement.tsx | 用户管理 |
| KOLManagement | src/components/KOLManagement.tsx | KOL管理 |
| TrackManagement | src/components/TrackManagement.tsx | 跟踪管理 |
| SettingsPanel | src/components/SettingsPanel.tsx | 设置面板 |

## 配置文件

| 文件 | 用途 |
|------|------|
| package.json | 项目配置 |
| tsconfig.json | TypeScript 配置 |
| vite.config.ts | Vite 配置 |
| tailwind.config.js | Tailwind 配置 |
| .eslintrc.cjs | ESLint 规则 |
| .prettierrc | Prettier 格式 |

## API 端点速查

### 用户
- POST /user/add - 添加
- GET /user/get - 列表
- POST /user/run - 运行
- POST /user/stop - 停止
- DELETE /user/remove - 删除

### KOL
- POST /kol/add - 添加
- GET /kol/get - 列表
- DELETE /kol/remove - 删除

### 跟踪
- POST /kol/track/add - 添加
- POST /kol/track/start - 开始
- POST /kol/track/stop - 停止
- POST /kol/track/restart - 重启
- DELETE /kol/track/remove - 删除

## 默认配置

```javascript
API Base URL: http://127.0.0.1:8888
Refresh Interval: 5000ms
Dev Server: http://localhost:5173
Window Size: 1400x900
```

## 快速调试

### 查看日志
- 开发模式：自动打开 DevTools
- Console：查看应用日志
- Network：查看 API 请求

### 常见错误

**无法连接 API**
→ 检查 Settings 中的 API URL

**端口占用**
→ `lsof -ti:5173 | xargs kill -9`

**依赖问题**
→ `rm -rf node_modules && npm install`

## 技术栈速查

```
Electron 28  - 桌面框架
React 18     - UI 库
TypeScript   - 类型系统
Vite 5       - 构建工具
Tailwind 3   - CSS 框架
TanStack Query - 数据管理
Zustand      - 状态管理
Axios        - HTTP 客户端
```

## 文件结构

```
BotViewer/
├── electron/        # Electron 主进程
├── src/
│   ├── components/  # React 组件
│   ├── services/    # API 服务
│   ├── store/       # 状态管理
│   └── types/       # 类型定义
├── dist/            # 构建输出
└── docs/            # 文档
```

## 开发工作流

1. **启动**: `npm run dev`
2. **编码**: 修改源文件
3. **测试**: 自动热重载
4. **检查**: `npm run lint`
5. **构建**: `npm run build`

## 键盘快捷键

| 快捷键 | 功能 |
|--------|------|
| Cmd/Ctrl + R | 刷新 |
| Cmd/Ctrl + , | 设置 |
| Cmd/Ctrl + Q | 退出 |

## 性能提示

- ✅ 使用 TanStack Query 缓存
- ✅ 避免不必要的重渲染
- ✅ 使用 React.memo 优化组件
- ✅ 合理设置刷新间隔
- ✅ 懒加载大型组件

## 安全提示

- 🔒 API 密钥加密存储
- 🔒 Context Isolation 启用
- 🔒 输入验证和清理
- 🔒 HTTPS 生产环境

## 部署检查清单

- [ ] 依赖已安装
- [ ] TypeScript 编译通过
- [ ] ESLint 检查通过
- [ ] 生产构建成功
- [ ] API 连接正常
- [ ] 功能测试完成

## 获取帮助

📖 [README.md](README.md) - 完整文档
🚀 [QUICKSTART.md](QUICKSTART.md) - 快速开始
🎯 [FEATURES.md](FEATURES.md) - 功能说明
🏗️ [PROJECT.md](PROJECT.md) - 技术文档
✅ [COMPLETION.md](COMPLETION.md) - 完成总结

---

**保存此文件用于日常参考！** 📌
