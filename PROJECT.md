# 🚀 Fusion Alpha Manager - 项目总览

## 项目信息

**名称**: Fusion Alpha Manager  
**类型**: Electron 桌面应用  
**版本**: 1.0.0  
**技术栈**: Electron + React + TypeScript + Tailwind CSS  

## 📋 项目概述

这是一个为 Fusion Alpha 交易机器人系统设计的现代化桌面管理应用。它取代了原有的 Python CLI 工具（client.py），提供了更加直观、美观、高效的图形界面。

## 🎯 核心功能

### 1. 用户管理 (User Management)
- 添加/删除交易用户
- 配置 Gate.io API 凭证
- 真实/模拟交易模式切换
- 启动/停止用户交易
- 余额监控配置
- 一键平仓功能
- 导出器管理

### 2. KOL 管理 (KOL Management)
- 添加/删除关键意见领袖
- 支持 NORMAL 和 WWG 类型
- Discord 频道监控配置
- 作者 ID 过滤

### 3. 跟踪配置 (Track Management)
- 用户-KOL 映射关系
- 三种金额模式：
  - Loss Fixed（固定损失）
  - Fixed（固定金额）
  - Percentage（百分比）
- 反向交易支持
- 期货品种过滤
- 启动/停止/重启控制

### 4. 仪表盘 (Dashboard)
- 系统统计概览
- 快速操作入口
- 活动日志

### 5. 设置 (Settings)
- API 服务器配置
- 刷新间隔设置
- 应用信息展示

## 🏗️ 技术架构

### 前端技术栈
- **React 18**: UI 框架
- **TypeScript**: 类型安全
- **Tailwind CSS**: 样式框架
- **TanStack Query**: 数据获取和缓存
- **Zustand**: 状态管理
- **Axios**: HTTP 客户端
- **Lucide React**: 图标库

### 桌面技术
- **Electron 28**: 桌面应用框架
- **Context Isolation**: 安全隔离
- **Preload Scripts**: 进程通信

### 构建工具
- **Vite 5**: 快速开发服务器和构建
- **electron-builder**: 应用打包
- **TypeScript Compiler**: TS 编译

## 📁 项目结构

```
BotViewer/
├── electron/                 # Electron 主进程
│   ├── main.ts              # 主进程入口
│   ├── preload.ts           # 预加载脚本
│   └── tsconfig.json        # TS 配置
│
├── src/                      # React 应用
│   ├── components/          # UI 组件
│   │   ├── Dashboard.tsx
│   │   ├── UserManagement.tsx
│   │   ├── KOLManagement.tsx
│   │   ├── TrackManagement.tsx
│   │   └── SettingsPanel.tsx
│   │
│   ├── services/            # 服务层
│   │   └── api.ts          # API 客户端
│   │
│   ├── store/               # 状态管理
│   │   └── settings.ts     # 设置存储
│   │
│   ├── types/               # 类型定义
│   │   └── index.ts
│   │
│   ├── App.tsx              # 主应用组件
│   ├── main.tsx             # React 入口
│   ├── index.css            # 全局样式
│   └── vite-env.d.ts        # Vite 类型声明
│
├── .vscode/                  # VS Code 配置
│   ├── extensions.json
│   └── settings.json
│
├── dist/                     # 构建输出
├── release/                  # 打包输出
│
├── package.json             # 项目配置
├── tsconfig.json            # TS 配置（主）
├── tsconfig.node.json       # TS 配置（Node）
├── vite.config.ts           # Vite 配置
├── tailwind.config.js       # Tailwind 配置
├── postcss.config.js        # PostCSS 配置
├── .eslintrc.cjs            # ESLint 配置
├── .prettierrc              # Prettier 配置
├── .gitignore               # Git 忽略
├── build.sh                 # 构建脚本
│
└── README.md                # 主文档
    QUICKSTART.md            # 快速开始
    FEATURES.md              # 功能详解
    PROJECT.md               # 本文档
```

## 🔌 API 集成

完整实现了 Fusion Alpha API 的所有端点：

### 用户端点
- `POST /user/add` - 添加用户
- `GET /user/get` - 获取用户列表
- `POST /user/update` - 更新用户
- `DELETE /user/remove` - 删除用户
- `POST /user/run` - 启动用户
- `POST /user/stop` - 停止用户
- `POST /user/monitor/run` - 启动监控
- `POST /user/monitor/stop` - 停止监控
- `POST /user/close_all` - 关闭所有持仓
- `POST /user/exporter/start` - 启动导出器
- `POST /user/exporter/stop` - 停止导出器

### KOL 端点
- `POST /kol/add` - 添加 KOL
- `GET /kol/get` - 获取 KOL 列表
- `DELETE /kol/remove` - 删除 KOL

### 跟踪端点
- `POST /kol/track/add` - 添加跟踪配置
- `GET /kol/track/get` - 获取跟踪配置
- `DELETE /kol/track/remove` - 删除跟踪配置
- `POST /kol/track/start` - 开始跟踪
- `POST /kol/track/stop` - 停止跟踪
- `POST /kol/track/restart` - 重启跟踪

## 🎨 设计系统

### 颜色主题
- **Primary**: 蓝色系（#0ea5e9）
- **Dark**: 深色系（#0f172a - #f8fafc）
- **Success**: 绿色（成功状态）
- **Danger**: 红色（危险操作）
- **Warning**: 黄色（警告信息）
- **Info**: 蓝色（一般信息）

### 组件样式
- **btn**: 基础按钮
- **btn-primary**: 主要按钮
- **btn-secondary**: 次要按钮
- **btn-danger**: 危险按钮
- **btn-success**: 成功按钮
- **input**: 输入框
- **card**: 卡片容器
- **badge**: 标签徽章

### 动画效果
- **slideIn**: 滑入动画
- **pulse**: 脉冲动画
- **transition-all**: 平滑过渡

## 🚀 开发流程

### 安装依赖
```bash
npm install
```

### 开发模式
```bash
npm run dev
```
- 启动 Vite 开发服务器（端口 5173）
- 自动编译 TypeScript
- 启动 Electron 窗口
- 支持热重载

### 构建生产版本
```bash
npm run build
```
- 编译 TypeScript
- 打包 React 应用
- 生成 Electron 可执行文件

### 代码检查
```bash
npm run lint
```

## 📦 依赖说明

### 核心依赖
- `react` & `react-dom`: React 框架
- `electron`: 桌面应用框架
- `axios`: HTTP 请求
- `@tanstack/react-query`: 数据管理
- `zustand`: 状态管理
- `lucide-react`: 图标
- `date-fns`: 日期处理
- `chart.js` & `recharts`: 图表（预留）

### 开发依赖
- `vite`: 构建工具
- `typescript`: 类型系统
- `tailwindcss`: CSS 框架
- `eslint`: 代码检查
- `electron-builder`: 应用打包
- `concurrently`: 并行执行命令
- `wait-on`: 等待服务就绪

## 🔒 安全特性

1. **Context Isolation**: Electron 进程隔离
2. **No Node Integration**: 渲染进程不直接访问 Node
3. **Preload Scripts**: 安全的进程通信
4. **API Key Protection**: 部分显示敏感信息
5. **Input Validation**: 表单验证防止注入

## 🎯 性能优化

1. **数据缓存**: TanStack Query 智能缓存
2. **懒加载**: 按需加载组件
3. **防抖节流**: 优化频繁操作
4. **虚拟滚动**: 大列表性能优化
5. **Tree Shaking**: Vite 自动优化
6. **代码分割**: 减小包体积

## 📊 应用特点

### 优势
✅ 现代化的 UI/UX 设计  
✅ 类型安全的开发体验  
✅ 快速的开发和构建  
✅ 跨平台支持（macOS/Windows/Linux）  
✅ 实时数据更新  
✅ 离线配置持久化  
✅ 完整的错误处理  
✅ 响应式设计  

### 对比 client.py
✅ 图形界面 vs 命令行  
✅ 实时监控 vs 手动查询  
✅ 批量操作 vs 逐个执行  
✅ 可视化配置 vs 文本输入  
✅ 错误提示 vs 异常堆栈  

## 🔧 配置说明

### API 配置
在设置面板中配置：
- API Base URL: `http://127.0.0.1:8888`
- Refresh Interval: `5000ms`

### 持久化存储
使用 LocalStorage 存储：
- 应用设置
- API 配置
- UI 状态

## 📈 未来规划

### 计划功能
- [ ] 数据可视化图表
- [ ] 交易历史记录
- [ ] 性能分析报告
- [ ] 通知推送系统
- [ ] 多语言支持
- [ ] 深色/浅色主题切换
- [ ] 键盘快捷键
- [ ] 导出数据功能

### 技术改进
- [ ] 单元测试
- [ ] E2E 测试
- [ ] 性能监控
- [ ] 错误上报
- [ ] 自动更新

## 🤝 开发规范

### 代码风格
- 使用 ESLint + Prettier
- 遵循 TypeScript 严格模式
- React Hooks 最佳实践
- 函数式组件优先

### 提交规范
- feat: 新功能
- fix: 修复
- docs: 文档
- style: 样式
- refactor: 重构
- test: 测试
- chore: 构建/工具

### 分支策略
- main: 生产分支
- develop: 开发分支
- feature/*: 功能分支
- hotfix/*: 热修复分支

## 📝 文档

- `README.md` - 主要文档和使用说明
- `QUICKSTART.md` - 快速开始指南
- `FEATURES.md` - 功能详细说明
- `PROJECT.md` - 项目技术文档（本文件）

## 🆘 故障排除

### 常见问题

**无法连接 API**
- 检查 API 服务器是否运行
- 验证 Settings 中的 API URL
- 查看浏览器控制台错误

**应用启动失败**
- 删除 node_modules 重新安装
- 检查 Node.js 版本（需要 18+）
- 查看终端错误信息

**构建失败**
- 清理 dist 目录
- 更新依赖版本
- 检查 TypeScript 错误

### 调试方法
1. 开启 DevTools（开发模式自动打开）
2. 查看 Network 标签页（API 请求）
3. 查看 Console 标签页（日志）
4. 使用 React DevTools 扩展

## 📞 支持

- 查看文档：README.md
- 提交 Issue：GitHub Issues
- 查看日志：DevTools Console
- 检查 API：API 服务器日志

## 📄 许可证

MIT License

---

**开发者**: Fusion Alpha Team  
**更新时间**: 2026-01-08  
**文档版本**: 1.0.0
