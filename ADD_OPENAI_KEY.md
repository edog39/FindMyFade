# 🔑 How to Add Your OpenAI API Key

Your `.env.local` file is ready! Now you just need to add your actual API key.

---

## 📋 **QUICK STEPS:**

### **Step 1: Get Your API Key** (2 minutes)

1. Go to: **https://platform.openai.com/api-keys**
2. Sign up or log in
3. Click **"Create new secret key"**
4. Give it a name like "FindMyFade"
5. **Copy the key** (starts with `sk-proj-...`)

⚠️ **IMPORTANT:** Save it now! You can only see it once!

---

### **Step 2: Add Key to .env.local** (30 seconds)

#### **Option A: Manual Edit**

1. Open `.env.local` in your editor
2. Find this line:
```bash
OPENAI_API_KEY=sk-proj-REPLACE_THIS_WITH_YOUR_ACTUAL_API_KEY
```

3. Replace `sk-proj-REPLACE_THIS_WITH_YOUR_ACTUAL_API_KEY` with your real key:
```bash
OPENAI_API_KEY=sk-proj-abc123def456...
```

4. Save the file

#### **Option B: Terminal Command**

Run this (replace with your actual key):
```bash
cd /Users/ethanpeterson/.cursor-tutor
# Replace the placeholder with your real key
sed -i '' 's/sk-proj-REPLACE_THIS_WITH_YOUR_ACTUAL_API_KEY/sk-proj-YOUR_REAL_KEY_HERE/' .env.local
```

---

### **Step 3: Restart Dev Server** (10 seconds)

```bash
# Stop the current server (Ctrl+C if running)
# Then restart:
npm run dev
```

---

## ✅ **VERIFY IT'S WORKING:**

### **1. Go to AI Style Page:**
```
http://localhost:3000/ai-style
```

### **2. Open Browser Console:**
- Press `F12` (Windows/Linux)
- Press `Cmd+Option+J` (Mac)

### **3. Upload a Photo**

### **4. Check Console Messages:**

**✅ SUCCESS - You'll see:**
```
🤖 Calling OpenAI Vision API for face analysis...
✅ AI Analysis complete: { faceShape: "Oval", ... }
🎉 Using REAL OpenAI Vision AI!
```

**❌ STILL MOCK AI - You'll see:**
```
⚠️ Using mock AI (no OpenAI API key found)
```

If you see the warning:
- Double-check your API key is correct
- Make sure you restarted the dev server
- Check for any spaces/quotes around the key

---

## 🚀 **ADD TO VERCEL TOO:**

Once it works locally, add to Vercel:

1. Go to: **https://vercel.com/your-username/findmyfade**
2. Click **Settings** → **Environment Variables**
3. Click **Add New**
4. Name: `OPENAI_API_KEY`
5. Value: Your API key (`sk-proj-...`)
6. Environments: ✅ Production, ✅ Preview, ✅ Development
7. Click **Save**
8. **Redeploy** (or just push new code to trigger deployment)

---

## 💰 **FREE CREDITS:**

OpenAI gives you **$5 free credits** when you sign up!

That's **1,000 free face analyses** (at $0.005 per image)

---

## 🆘 **NEED HELP?**

### **"Can't find API key page"**
Direct link: https://platform.openai.com/api-keys

### **"Key doesn't work"**
- Make sure it starts with `sk-proj-` or `sk-`
- No spaces before/after the key
- No quotes around it in `.env.local`
- Restart dev server after adding

### **"Still shows mock AI"**
```bash
# Check if key is in .env.local
cat .env.local | grep OPENAI

# Should show:
OPENAI_API_KEY=sk-proj-your-key-here

# If it shows the placeholder, you need to replace it
```

### **"Rate limit exceeded"**
You've used all your free credits. Add a payment method at:
https://platform.openai.com/account/billing

---

## 📊 **MONITOR USAGE:**

Check your usage at: https://platform.openai.com/usage

Set spending limits: https://platform.openai.com/account/billing/limits

---

## 🎉 **YOU'RE DONE!**

Once you add the key:
- ✅ Real AI face analysis
- ✅ Accurate recommendations
- ✅ Professional results
- ✅ Happy users!

**Your app just got REAL AI powers!** 🚀

