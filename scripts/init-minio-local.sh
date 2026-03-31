#!/bin/bash
set -e

echo "=== MinIO 存储桶初始化脚本 ==="
echo "请确保 MinIO 容器正在运行 (端口 9000)"
echo ""

# 检查 mc 命令是否可用
if ! command -v mc &> /dev/null; then
    echo "错误: mc (MinIO Client) 未安装"
    echo "请安装 mc:"
    echo "  macOS: brew install minio/stable/mc"
    echo "  Linux: 参考 https://min.io/docs/minio/linux/reference/minio-mc.html"
    exit 1
fi

# 设置别名
echo "1. 设置 MinIO 别名..."
mc alias set captraw-local http://localhost:9000 Capt-Docs 12345678

# 检查连接
echo "2. 检查 MinIO 连接..."
if ! mc ls captraw-local &> /dev/null; then
    echo "错误: 无法连接到 MinIO"
    echo "请确保 MinIO 容器正在运行: docker-compose up -d minio"
    echo "等待 MinIO 启动: sleep 10"
    exit 1
fi

# 创建存储桶
echo "3. 创建存储桶: capt-docs-storage..."
mc mb --ignore-existing captraw-local/capt-docs-storage

# 设置存储桶策略（私有）
echo "4. 设置存储桶策略为私有..."
mc anonymous set none captraw-local/capt-docs-storage

# 创建目录结构
echo "5. 创建目录结构..."
for dir in user article notice banner; do
    echo "   创建目录: $dir"
    # 创建空对象作为目录标记
    echo -n | mc pipe "captraw-local/capt-docs-storage/$dir/.keep"
done

# 验证
echo "6. 验证存储桶内容..."
mc ls captraw-local/capt-docs-storage/

echo ""
echo "✅ MinIO 存储桶初始化完成!"
echo ""
echo "MinIO 控制台: http://localhost:9001"
echo "访问密钥: Capt-Docs"
echo "秘密密钥: 12345678"