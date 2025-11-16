# 🚀 Database Migration Guide

## Overview
This migration adds critical missing tables and columns required for GlobeSoS to function properly.

## What This Migration Does

### 1. Creates `push_subscriptions` Table
- Stores web push notification subscriptions for users
- Required by `/api/push` endpoint
- Includes RLS policies for security
- Auto-generates `endpoint` field from JSONB for faster queries

### 2. Fixes `chat_messages` Table
- Adds `sender_type` column (user/responder/admin)
- Required by `components/chat-interface.tsx`
- Automatically updates existing rows based on user roles

### 3. Enhances `notifications` Table
- Adds `type` column (info/warning/error/success/alert)
- Adds `priority` column (low/normal/high/urgent)
- Adds `message` column (alias for body, used by push API)

### 4. Performance Improvements
- Adds indexes on `user_id` and `endpoint` in push_subscriptions
- Creates triggers for automatic `updated_at` timestamp updates

---

## 📋 Prerequisites

Before running this migration:

1. ✅ `setup-database.sql` must be executed first
2. ✅ Supabase project is set up
3. ✅ Environment variables are configured in `.env.local`

---

## 🔧 Step-by-Step Instructions

### Step 1: Verify Current Database State

Run the verification script to see what's missing:

```bash
node verify-migration.js
```

**Expected Output (BEFORE migration):**
```
❌ Table missing: push_subscriptions
⚠️  Missing columns in chat_messages: sender_type
⚠️  Missing columns in notifications: type, priority, message
```

### Step 2: Run the Migration

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project → **SQL Editor**
3. Click "New Query"
4. Open `add-missing-tables.sql` in your editor
5. **Copy the entire contents**
6. **Paste into Supabase SQL Editor**
7. Click **"Run"** button

**Expected Output:**
```
NOTICE: Starting migration to add missing tables and columns...
NOTICE: ✅ push_subscriptions table created successfully
NOTICE: ✅ Added sender_type column to chat_messages
NOTICE: ✅ Updated sender_type for existing chat_messages
NOTICE: ✅ Added type column to notifications
NOTICE: ✅ Added priority column to notifications
NOTICE: ✅ Added message column to notifications
NOTICE: ✅ Created updated_at trigger for push_subscriptions
NOTICE: ✅ Granted permissions to authenticated users
NOTICE: 🎉 Migration completed successfully!
```

### Step 3: Verify Migration Success

Run the verification script again:

```bash
node verify-migration.js
```

**Expected Output (AFTER migration):**
```
✅ Table exists: profiles
✅ Table exists: alerts
✅ Table exists: responders
✅ Table exists: responder_locations
✅ Table exists: notifications
   ✅ All required columns present
✅ Table exists: chat_messages
   ✅ All required columns present
✅ Table exists: push_subscriptions
   ✅ All required columns present

🎉 SUCCESS! All required tables and columns are present.
```

---

## 🔄 Rollback (If Needed)

If something goes wrong, you can rollback the migration:

1. Go to Supabase Dashboard → SQL Editor
2. Open `rollback-migration.sql`
3. Copy and paste into SQL Editor
4. Click "Run"

**⚠️ WARNING:** This will delete the `push_subscriptions` table and remove added columns!

---

## 🧪 Testing After Migration

### Test 1: Push Subscriptions Table

```sql
-- In Supabase SQL Editor
SELECT * FROM push_subscriptions LIMIT 5;
```

### Test 2: Chat Messages with sender_type

```sql
SELECT id, sender_id, sender_type, content 
FROM chat_messages 
LIMIT 5;
```

### Test 3: Notifications with new columns

```sql
SELECT id, title, type, priority, message 
FROM notifications 
LIMIT 5;
```

### Test 4: API Endpoints

Start your dev server:
```bash
npm run dev
```

Test push notification API:
```bash
curl -X POST http://localhost:3000/api/push \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "test-user-id",
    "title": "Test Notification",
    "message": "Testing push subscriptions",
    "type": "info",
    "priority": "normal"
  }'
```

---

## 📊 Database Schema After Migration

### Tables (7 total):
1. ✅ `profiles` - User profiles
2. ✅ `alerts` - Emergency alerts
3. ✅ `responders` - Responder profiles
4. ✅ `responder_locations` - Real-time location tracking
5. ✅ `notifications` - User notifications (with type, priority, message)
6. ✅ `chat_messages` - Emergency chat (with sender_type)
7. ✅ `push_subscriptions` - **NEW** - Web push subscriptions

### Key Relationships:
- `push_subscriptions.user_id` → `profiles.id`
- `notifications.user_id` → `profiles.id`
- `chat_messages.sender_id` → `profiles.id`
- All tables have RLS policies enabled

---

## ❓ Troubleshooting

### Error: "relation does not exist"
**Solution:** Run `setup-database.sql` first, then this migration.

### Error: "column already exists"
**Solution:** Migration is idempotent - it checks before adding columns. Safe to re-run.

### Error: "permission denied"
**Solution:** Make sure you're using the Supabase SQL Editor, not the client.

### Verification script shows missing columns
**Solution:** 
1. Check if migration ran successfully (look for success notices)
2. Try refreshing schema cache: restart your dev server
3. Re-run migration (it's safe to run multiple times)

---

## 🎯 Next Steps After Migration

1. ✅ Run `node verify-migration.js` to confirm success
2. ✅ Configure environment variables (see `.env.example`)
3. ✅ Generate VAPID keys for push notifications
4. ✅ Test push notification flow
5. ✅ Test chat functionality with sender_type
6. ✅ Start development: `npm run dev`

---

## 📝 Files in This Migration

- `add-missing-tables.sql` - Main migration script
- `verify-migration.js` - Verification tool
- `rollback-migration.sql` - Rollback script
- `MIGRATION-GUIDE.md` - This guide

---

## 🆘 Need Help?

If you encounter issues:
1. Check Supabase SQL Editor for error messages
2. Run `node verify-migration.js` for detailed status
3. Review RLS policies in Supabase Dashboard
4. Check browser console for client-side errors
5. Verify environment variables are set correctly

---

**Last Updated:** November 15, 2025  
**Migration Version:** 1.0  
**Tested on:** Supabase PostgreSQL 15
