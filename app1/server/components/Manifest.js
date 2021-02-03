module.exports = (request) => {
  const staticPath = request.app.locals.staticPath;

  const manifest = {
    "name": "RAI UX",
    "short_name": "RAI UX",
    "background_color": "#ffffff",
    "theme_color": "#0094dd",
    "start_url": "/",
    "display": "standalone",
    "icons": [
    ]
  };
  
  return JSON.stringify(manifest);
}
