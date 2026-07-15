# EarnHub - Watch Ads & Earn Money

## 🌐 Live Site
**https://free-earn-hub.com**

## 🤖 Telegram Bot
**Bot**: @earn_hub_task_bot  
**Commands**: `/start` - Open app, `/balance` - Check balance, `/referral` - Get referral link

## 🔑 Admin Panel
**URL**: `https://free-earn-hub.com/admin`  
**Username**: `admin`  
**Password**: `admin123`

## 🚀 Deploy on Render

### Connect Your Custom Domain
1. Buy `free-earn-hub.com` from any domain registrar
2. In Render dashboard → Your service → **Settings → Custom Domain**
3. Add `free-earn-hub.com` and follow DNS instructions
4. Add these DNS records at your registrar:
   ```
   Type: CNAME  Name: @  Target: your-app.onrender.com
   Type: CNAME  Name: www  Target: your-app.onrender.com
   ```

### One-Click Deploy (Blueprint)
1. Go to https://render.com → Sign Up
2. Click **New + → Blueprint**
3. Connect repo: `PNT-TIGER/EarnHub-BD`
4. Click **Apply**

### Manual Deploy
1. https://render.com → Sign Up
2. **New + → Web Service**
3. Connect `PNT-TIGER/EarnHub-BD`
4. Set:
   - **Name**: `earnhub-web`
   - **Runtime**: `Node`
   - **Build**: `npm install`
   - **Start**: `node server.js`
5. Add Environment Variables:
   - `TELEGRAM_BOT_TOKEN` = `8932261850:AAFDn7uS5yNkSVTWQ6b4_B-1y3lK-37y3ME`
   - `WEBAPP_URL` = `https://free-earn-hub.com`
   - `ADMIN_CHAT_ID` = `7797816241`
6. Click **Create Web Service**

For the bot, create another **Worker** service with `node bot.js`.

## 📋 Features
- User registration & login
- Watch ads & earn money
- Complete tasks & earn
- Referral system (10% commission)
- Withdraw to USDT BEP20 (min $1)
- Gift codes
- Admin panel with full control
- Telegram bot integration

## 📦 Local Run
```bash
npm install
node server.js     # Web app on port 4000
node bot.js        # Telegram bot
```
