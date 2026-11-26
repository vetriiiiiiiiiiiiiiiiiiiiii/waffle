// PM2 process file for Waffle Story.
// Next.js listens on 127.0.0.1 only; Nginx is the public front door.
// The port comes from PORT= in .env.production (default 3000), so a git pull
// never changes it. Example: echo "PORT=3001" >> .env.production
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
let port = process.env.PORT || "3000";
try {
  const env = fs.readFileSync(path.join(root, ".env.production"), "utf8");
  const m = env.match(/^\s*PORT\s*=\s*(\d+)\s*$/m);
  if (m) port = m[1];
} catch {}

module.exports = {
  apps: [
    {
      name: "waffle-story",
      cwd: root,
      script: "node_modules/next/dist/bin/next",
      args: `start -H 127.0.0.1 -p ${port}`,
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      max_memory_restart: "600M",
      env: {
        NODE_ENV: "production",
        NEXT_TELEMETRY_DISABLED: "1",
      },
    },
  ],
};
