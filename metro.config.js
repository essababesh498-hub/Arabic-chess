const fs = require('fs');
const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Fiber's native build imports a sibling file outside its nested package.json.
// Metro's file map reports that file as missing even though it is on disk.
config.resolver.resolveRequest = (context, moduleName, platform) => {
  const origin = context.originModulePath ?? '';
  const insideFiber = origin.includes(`${path.sep}@react-three${path.sep}fiber${path.sep}`);
  if (insideFiber && (moduleName.startsWith('.') || path.isAbsolute(moduleName))) {
    const absolute = path.normalize(path.resolve(path.dirname(origin), moduleName));
    if (fs.existsSync(absolute) && fs.statSync(absolute).isFile()) {
      return { type: 'sourceFile', filePath: absolute };
    }
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
