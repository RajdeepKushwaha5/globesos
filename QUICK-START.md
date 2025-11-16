# 🚀 Quick Start Checklist

## ✅ Setup Verification Checklist

### Step 1: Prerequisites
- [ ] Node.js 18+ installed (`node --version`)
- [ ] pnpm installed (`pnpm --version`)
- [ ] Supabase account created
- [ ] `.env.local` file created from `.env.example`

### Step 2: Install Dependencies
```bash
pnpm install
```
- [ ] Dependencies installed without errors

### Step 3: Database Setup
- [ ] Created Supabase project
- [ ] Ran `setup-database.sql` in Supabase SQL Editor
- [ ] Ran `add-missing-tables.sql` in Supabase SQL Editor
- [ ] Verified with `node verify-migration.js` (all ✅ green)

### Step 4: Environment Variables
- [ ] `NEXT_PUBLIC_SUPABASE_URL` set
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` set
- [ ] `SUPABASE_SERVICE_ROLE_KEY` set
- [ ] Generated VAPID keys (`npx web-push generate-vapid-keys`)
- [ ] `NEXT_PUBLIC_VAPID_PUBLIC_KEY` set
- [ ] `VAPID_PRIVATE_KEY` set
- [ ] `GOOGLE_AI_API_KEY` set (get from https://makersuite.google.com/app/apikey)

### Step 5: Test Database Connection
```bash
node verify-setup.js
```
- [ ] All 7 tables accessible ✅
- [ ] No connection errors

### Step 6: Start Development Server
```bash
npm run dev
```
- [ ] Server starts on http://localhost:3000
- [ ] No compilation errors
- [ ] Homepage loads correctly

### Step 7: Test Core Features
- [ ] Can register a new account
- [ ] Can login with credentials
- [ ] Dashboard loads after login
- [ ] Map view displays (OpenStreetMap tiles load)
- [ ] Can view active alerts
- [ ] Real-time subscriptions working (check browser console)

---

## 🐛 Troubleshooting Quick Fixes

### Database Connection Error
```bash
# Verify environment variables
cat .env.local | grep SUPABASE

# Test connection
node verify-setup.js
```

### Push Notifications Not Working
```bash
# Generate new VAPID keys
npx web-push generate-vapid-keys

# Update .env.local with new keys
# Restart dev server
```

### Real-time Updates Not Working
1. Check browser console for WebSocket errors
2. Verify Supabase Realtime is enabled (Supabase Dashboard → Database → Replication)
3. Check RLS policies allow your user to subscribe

### AI Translation Errors
1. Verify `GOOGLE_AI_API_KEY` is set correctly
2. Check API quota: https://makersuite.google.com/app/apikey
3. Ensure Gemini API is enabled in Google Cloud Console

---

## 📊 Expected Database Tables (7 Total)

After successful migration, you should have:

1. ✅ `profiles` - User profiles and roles
2. ✅ `alerts` - Emergency alerts
3. ✅ `responders` - Responder profiles
4. ✅ `responder_locations` - GPS tracking
5. ✅ `notifications` - User notifications
6. ✅ `chat_messages` - Emergency chat
7. ✅ `push_subscriptions` - Push notification subscriptions

Verify with:
```bash
node verify-migration.js
```

---

## 🎯 Quick Test Commands

```bash
# Verify all database tables
node verify-migration.js

# Test database setup
node verify-setup.js

# Check for TypeScript errors
npm run type-check

# Run development server
npm run dev

# Build for production
npm run build
```

---

## 📝 Common Tasks

### Add Sample Data
```sql
-- Run in Supabase SQL Editor
-- Copy/paste from sample-data.sql (if it exists)
```

### Reset Database
```sql
-- ⚠️ WARNING: This deletes ALL data
-- Run rollback-migration.sql
-- Then run setup-database.sql
-- Then run add-missing-tables.sql
```

### Generate New VAPID Keys
```bash
npx web-push generate-vapid-keys
```

### Check Supabase Logs
Go to: Supabase Dashboard → Logs → Database/API/Realtime

---

## 🆘 Still Having Issues?

1. Check the full logs in terminal
2. Check browser console (F12)
3. Review Supabase Dashboard → Logs
4. Verify all environment variables are set
5. Ensure database migration completed successfully
6. Try restarting the dev server

---

## 🎉 Success Criteria

You'll know everything is working when:
- ✅ `node verify-migration.js` shows all green checkmarks
- ✅ Dev server starts without errors
- ✅ You can register/login
- ✅ Dashboard displays correctly
- ✅ Map loads with OpenStreetMap tiles
- ✅ Real-time features work (alerts update automatically)
- ✅ Browser console shows no critical errors

**Ready to build? Start coding! 🚀**
