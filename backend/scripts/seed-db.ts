#!/usr/bin/env ts-node
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';

const execAsync = promisify(exec);

async function runCommand(command: string, description: string) {
  console.log(`\n📦 ${description}...`);
  try {
    const { stdout, stderr } = await execAsync(command);
    if (stdout) console.log(stdout);
    if (stderr) console.error(stderr);
    console.log(`✅ ${description} 完成`);
    return true;
  } catch (error) {
    console.error(`❌ ${description} 失败:`, error);
    return false;
  }
}

async function checkDatabaseConnection(): Promise<boolean> {
  try {
    await execAsync('docker exec -i captraw-postgres psql -U captraw_user -d captraw_db -c "SELECT 1;"');
    return true;
  } catch {
    return false;
  }
}

async function waitForDatabase(retries = 10, delay = 2000): Promise<boolean> {
  for (let i = 1; i <= retries; i++) {
    console.log(`⏳ 等待数据库连接... 尝试 ${i}/${retries}`);
    
    if (await checkDatabaseConnection()) {
      console.log('✅ 数据库连接成功');
      return true;
    }
    
    if (i < retries) {
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  console.error('❌ 数据库连接失败');
  return false;
}

async function main() {
  console.log('🌱 开始填充数据库示例数据...');
  
  // 检查数据库连接
  if (!(await waitForDatabase())) {
    console.error('请先确保数据库正在运行');
    console.error('运行命令: docker-compose up -d postgres');
    process.exit(1);
  }
  
  // 检查seed-data.sql文件是否存在
  const seedDataPath = path.resolve(__dirname, '../seed-data.sql');
  if (!fs.existsSync(seedDataPath)) {
    console.error(`❌ 示例数据文件不存在: ${seedDataPath}`);
    console.error('请先创建 seed-data.sql 文件');
    process.exit(1);
  }
  
  console.log(`📄 使用示例数据文件: ${seedDataPath}`);
  
  // 执行SQL文件
  const sqlCommand = `docker exec -i captraw-postgres psql -U captraw_user -d captraw_db < ${seedDataPath}`;
  
  const success = await runCommand(
    sqlCommand,
    '执行示例数据SQL文件'
  );
  
  if (!success) {
    console.error('❌ 数据填充失败');
    process.exit(1);
  }
  
  // 验证数据
  console.log('\n📊 验证数据填充结果...');
  
  await runCommand(
    'docker exec -i captraw-postgres psql -U captraw_user -d captraw_db -c "SELECT \\\'Users\\\' as table_name, COUNT(*) as count FROM users UNION ALL SELECT \\\'Articles\\\', COUNT(*) FROM articles UNION ALL SELECT \\\'Announcements\\\', COUNT(*) FROM announcements UNION ALL SELECT \\\'Banners\\\', COUNT(*) FROM banners UNION ALL SELECT \\\'Server Info\\\', COUNT(*) FROM server_info;"',
    '查看各表数据量'
  );
  
  await runCommand(
    'docker exec -i captraw-postgres psql -U captraw_user -d captraw_db -c "SELECT info_key, info_value::text, description FROM server_info ORDER BY category, info_key LIMIT 5;"',
    '查看服务器配置示例'
  );
  
  await runCommand(
    'docker exec -i captraw-postgres psql -U captraw_user -d captraw_db -c "SELECT a.article_title, u.nickname as author, a.tags, a.views, a.likes FROM articles a JOIN users u ON a.author_id = u.user_uuid ORDER BY a.release_time DESC LIMIT 3;"',
    '查看文章示例'
  );
  
  console.log('\n🎉 数据库示例数据填充完成！');
  console.log('\n📋 数据统计:');
  console.log('- Users: 7条记录');
  console.log('- Articles: 5条记录');
  console.log('- Announcements: 2条记录');
  console.log('- Banners: 6条记录');
  console.log('- Server Info: 11条配置');
  console.log('\n🚀 下一步：运行 npm run dev 启动后端服务器');
}

if (require.main === module) {
  main().catch(error => {
    console.error('数据填充失败:', error);
    process.exit(1);
  });
}