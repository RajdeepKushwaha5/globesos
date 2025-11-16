# SOS V2 Quick Testing Guide

## 🚀 Quick Start

1. **Run the development server:**
   ```bash
   npm run dev
   ```

2. **Navigate to:** `http://localhost:3000`

3. **Scroll to:** "Emergency SOS System" section

---

## ✅ 5-Minute Test Suite

### Test 1: Voice Input (2 min)
1. Click "Medical Emergency"
2. Click "Start Voice Input"
3. Grant microphone permission
4. Say: "I need help, I'm dizzy and can't stand"
5. Wait 2 seconds (auto-stop)
6. **✓ Check:** Transcript appears in message field

### Test 2: File Upload (1 min)
1. Click the upload area OR drag an image
2. Select 1-2 photos from your computer
3. **✓ Check:** Progress bar fills, thumbnail appears, "Uploaded" checkmark

### Test 3: Quick SOS (1 min)
1. Select "Fire Emergency"
2. Click "Send Quick SOS"
3. Grant location permission
4. **✓ Check:** 
   - Success toast appears
   - Timer starts counting down (120s)
   - Alert ID displayed
   - Progress bar animates

### Test 4: Detailed SOS (1 min)
1. Select "Security Threat"
2. Type message: "Someone is following me"
3. Add voice: "I'm near Main Street"
4. Upload 1 photo
5. Click "Send Emergency Alert"
6. **✓ Check:** All 4 badges show (Location, Voice, Files, Translation)

### Test 5: Cancel Alert (30 sec)
1. After sending SOS
2. Click "Cancel Alert"
3. **✓ Check:** Returns to initial state, timer stops

---

## 🧪 Error Scenarios (Optional)

### Test 6: Location Denied
1. Block location permission in browser
2. Try sending SOS
3. **✓ Check:** Alert still sends with warning toast

### Test 7: Voice Not Supported
1. Open in Firefox (if available)
2. Try voice input
3. **✓ Check:** Shows helpful fallback message

### Test 8: File Too Large
1. Try uploading file > 10MB
2. **✓ Check:** Error message appears

---

## 📊 Expected Results

| Feature | Status | Notes |
|---------|--------|-------|
| Voice Input | ✅ Working | Chrome/Edge full support |
| File Upload | ✅ Working | Drag-and-drop supported |
| Quick SOS | ✅ Working | < 3 seconds to send |
| Detailed SOS | ✅ Working | All fields captured |
| Timer | ✅ Working | Counts down from 120s |
| Cancel | ✅ Working | Clears all state |
| Location Fallback | ✅ Working | Uses 0,0 if denied |
| Timeout Handling | ✅ Working | 15s limit |

---

## 🐛 If Something Fails

1. **Check browser console** (F12) for errors
2. **Verify permissions** (location, microphone)
3. **Try different browser** (Chrome recommended)
4. **Clear cache** and reload
5. **Check network tab** for failed requests

---

## 📸 Visual Checks

- [ ] Emergency type cards have gradient backgrounds
- [ ] Voice recording shows 3 pulsing bars
- [ ] File thumbnails display for images
- [ ] Progress bar fills smoothly
- [ ] Toast notifications appear (not alert dialogs)
- [ ] Timer shows MM:SS format
- [ ] Alert ID is displayed
- [ ] Feature badges light up

---

## ✨ Success Criteria

**All tests pass if:**
1. Voice input works OR shows helpful fallback
2. Files upload with progress indication
3. SOS alerts send in < 15 seconds
4. Timer counts down correctly
5. No console errors (warnings OK)
6. UI is responsive and smooth
7. All buttons work as expected

---

## 📞 Need Help?

- See `SOS-V2-DOCUMENTATION.md` for detailed guide
- Check console for debug logs
- Enable debug: `localStorage.setItem('DEBUG_SOS', 'true')`

---

**Testing Time:** ~5-10 minutes  
**Last Updated:** January 2025
