// PM2 process file for Waffle Story.
// Next.js listens on 127.0.0.1 only; Nginx is the public front door.
module.exports = {
  apps: [
    {
      name: "waffle-story",
      cwd: __dirname + "/..",
      script: "node_modules/next/dist/bin/next",
      args: "start -H 127.0.0.1 -p 3000",
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
