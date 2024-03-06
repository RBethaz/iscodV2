module.exports = {
  apps: [
    {
      name: "app",
      script: "./www/app.js",
      env_production: {
        NODE_ENV: "production",
      },
      error_file: "/logs/err.log", // Chemin du fichier log en cas d'erreur
      max_memory_restart: "200M", // Utilisation maximale de la mémoire avant de redémarrer
    },
  ],
};
