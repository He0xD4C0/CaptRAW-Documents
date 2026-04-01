#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import os
import re
from pathlib import Path

def optimize_filename(filename):
    """优化文件名，使其更简洁"""
    # 分离基础名称和扩展名
    if filename.endswith('.md'):
        base = filename[:-3]
        ext = '.md'
    else:
        base = filename
        ext = ''
    
    # 查找最后一个'-'作为标题分隔符
    if '-' in base:
        parts = base.rsplit('-', 1)
        prefix = parts[0]
        title = parts[1]
        
        # 清理标题：移除常见的冗余前缀
        # 1. 移除开头的"项目"（如果存在）
        if title.startswith('项目'):
            title = title[2:]
        # 2. 移除开头的"第二阶段"（如果存在）
        if title.startswith('第二阶段'):
            title = title[4:]
        # 3. 移除开头的"第一阶段"（如果存在）
        if title.startswith('第一阶段'):
            title = title[4:]
        # 4. 移除开头的"今天"（如果存在）
        if title.startswith('今天'):
            title = title[2:]
        # 5. 移除开头的"详细"（如果存在）
        if title.startswith('详细'):
            title = title[2:]
        # 6. 移除开头的"核心"（如果存在）
        if title.startswith('核心'):
            title = title[2:]
        # 7. 移除开头的"关键"（如果存在）
        if title.startswith('关键'):
            title = title[2:]
        
        # 如果清理后为空，恢复原始标题
        if not title:
            title = parts[1]
        
        # 重新组合
        new_filename = f"{prefix}-{title}{ext}"
        return new_filename
    else:
        return filename

def main():
    """主函数：优化Reference目录下所有子目录中的文件名"""
    reference_dir = "Reference"
    
    # 获取所有子目录
    subdirs = [d for d in Path(reference_dir).iterdir() if d.is_dir()]
    
    print(f"找到 {len(subdirs)} 个子目录")
    
    total_renamed = 0
    
    for subdir in subdirs:
        print(f"\n处理目录: {subdir.name}")
        
        # 获取所有.md文件
        md_files = list(subdir.glob("*.md"))
        
        for filepath in md_files:
            old_name = filepath.name
            new_name = optimize_filename(old_name)
            
            if old_name != new_name:
                new_path = filepath.parent / new_name
                
                # 避免名称冲突
                if new_path.exists():
                    # 添加数字后缀
                    counter = 1
                    while True:
                        name_without_ext = new_path.stem
                        ext = new_path.suffix
                        candidate_name = f"{name_without_ext}_{counter}{ext}"
                        candidate_path = filepath.parent / candidate_name
                        if not candidate_path.exists():
                            new_path = candidate_path
                            new_name = candidate_name
                            break
                        counter += 1
                
                # 重命名文件
                filepath.rename(new_path)
                print(f"  - 重命名: {old_name} -> {new_name}")
                total_renamed += 1
            else:
                print(f"  - 保持不变: {old_name}")
    
    print(f"\n=== 完成 ===")
    print(f"共重命名 {total_renamed} 个文件")

if __name__ == "__main__":
    main()