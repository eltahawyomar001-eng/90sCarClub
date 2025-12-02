# BVCC Admin Panel Instructions

## Important: How Admin Changes Work

The admin panel at `https://90s-car-club.vercel.app/admin.html` allows you to edit content, but **changes are stored in your browser only** (LocalStorage).

### To Apply Changes to the Live Site:

#### Option 1: Quick Updates (Current System)
1. Visit `https://90s-car-club.vercel.app/admin.html`
2. Login with password: `bvcc2024`
3. Edit any section (Hero, About, Location, Fleet, Membership)
4. Click "Save Changes"
5. Open browser console (Right-click → Inspect → Console tab)
6. Copy the JSON data shown
7. Email the JSON to your developer
8. Developer updates the HTML and pushes to GitHub
9. Vercel auto-deploys the changes (takes ~2 minutes)

#### Option 2: Direct File Access (For Tech-Savvy Users)
If you have GitHub access:
1. Make changes in admin panel
2. Copy the JSON from console
3. Update `index.html` with new text
4. Commit to GitHub
5. Vercel auto-deploys

### Waitlist Submissions
- Submissions are stored in browser LocalStorage only
- To export submissions:
  1. Go to Admin Panel → Waitlist tab
  2. Open console
  3. Type: `localStorage.getItem('bvcc_submissions')`
  4. Copy the data and save to a file

## Future Improvements

For fully automated content management (no developer needed), we can implement:

1. **Vercel Serverless Functions + Database**
   - Store content in Vercel KV or PostgreSQL
   - Admin changes update the database
   - Website reads from database
   - Cost: ~$20/month

2. **Netlify CMS**
   - Git-based CMS
   - Changes commit directly to GitHub
   - Free tier available

3. **Contentful / Sanity**
   - Full headless CMS
   - More features but more expensive
   - Starting at $99/month

---

## Current Setup Summary

**Admin URL:** https://90s-car-club.vercel.app/admin.html  
**Password:** bvcc2024  
**Deployment:** Auto-deploys from GitHub  
**Content Updates:** Require developer assistance
