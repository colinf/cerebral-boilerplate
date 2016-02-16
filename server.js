import path from 'path';
import express from 'express';
import webpack from 'webpack';
import {ServerController} from 'cerebral';
import {Container} from 'cerebral-view-react';
import webpackMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import config from './webpack.config.js';
import fs from 'fs';

const isDeveloping = process.env.NODE_ENV !== 'production';
const port = isDeveloping ? 3000 : process.env.PORT;
const app = express();

app.get('/favicon.ico', (req, res) => {
  res.status(404);
  res.send();
});

if (isDeveloping) {
  const compiler = webpack(config);
  const middleware = webpackMiddleware(compiler, {
    publicPath: config.output.publicPath,
    contentBase: 'src',
    stats: {
      colors: true,
      hash: false,
      timings: true,
      chunks: false,
      chunkModules: false,
      modules: false
    }
  });

  app.use(middleware);
  app.use(webpackHotMiddleware(compiler));
  app.get('*', (req, res) => {
    res.type('html');
    res.send(middleware.fileSystem.readFileSync(path.join(__dirname, 'dist/index.html')).toString());
  });
} else {
  app.get('*', (req, res) => {
    res.type('html');
    res.send(fs.readFileSync(path.join(__dirname, 'dist/index.html')).toString());
  });
}

app.listen(port, '0.0.0.0', (err) => {
  if (err) {
    console.log(err);
  }
  console.info('==> 🌎 Listening on port %s. Open up http://0.0.0.0:%s/ in your browser.', port, port);
});
