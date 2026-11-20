'use strict';
// Build-only isolation. Application runtime does not import this file.
if (require.main !== module) {
  const deny = () => { throw Object.assign(new Error('BUILD_NETWORK_BLOCKED'), { code: 'BUILD_NETWORK_BLOCKED' }); };
  const net = require('node:net'), tls = require('node:tls'), dns = require('node:dns');
  const connect = net.Socket.prototype.connect;
  net.Socket.prototype.connect = function (...args) {
    const target = Array.isArray(args[0]) ? args[0][0] : args[0];
    // Preserve local IPC needed by build workers; reject TCP connections.
    if ((typeof target === 'string' && !/^\d+$/.test(target)) ||
        (target && typeof target === 'object' && typeof target.path === 'string' && !target.port)) {
      return connect.apply(this, args);
    }
    return deny();
  };
  tls.connect = deny;
  for (const key of ['lookup', 'resolve', 'resolve4', 'resolve6', 'resolveSrv', 'resolveTxt']) {
    dns[key] = deny;
    dns.promises[key] = deny;
  }
} else {
  const env = { ...process.env,
    MONGODB_URI: 'mongodb://127.0.0.1:1/newta_build_isolation',
    NODE_OPTIONS: '--require ' + JSON.stringify(__filename.replace(/\\/g, '/')),
  };
  const result = require('node:child_process').spawnSync(process.execPath,
    [require.resolve('next/dist/bin/next'), 'build', ...process.argv.slice(2)],
    { env, stdio: 'inherit', windowsHide: true });
  if (result.error || result.signal) { console.error('Build process could not complete.'); process.exit(1); }
  process.exit(Number.isInteger(result.status) ? result.status : 1);
}
