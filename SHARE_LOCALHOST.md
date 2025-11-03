# 🌐 Share Your FindMyFade Localhost

## Quick Setup with ngrok (Recommended)

### Step 1: Install ngrok
```bash
# On Mac (using Homebrew)
brew install ngrok/ngrok/ngrok

# Or download from: https://ngrok.com/download
```

### Step 2: Start Your App
```bash
cd /Users/ethanpeterson/.cursor-tutor/findmyfade
npm run dev
```

Your app will be running on `http://localhost:3000`

### Step 3: Create Tunnel
**Open a NEW terminal** and run:
```bash
ngrok http 3000
```

### Step 4: Share the URL
You'll see output like this:
```
Session Status                online
Account                       Your Name (Plan: Free)
Version                       3.x.x
Region                        United States (us)
Latency                       -
Web Interface                 http://127.0.0.1:4040
Forwarding                    https://abc123.ngrok.io -> http://localhost:3000

Connections                   ttl     opn     rt1     rt5     p50     p90
                              0       0       0.00    0.00    0.00    0.00
```

**Share this URL:** `https://abc123.ngrok.io`

Anyone with this link can now access your app! 🎉

---

## 🔒 Security Notes

### ngrok Free Tier:
- ✅ URL changes each time you restart
- ✅ Session expires after 2 hours (free tier)
- ✅ HTTPS encryption included
- ⚠️ Anyone with the link can access

### To Keep it Private:
1. **Only share with trusted people**
2. **Don't post the URL publicly**
3. **Restart ngrok** when you're done (URL becomes invalid)

### For Production:
- ngrok offers paid plans with:
  - Custom domains
  - Persistent URLs
  - Authentication
  - Better performance

---

## 🎯 Alternative Methods

### Method 2: localtunnel (Free, No Account)
```bash
# Install
npm install -g localtunnel

# Start app first (npm run dev)
# Then run:
lt --port 3000
```

### Method 3: Cloudflare Tunnel (Free)
```bash
# Install
brew install cloudflare/cloudflare/cloudflared

# Run
cloudflared tunnel --url http://localhost:3000
```

### Method 4: VS Code Live Share
1. Install "Live Share" extension in VS Code
2. Click "Live Share" in bottom status bar
3. Share the link
4. Collaborators can access your ports

---

## 🐛 Troubleshooting

### Port Already in Use?
```bash
# Check what's running on port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>
```

### ngrok Not Found?
```bash
# Make sure it's in your PATH
which ngrok

# If not found, reinstall:
brew reinstall ngrok
```

### App Not Loading?
1. Make sure `npm run dev` is running first
2. Check the port number (default is 3000)
3. Try restarting ngrok
4. Check firewall settings

---

## 📱 Testing on Mobile

Use the same ngrok URL on your phone to test mobile responsiveness!

---

## 💡 Pro Tips

1. **Keep ngrok running** as long as you want to share
2. **Monitor connections** at `http://localhost:4040` (ngrok dashboard)
3. **Restart for new URL** if you want to revoke access
4. **Use custom subdomain** with ngrok paid plan
5. **Add basic auth** with: `ngrok http 3000 --basic-auth="user:password"`

---

## ⚡ Quick Commands Reference

```bash
# Start app
npm run dev

# Share with ngrok
ngrok http 3000

# Share with localtunnel
lt --port 3000

# Share with Cloudflare
cloudflared tunnel --url http://localhost:3000

# Check port usage
lsof -i :3000

# Kill process on port
kill -9 $(lsof -t -i:3000)
```

---

**Need help?** Check out:
- ngrok docs: https://ngrok.com/docs
- localtunnel: https://localtunnel.github.io/www/
- Cloudflare: https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/

Happy sharing! 🚀

