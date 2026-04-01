#!/usr/bin/env ts-node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const util_1 = require("util");
const execAsync = (0, util_1.promisify)(child_process_1.exec);
async function runCommand(command, description) {
    console.log(`\n📦 ${description}...`);
    try {
        const { stdout, stderr } = await execAsync(command);
        if (stdout)
            console.log(stdout);
        if (stderr)
            console.error(stderr);
        console.log(`✅ ${description} 完成`);
        return true;
    }
    catch (error) {
        console.error(`❌ ${description} 失败:`, error);
        return false;
    }
}
async function main() {
    console.log('🔄 开始重置数据库...');
    // 1. 停止并删除PostgreSQL容器
    await runCommand('docker-compose stop postgres', '停止PostgreSQL容器');
    await runCommand('docker-compose rm -f postgres', '删除PostgreSQL容器');
    // 2. 删除PostgreSQL数据卷
    await runCommand('docker volume rm -f captraw-documents_postgres_data', '删除PostgreSQL数据卷');
    // 3. 重新启动PostgreSQL
    await runCommand('docker-compose up -d postgres', '启动PostgreSQL容器');
    // 4. 等待数据库启动
    console.log('\n⏳ 等待数据库启动...');
    await new Promise(resolve => setTimeout(resolve, 5000));
    // 5. 检查数据库状态
    const dbCheck = await runCommand('docker exec -i captraw-postgres psql -U captraw_user -d captraw_db -c "SELECT 1;"', '检查数据库连接');
    if (!dbCheck) {
        console.error('❌ 数据库连接检查失败');
        process.exit(1);
    }
    console.log('\n📊 检查数据库表...');
    await runCommand('docker exec -i captraw-postgres psql -U captraw_user -d captraw_db -c "\\dt"', '查看数据库表');
    console.log('\n🎉 数据库重置完成！');
    console.log('\n📋 下一步操作：');
    console.log('1. 运行 npm run seed-db 填充示例数据');
    console.log('2. 运行 npm run upload-assets 上传资产到MinIO');
    console.log('3. 运行 npm run dev 启动后端服务器');
}
if (require.main === module) {
    main().catch(error => {
        console.error('数据库重置失败:', error);
        process.exit(1);
    });
}
