# 🤖 Chatbot Testing Instructions

## ✅ Server is Running!

Your development server is now running at:
- **Local**: http://localhost:3000
- **Network**: http://192.168.228.1:3000

---

## 🧪 How to Test the Chatbot

### Option 1: Test Page (Recommended)
Visit the dedicated test page:
```
http://localhost:3000/test-chatbot.html
```

This page:
- ✅ Shows clear instructions
- ✅ Lists what to look for
- ✅ Provides test questions
- ✅ Has troubleshooting tips

### Option 2: Homepage
Visit the main homepage:
```
http://localhost:3000
```

The chatbot should appear on ALL pages of the application.

---

## 👀 What You Should See

### Chatbot Button
- **Location**: Bottom-right corner of the page
- **Color**: **ORANGE** (not green!)
- **Animation**: Pulsing glow effect
- **Shape**: Circular button with chat icon

### When You Click It
- Chat window opens
- **Header**: Orange background
- **Bot messages**: Light gray bubbles
- **Your messages**: Orange bubbles
- **Send button**: Orange

---

## 🎨 Color Scheme

The chatbot uses **ORANGE** colors to stand out from your green theme:

| Element | Color |
|---------|-------|
| Button | Orange (#ff9800) |
| Button Hover | Dark Orange (#f57c00) |
| Chat Header | Orange Gradient |
| User Messages | Orange |
| Bot Messages | Light Gray |
| Send Button | Orange |

---

## 🔍 Troubleshooting

### If Chatbot Doesn't Appear

**Step 1: Wait**
- Scripts may take 5-10 seconds to load
- Refresh the page if needed

**Step 2: Check Browser Console**
1. Press `F12` to open DevTools
2. Go to "Console" tab
3. Look for errors (red text)
4. Common errors:
   - Network errors (check internet)
   - CORS errors (contact Botpress support)
   - Script loading failures

**Step 3: Check Network Tab**
1. Open DevTools (F12)
2. Go to "Network" tab
3. Refresh page
4. Look for requests to:
   - `cdn.botpress.cloud`
   - `files.bpcontent.cloud`
5. Verify they return `200` status

**Step 4: Clear Cache**
```
Windows: Ctrl + Shift + Delete
Mac: Cmd + Shift + Delete
```
- Clear cached images and files
- Refresh page

**Step 5: Try Different Browser**
- Chrome (recommended)
- Firefox
- Edge
- Safari

### If Chatbot Appears But Doesn't Respond

**Possible Causes:**
1. Chatbot not published in Botpress
2. Chatbot is offline
3. Configuration error
4. Not trained yet

**Solutions:**
1. Log into Botpress dashboard
2. Check chatbot status (should be "Published")
3. Test in Botpress emulator
4. Verify training data uploaded

---

## 📝 Test Checklist

### Visual Tests
- [ ] Chatbot button appears
- [ ] Button is ORANGE (not green)
- [ ] Button has pulsing animation
- [ ] Button is in bottom-right corner
- [ ] Button is clickable

### Functional Tests
- [ ] Click button opens chat
- [ ] Can type in message box
- [ ] Can send messages
- [ ] Bot responds to messages
- [ ] Can close chat window
- [ ] Can reopen chat window
- [ ] Conversation persists

### Styling Tests
- [ ] Chat header is orange
- [ ] User messages are orange
- [ ] Bot messages are light gray
- [ ] Send button is orange
- [ ] Overall design looks good

### Page Tests
Test on these pages:
- [ ] Homepage (/)
- [ ] Login (/auth/login)
- [ ] Register (/auth/register)
- [ ] Jobs page (/jobs) - requires login
- [ ] Employee dashboard - requires login
- [ ] Employer dashboard - requires login

### Mobile Tests (Optional)
- [ ] Open on mobile device
- [ ] Button appears correctly
- [ ] Chat interface is responsive
- [ ] Can type on mobile keyboard
- [ ] Messages are readable

---

## 💬 Test Questions

Ask the chatbot these questions to test functionality:

### Basic Questions
1. "Hello"
2. "How do I create an account?"
3. "How do I apply for a job?"
4. "Is this platform free?"

### Registration Questions
5. "What is a National ID?"
6. "What are the password requirements?"
7. "I forgot my password"

### Job Application Questions
8. "How do I search for jobs?"
9. "Can I apply for the same job twice?"
10. "What does shortlisted mean?"

### Employer Questions
11. "How do I post a job?"
12. "How do I view applicants?"
13. "How do I delete a job?"

---

## 🎯 Expected Behavior

### First Time Opening
1. Chatbot button appears after page loads
2. Button pulses to attract attention
3. Click opens chat interface
4. Welcome message appears
5. Can start typing immediately

### Conversation Flow
1. Type message
2. Press Enter or click Send
3. Bot shows "typing..." indicator
4. Bot responds with answer
5. Can continue conversation
6. Can ask follow-up questions

### Closing and Reopening
1. Click X or outside chat to close
2. Conversation is saved
3. Click button to reopen
4. Previous messages still visible
5. Can continue where left off

---

## 🚀 Next Steps After Testing

### If Everything Works ✅
1. Test on all major pages
2. Test on mobile devices
3. Train chatbot with documentation
4. Deploy to production
5. Monitor user interactions

### If Issues Found ❌
1. Document the issue
2. Check browser console for errors
3. Try test-chatbot.html page
4. Contact support if needed

---

## 📞 Support

### Technical Issues
- Check browser console (F12)
- Review this troubleshooting guide
- Contact: jobconnect@gmail.com

### Botpress Issues
- Botpress Support: support@botpress.com
- Documentation: https://botpress.com/docs
- Community: https://discord.gg/botpress

---

## 🎨 Customization

### Change Button Color
Edit `src/components/BotpressChatbot.tsx`:
```typescript
// Change #ff9800 to your preferred color
background: linear-gradient(135deg, #YOUR_COLOR 0%, #DARKER_SHADE 100%)
```

### Change Button Position
Add to the style section:
```css
#bp-web-widget-container {
  bottom: 20px !important;
  right: 20px !important;
  /* Or for left side: */
  /* left: 20px !important; */
}
```

### Disable Pulse Animation
Remove or comment out:
```css
animation: pulse-orange 2s infinite;
```

---

## 📊 Performance Notes

- Chatbot loads asynchronously (doesn't block page)
- Scripts are cached after first load
- Minimal impact on page load time
- Works offline after initial load (cached)

---

## ✨ Features

### Current Features
- ✅ Orange theme (stands out from green)
- ✅ Pulsing animation
- ✅ Smooth hover effects
- ✅ Responsive design
- ✅ Available on all pages
- ✅ Conversation persistence

### Planned Features
- 🔜 Multilingual support (Kinyarwanda, French)
- 🔜 Proactive chat triggers
- 🔜 User role detection
- 🔜 Context-aware responses
- 🔜 Integration with backend

---

## 🎉 Success Criteria

Your chatbot integration is successful if:

1. ✅ Button appears on all pages
2. ✅ Button is clearly visible (orange color)
3. ✅ Chat opens when clicked
4. ✅ Can send and receive messages
5. ✅ Styling matches design (orange theme)
6. ✅ Works on desktop and mobile
7. ✅ No console errors
8. ✅ Page loads quickly

---

## 📝 Quick Commands

### Start Development Server
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

### Test Build Locally
```bash
npm run build
npm start
```

### Stop Development Server
```
Ctrl + C (in terminal)
```

---

## 🔗 Important URLs

- **Test Page**: http://localhost:3000/test-chatbot.html
- **Homepage**: http://localhost:3000
- **Login**: http://localhost:3000/auth/login
- **Register**: http://localhost:3000/auth/register

---

*Happy Testing! 🚀*

If you see the orange chatbot button pulsing in the bottom-right corner, congratulations - your integration is working! 🎉
