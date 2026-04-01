#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import os
import re
import shutil
from pathlib import Path

def clean_title_for_filename(title):
    """清理标题，生成适合文件名的字符串"""
    # 移除开头的##和空格
    title = title.strip()
    if title.startswith('##'):
        title = title[2:].strip()
    
    # 移除emoji和特殊符号，保留中文、英文、数字、空格、连字符、下划线
    # 使用正则表达式匹配中文字符、字母、数字、空格、连字符、下划线
    # 中文字符范围：\u4e00-\u9fff
    pattern = r'[^\u4e00-\u9fffa-zA-Z0-9\s\-_]'
    cleaned = re.sub(pattern, '', title)
    
    # 将多个空格替换为单个空格
    cleaned = re.sub(r'\s+', ' ', cleaned).strip()
    
    # 如果清理后为空，使用原始标题的简单处理
    if not cleaned:
        # 使用简单的清理：只保留字母数字和中文字符
        cleaned = re.sub(r'[^a-zA-Z0-9\u4e00-\u9fff]', '', title)
    
    # 将空格替换为连字符
    cleaned = cleaned.replace(' ', '-')
    
    return cleaned

def split_md_file_by_headers(filepath, output_dir):
    """按二级标题拆分Markdown文件"""
    print(f"处理文件: {filepath}")
    
    # 读取文件内容
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 获取基础文件名（不含扩展名）
    base_name = Path(filepath).stem
    if base_name.endswith('.plan'):
        base_name = base_name[:-5]  # 移除.plan
    
    # 按行分割内容
    lines = content.split('\n')
    
    # 查找所有二级标题的位置
    header_positions = []
    for i, line in enumerate(lines):
        if line.startswith('## ') and not line.startswith('###'):
            header_positions.append(i)
    
    # 如果没有二级标题，则将整个文件作为一个部分
    if not header_positions:
        print(f"  - 未找到二级标题，将整个文件作为单个部分")
        section_title = "内容总览"
        section_filename = f"{base_name}-{clean_title_for_filename(section_title)}.md"
        section_path = os.path.join(output_dir, section_filename)
        
        section_content = content
        with open(section_path, 'w', encoding='utf-8') as f:
            f.write(section_content)
        print(f"  - 创建: {section_filename}")
        return [section_filename]
    
    # 添加文件末尾位置，便于处理最后一个部分
    header_positions.append(len(lines))
    
    created_files = []
    
    # 处理每个部分
    for idx in range(len(header_positions) - 1):
        start_idx = header_positions[idx]
        end_idx = header_positions[idx + 1]
        
        # 获取标题行
        header_line = lines[start_idx]
        
        # 清理标题用于文件名
        section_title = clean_title_for_filename(header_line)
        
        # 生成文件名
        section_filename = f"{base_name}-{section_title}.md"
        section_path = os.path.join(output_dir, section_filename)
        
        # 提取该部分内容
        section_lines = lines[start_idx:end_idx]
        section_content = '\n'.join(section_lines)
        
        # 写入文件
        with open(section_path, 'w', encoding='utf-8') as f:
            f.write(section_content)
        
        created_files.append(section_filename)
        print(f"  - 创建: {section_filename} (标题: {header_line.strip()})")
    
    return created_files

def main():
    """主函数"""
    reference_dir = "Reference"
    
    # 获取所有Markdown文件
    md_files = []
    for ext in ['*.md', '*.plan.md']:
        md_files.extend(list(Path(reference_dir).glob(ext)))
    
    print(f"找到 {len(md_files)} 个Markdown文件")
    
    # 处理每个文件
    for filepath in md_files:
        # 创建对应的目录
        dir_name = filepath.stem
        if dir_name.endswith('.plan'):
            dir_name = dir_name[:-5]
        
        output_dir = Path(reference_dir) / dir_name
        output_dir.mkdir(exist_ok=True)
        
        print(f"\n=== 处理: {filepath.name} ===")
        
        # 拆分文件
        created_files = split_md_file_by_headers(str(filepath), str(output_dir))
        
        print(f"  共创建 {len(created_files)} 个子文件")
    
    print("\n=== 处理完成 ===")

if __name__ == "__main__":
    main()