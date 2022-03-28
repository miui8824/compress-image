Nodejs 图片批量压缩工具

使用方法

```shell
npm i -g compress-image-rc
```

示例

```shell
compress-image-rc
```

默认匹配当前路径 会自动寻找当前目录下jepg,jpg,png格式图片

options 选项

| 选择 | 默认值               | 描述                                     |
| ---- | -------------------- | ---------------------------------------- |
| -d   | 当前终端路径         | 需要压缩文件的目录                       |
| -m   | 1 （单位MB）         | 如 -m=1 超出1M才开始压缩                 |
| -q   | 70                   | 压缩质量比                               |
| -w   | 1080                 | 图片最大宽度超出最大宽度则缩小到最大宽度 |
| -o   | 当前终端目录下output | 需要输入的目录                           |

示例

```shell
compress-image-rc -d /User/admin/desktop/images -m 2 -q 80 -w 1920 -o /User/admin/Desktop/images/build
```

