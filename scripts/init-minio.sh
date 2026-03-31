#!/bin/bash
set -e

echo "Waiting for MinIO to be ready..."
sleep 10

# 设置mc别名
mc alias set local http://minio:9000 Capt-Docs 12345678

# 创建存储桶
echo "Creating bucket: Capt-Docs-Storage"
mc mb --ignore-existing local/Capt-Docs-Storage

# 设置存储桶策略（禁止公开访问）
echo "Setting bucket policy to private"
mc anonymous set none local/Capt-Docs-Storage

# 创建目录结构
echo "Creating directory structure"
mc cp /dev/null local/Capt-Docs-Storage/user/.keep
mc cp /dev/null local/Capt-Docs-Storage/article/.keep
mc cp /dev/null local/Capt-Docs-Storage/notice/.keep
mc cp /dev/null local/Capt-Docs-Storage/banner/.keep

echo "MinIO initialization completed successfully"