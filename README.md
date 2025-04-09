# Nuxt Minimal Starter

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

## Cloudflare Pages 部署

本專案可以部署到 Cloudflare Pages，請按照以下步驟進行：

### 本地準備

1. 安裝 Wrangler CLI：
   ```bash
   npm install -g wrangler
   ```

2. 登入 Cloudflare 帳號：
   ```bash
   wrangler login
   ```

3. 建置專案：
   ```bash
   npm run build
   ```

4. 本地測試（選擇性）：
   ```bash
   npm run pages:dev
   ```

### 部署到 Cloudflare Pages

方法一：使用 Wrangler CLI 部署：
```bash
npm run pages:deploy
```

方法二：通過 Cloudflare 控制台部署：
1. 在 Cloudflare Dashboard 中創建一個新的 Pages 專案
2. 連接您的 GitHub 儲存庫
3. 設定構建配置：
   - 構建命令：`npm run build`
   - 構建輸出目錄：`.output/public`
4. 在環境變數中添加專案所需的環境變數

### 環境變數設定

在 Cloudflare Pages 控制台中，需要添加以下環境變數：
- `SESSION_SECRET`: 用於加密會話資料
- `MONGODB_URI`: MongoDB 連接字串
- 其他專案需要的環境變數
