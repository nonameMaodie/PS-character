# PS武将

## 项目概述
本扩展主要是对无名杀本体武将进行不同方向的强化设计或重构，设计来源于本人和广大网友。当然，除了对本体武将的重新设计外，本扩展还有一些奇奇怪怪的特殊武将。

## 项目结构
```
PS武将/
├── README.md                 # 项目说明文档
├── extension.js              # 扩展入口文件
├── info.json                 # 扩展信息配置
├── package.json              # 项目配置文件
├── vite.config.js            # Vite构建配置
├── audio/                    # 音频文件目录
├── image/                    # 图像文件目录
├── json/                     # JSON数据文件
├── src/
│   ├── extension.js          # 主扩展模块
│   ├── version.js            # 版本信息
│   ├── character/            # 角色数据
│   │   ├── PScharacter/      # 常规PS武将
│   │   └── PSsp_character/   # 特殊PS武将
│   ├── features/             # 功能模块
│   └── utils/                # 工具函数
```

## 开源地址

- github仓库地址：https://github.com/nonameMaodie/PS-character
- gitee仓库地址：https://gitee.com/ninemangos/PS-character