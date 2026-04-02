import express from 'express';
import cors from 'cors';
import { getConfig } from './config';
import { createAssetSignRouter } from './assetSignRoute';
import { createServerInfoRouter } from './serverInfoRoute';
import { createArticleRouter } from './articleRoute';
import { createAuthRouter } from './authRoute';
import { createBannerRouter } from './bannerRoute';

const app = express();
const cfg = getConfig();

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ ok: true, service: 'backend', timestamp: new Date().toISOString() });
});

app.use('/api/assets', createAssetSignRouter());
app.use('/api/server-info', createServerInfoRouter());
app.use('/api/articles', createArticleRouter());
app.use('/api/auth', createAuthRouter());
app.use('/api/banners', createBannerRouter());

app.listen(cfg.api.port, () => {
  // eslint-disable-next-line no-console
  console.log(`Backend running at http://localhost:${cfg.api.port}`);
});

