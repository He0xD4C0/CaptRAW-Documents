const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const rootConfigPath = path.resolve(__dirname, '../../config.yaml');
const publicConfigPath = path.resolve(__dirname, '../public/config.yaml');

function pickPublicConfig(fullConfig) {
  return {
    api: fullConfig.api || {},
    assets: fullConfig.assets || {},
    community: fullConfig.community || {},
  };
}

function main() {
  if (!fs.existsSync(rootConfigPath)) {
    throw new Error(`config.yaml not found: ${rootConfigPath}`);
  }

  const yamlText = fs.readFileSync(rootConfigPath, 'utf8');
  const fullConfig = yaml.load(yamlText) || {};
  const publicConfig = pickPublicConfig(fullConfig);
  const output = yaml.dump(publicConfig, { noRefs: true, lineWidth: 120 });

  fs.writeFileSync(publicConfigPath, output, 'utf8');
  console.log(`Synced public config to ${publicConfigPath}`);
}

main();

