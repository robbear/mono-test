# mono-test
Monorepo for testing multiple web app development and deployment

## Heroku Deployment

Add the following environment variables
```
APP_BASE=relative/path/to/app_directory
NODE_MODULES_CACHE=false
```

Add buildpacks in the following order:
```
https://github.com/robbear/heroku-buildpack-nodejs-monorepo
heroku/nodejs
```
