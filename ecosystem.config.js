/**
 * PM2 ecosystem del Gateway (Demon).
 * Uso:  pm2 start ecosystem.config.js && pm2 save
 * Compilar antes con: npm run build   (arranca desde dist/)
 */
module.exports = {
  apps: [
    {
      name: 'gateway',
      script: 'dist/src/index.js',
      cwd: __dirname,
      exec_mode: 'fork',
      autorestart: true,
    },
  ],
};
