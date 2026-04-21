# Email Host Implementation Guide for PeekPost

Complete guide for setting up email services and implementing email functionality in PeekPost.

---

## Table of Contents

1. [Email Providers Overview](#email-providers-overview)
2. [Gmail SMTP Setup (Easiest)](#gmail-smtp-setup-easiest)
3. [Brevo SMTP Setup (Recommended for Production)](#brevo-smtp-setup-recommended-for-production)
4. [Nodemailer Configuration](#nodemailer-configuration)
5. [Email Templates](#email-templates)
6. [PeekPost Email Features](#peekpost-email-features)
7. [Best Practices](#best-practices)
8. [Troubleshooting](#troubleshooting)

---

## Email Providers Overview (SMTP-based)

**We'll use Nodemailer with SMTP providers - no external APIs needed!**

| Provider | Cost | Limit | Best For |
|----------|------|-------|----------|
| **Gmail SMTP** | Free | 500/day | Development, small projects |
| **Brevo SMTP** | Free-Pay | 300/day free | Production (recommended) |
| **AWS SES SMTP** | Pay | Generous | Large scale |
| **Custom SMTP** | Variable | Variable | Enterprise |

### Recommendation by Stage

- **Development:** Gmail SMTP (easiest, 5 min setup)
- **Production:** Brevo SMTP (300/day free, no restrictions on content)
- **Scale:** AWS SES SMTP (cheapest at high volume)

---

## Gmail SMTP Setup (Easiest)

### Step 1: Enable 2-Factor Authentication

1. Go to https://myaccount.google.com
2. Click **Security** (left sidebar)
3. Enable **2-Step Verification**
4. Follow Google's verification process

### Step 2: Generate App Password

1. Go to https://myaccount.google.com/apppasswords
2. Select **Mail** from "Select the app"
3. Select **Windows Computer** (or your OS) from "Select the device"
4. Click **Generate**
5. Copy the 16-character password (without spaces)

```
Generated: xxxx xxxx xxxx xxxx
Remove spaces: hijeohkrsxsydkf
```

### Step 3: Configure Environment Variables

In `server/.env`:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_16_char_app_password
SMTP_FROM=noreply@peekpost.com
SMTP_SERVICE=gmail
```

### Step 4: Test Connection

```javascript
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const mailOptions = {
  from: process.env.SMTP_FROM,
  to: 'test@example.com',
  subject: 'Test Email',
  text: 'Hello from PeekPost!',
};

transporter.sendMail(mailOptions, (error, info) => {
  if (error) console.log('Error:', error);
  else console.log('Email sent:', info.response);
});
```

### Gmail Limitations

⚠️ **Limitations to consider:**

- **500 emails/day limit** (for free accounts)
- **Rate limit:** ~1 email per second
- **Can be blocked** if Google detects suspicious activity
- **Better alternative:** Use Brevo for production (see below)

---

## Brevo SMTP Setup (Recommended for Production)

**Brevo** offers free SMTP access with generous limits - perfect for production!

### Step 1: Create Brevo Account

1. Go to https://www.brevo.com
2. Sign up free (300 emails/day, no credit card needed)
3. Verify email address

### Step 2: Get SMTP Credentials

1. Go to **Settings** → **SMTP & API**
2. Click **SMTP** tab
3. Enable SMTP if not already enabled
4. Copy these details:
   - **SMTP Host:** smtp-relay.brevo.com
   - **SMTP Port:** 587 or 465
   - **SMTP User:** your-email@example.com
   - **SMTP Password:** (generate if needed)

### Step 3: Configure Environment Variables

In `server/.env`:

```env
SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=587
SMTP_USER=your_email@example.com
SMTP_PASS=your_brevo_smtp_password
SMTP_FROM=noreply@peekpost.com
SMTP_FROM_NAME=PeekPost
```

### Step 4: Test Connection

```bash
# Test SMTP connection
node -e "
import nodemailer from 'nodemailer';
const t = nodemailer.createTransport({
  host: 'smtp-relay.brevo.com',
  port: 587,
  auth: { user: 'YOUR_EMAIL', pass: 'YOUR_PASSWORD' }
});
t.verify(console.log);
"
```

### Brevo Plans

| Plan | Cost | Emails/Month | Best For |
|------|------|--------------|----------|
| Free | $0 | 300/day (9,000/mo) | Development + Production MVP |
| Starter | €20/mo | 50,000 | Growing apps |
| Business | €45/mo | Unlimited | Scale |

**Advantage:** Same SMTP approach, just higher limits!

---

## Nodemailer Configuration

### ✅ Simple SMTP-Only Setup

Create [server/config/email.js](server/config/email.js):

```javascript
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Simple SMTP configuration - works with Gmail, Brevo, AWS SES, etc.
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT || 587,
  secure: process.env.SMTP_PORT === '465', // true for 465, false for 587
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Verify connection on startup
transporter.verify((error, success) => {
  if (error) {
    console.error('Email service error:', error.message);
  } else {
    console.log('✅ Email service ready');
  }
});

export default transporter;
```

### Configuration for Different Providers

**Gmail (.env):**
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_16_char_app_password
SMTP_FROM=noreply@peekpost.com
```

**Brevo (.env):**
```env
SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=587
SMTP_USER=your_email@example.com
SMTP_PASS=your_brevo_smtp_password
SMTP_FROM=noreply@peekpost.com
```

**AWS SES (.env):**
```env
SMTP_HOST=email-smtp.region.amazonaws.com
SMTP_PORT=587
SMTP_USER=your_ses_smtp_username
SMTP_PASS=your_ses_smtp_password
SMTP_FROM=verified@yourdomain.com
```

**Custom SMTP (.env):**
```env
SMTP_HOST=smtp.yourmailserver.com
SMTP_PORT=587
SMTP_USER=your_username
SMTP_PASS=your_password
SMTP_FROM=your@email.com
```
    console.log('Email service ready:', success);
  }
});

export default transporter;
```

### Usage in Controllers

```javascript
import transporter from '../config/email.js';

export const sendWelcomeEmail = async (email, userName) => {
  const mailOptions = {
    from: process.env.SMTP_FROM,
    to: email,
    subject: 'Welcome to PeekPost!',
    html: `
      <h1>Welcome, ${userName}!</h1>
      <p>Your account has been created successfully.</p>
      <p><a href="https://peekpost.com">Visit PeekPost</a></p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Welcome email sent to:', email);
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};
```

---

## Email Templates

### Template System Setup

Create [server/views/emails/](server/views/emails/) directory with templates.

### 1. Welcome Email Template

[server/views/emails/welcome.html](server/views/emails/welcome.html):

```html
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #007bff; color: white; padding: 20px; text-align: center; }
    .content { padding: 20px; background: #f9f9f9; }
    .button { background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; }
    .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Welcome to PeekPost!</h1>
    </div>
    
    <div class="content">
      <h2>Hello {{userName}},</h2>
      <p>Your account has been created successfully. You're now part of our community!</p>
      
      <p style="margin-top: 30px;">
        <a href="{{appUrl}}/dashboard" class="button">Get Started</a>
      </p>
      
      <h3>What's Next?</h3>
      <ul>
        <li>Complete your profile</li>
        <li>Upload a profile picture</li>
        <li>Start creating posts</li>
        <li>Follow other users</li>
      </ul>
    </div>
    
    <div class="footer">
      <p>PeekPost © 2026 | All Rights Reserved</p>
      <p><a href="{{appUrl}}/settings/email">Manage Email Preferences</a></p>
    </div>
  </div>
</body>
</html>
```

### 2. Password Reset Email

[server/views/emails/password-reset.html](server/views/emails/password-reset.html):

```html
<!DOCTYPE html>
<html>
<body>
  <div class="container">
    <div class="header">
      <h1>Reset Your Password</h1>
    </div>
    
    <div class="content">
      <p>Hi {{userName}},</p>
      <p>You requested to reset your password. Click the button below:</p>
      
      <p style="margin: 30px 0;">
        <a href="{{resetLink}}" class="button">Reset Password</a>
      </p>
      
      <p><strong>Or copy this link:</strong><br>
      {{resetLink}}</p>
      
      <p style="color: #d9534f; margin-top: 30px;">
        <strong>⚠️ This link expires in 1 hour</strong>
      </p>
      
      <p>If you didn't request this, ignore this email.</p>
    </div>
    
    <div class="footer">
      <p>PeekPost Security Team</p>
    </div>
  </div>
</body>
</html>
```

### 3. Verification Email

[server/views/emails/verify-email.html](server/views/emails/verify-email.html):

```html
<!DOCTYPE html>
<html>
<body>
  <div class="container">
    <div class="header">
      <h1>Verify Your Email</h1>
    </div>
    
    <div class="content">
      <p>Hi {{userName}},</p>
      <p>Please verify your email address to activate your account:</p>
      
      <p style="margin: 30px 0;">
        <a href="{{verificationLink}}" class="button">Verify Email</a>
      </p>
      
      <p>Verification code: {{verificationCode}}</p>
      <p style="color: #666; font-size: 12px;">This link expires in 24 hours</p>
    </div>
  </div>
</body>
</html>
```

### 4. Notification Email

[server/views/emails/notification.html](server/views/emails/notification.html):

```html
<!DOCTYPE html>
<html>
<body>
  <div class="container">
    <div class="header">
      <h1>New Notification</h1>
    </div>
    
    <div class="content">
      <p>Hi {{userName}},</p>
      <p>{{notificationMessage}}</p>
      
      <p style="margin: 30px 0;">
        <a href="{{actionLink}}" class="button">View {{actionType}}</a>
      </p>
    </div>
  </div>
</body>
</html>
```

### 5. Email Digest (Weekly Summary)

[server/views/emails/digest.html](server/views/emails/digest.html):

```html
<!DOCTYPE html>
<html>
<body>
  <div class="container">
    <div class="header">
      <h1>Your Weekly Summary</h1>
    </div>
    
    <div class="content">
      <p>Hi {{userName}},</p>
      <p>Here's what happened on PeekPost this week:</p>
      
      <h3>📊 Your Activity</h3>
      <ul>
        <li>{{newFollowers}} new followers</li>
        <li>{{totalLikes}} likes on your posts</li>
        <li>{{newMessages}} new messages</li>
        <li>{{engagementRate}}% engagement rate</li>
      </ul>
      
      <h3>🔥 Trending Posts</h3>
      <ul>
        {{#trendingPosts}}
        <li><a href="{{url}}">{{title}}</a> - {{likes}} likes</li>
        {{/trendingPosts}}
      </ul>
      
      <p style="margin-top: 30px;">
        <a href="{{appUrl}}/notifications" class="button">View All</a>
      </p>
    </div>
  </div>
</body>
</html>
```

### Email Template Rendering Function

```javascript
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export function renderEmailTemplate(templateName, data) {
  const templatePath = path.join(__dirname, '../views/emails', `${templateName}.html`);
  
  let html = fs.readFileSync(templatePath, 'utf-8');
  
  // Simple template variable replacement
  Object.keys(data).forEach(key => {
    const regex = new RegExp(`{{${key}}}`, 'g');
    html = html.replace(regex, data[key]);
  });
  
  return html;
}

// Usage
import { renderEmailTemplate } from '../utils/templateRenderer.js';

const html = renderEmailTemplate('welcome', {
  userName: 'John',
  appUrl: 'https://peekpost.com'
});

await transporter.sendMail({
  from: process.env.SMTP_FROM,
  to: 'john@example.com',
  subject: 'Welcome to PeekPost',
  html: html,
});
```

---

## PeekPost Email Features

### Current Email Features

Review these files to see existing implementations:

1. **[server/controllers/auth.controller.js](server/controllers/auth.controller.js)**
   - Welcome email on registration
   - Password reset email
   - Email verification

2. **[server/utils/sendEmail.js](server/utils/sendEmail.js)**
   - Generic email sending function
   - Error handling

3. **[server/jobs/sendEmailDigest.job.js](server/jobs/sendEmailDigest.job.js)**
   - Weekly email digest
   - Scheduled job with Bull

### Recommended Implementation Features

#### 1. Email Verification

```javascript
// In auth.controller.js
export const register = async (req, res) => {
  const { email, password, username } = req.body;
  
  // Generate verification code
  const verificationCode = Math.random().toString(36).substr(2, 9);
  const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
  
  const user = new User({
    email,
    password: await bcrypt.hash(password, 10),
    username,
    emailVerified: false,
    verificationCode,
    verificationExpires,
  });
  
  await user.save();
  
  // Send verification email
  const html = renderEmailTemplate('verify-email', {
    userName: username,
    verificationLink: `${process.env.CLIENT_URL}/verify-email?code=${verificationCode}`,
    verificationCode,
  });
  
  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: email,
    subject: 'Verify Your Email - PeekPost',
    html,
  });
  
  res.json({ message: 'Check your email to verify account' });
};

// Verify email endpoint
export const verifyEmail = async (req, res) => {
  const { code } = req.body;
  
  const user = await User.findOne({
    verificationCode: code,
    verificationExpires: { $gt: new Date() },
  });
  
  if (!user) {
    return res.status(400).json({ error: 'Invalid or expired code' });
  }
  
  user.emailVerified = true;
  user.verificationCode = null;
  user.verificationExpires = null;
  await user.save();
  
  res.json({ message: 'Email verified successfully' });
};
```

#### 2. Password Reset

```javascript
// Request password reset
export const requestPasswordReset = async (req, res) => {
  const { email } = req.body;
  
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  // Generate reset token
  const resetToken = crypto.randomBytes(32).toString('hex');
  user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  user.resetPasswordExpires = new Date(Date.now() + 1 * 60 * 60 * 1000); // 1 hour
  
  await user.save();
  
  // Send reset email
  const html = renderEmailTemplate('password-reset', {
    userName: user.username,
    resetLink: `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`,
  });
  
  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: email,
    subject: 'Reset Your Password - PeekPost',
    html,
  });
  
  res.json({ message: 'Check your email for password reset link' });
};

// Reset password
export const resetPassword = async (req, res) => {
  const { token, password } = req.body;
  
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
  
  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: new Date() },
  });
  
  if (!user) {
    return res.status(400).json({ error: 'Invalid or expired token' });
  }
  
  user.password = await bcrypt.hash(password, 10);
  user.resetPasswordToken = null;
  user.resetPasswordExpires = null;
  await user.save();
  
  res.json({ message: 'Password reset successful' });
};
```

#### 3. Notification Emails

```javascript
// Send notification email when user gets liked
export const notifyUserOfLike = async (postId, userId) => {
  const post = await Post.findById(postId).populate('author');
  const user = await User.findById(userId);
  
  const html = renderEmailTemplate('notification', {
    userName: user.username,
    notificationMessage: `${post.author.username} liked your post!`,
    actionType: 'Post',
    actionLink: `${process.env.CLIENT_URL}/posts/${postId}`,
  });
  
  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: user.email,
    subject: `${post.author.username} liked your post - PeekPost`,
    html,
  });
};
```

#### 4. Email Digest Job

Already exists: [server/jobs/sendEmailDigest.job.js](server/jobs/sendEmailDigest.job.js)

```javascript
// This runs weekly automatically via Bull queue
export const sendEmailDigestJob = async () => {
  const users = await User.find({ emailNotifications: true });
  
  for (const user of users) {
    // Get user stats
    const newFollowers = await User.countDocuments({
      following: user._id,
      createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
    });
    
    const totalLikes = await Post.countDocuments({
      author: user._id,
      likes: { $gte: 1 },
      createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
    });
    
    const html = renderEmailTemplate('digest', {
      userName: user.username,
      newFollowers,
      totalLikes,
      engagementRate: calculateEngagementRate(user),
      appUrl: process.env.CLIENT_URL,
    });
    
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: user.email,
      subject: 'Your Weekly PeekPost Summary',
      html,
    });
  }
};
```

---

## Best Practices

### 1. **Environment Variables**

Never hardcode credentials:

```env
# ✅ Good
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# ❌ Bad - Never do this
const email = 'hardcoded@gmail.com';
```

### 2. **Error Handling**

```javascript
export const sendEmail = async (options) => {
  try {
    const result = await transporter.sendMail(options);
    console.log('Email sent:', result.messageId);
    return result;
  } catch (error) {
    console.error('Email error:', error);
    
    // Log to database for debugging
    await EmailLog.create({
      recipient: options.to,
      subject: options.subject,
      error: error.message,
      status: 'failed',
    });
    
    // Don't throw - continue app execution
    return null;
  }
};
```

### 3. **Rate Limiting**

```javascript
// Prevent email spam
const emailRateLimit = new Map();

export const checkEmailLimit = (email) => {
  const now = Date.now();
  const lastEmail = emailRateLimit.get(email) || 0;
  
  // Allow 1 email per 5 seconds
  if (now - lastEmail < 5000) {
    return false;
  }
  
  emailRateLimit.set(email, now);
  return true;
};

// In your controller
if (!checkEmailLimit(user.email)) {
  return res.status(429).json({ error: 'Too many emails' });
}
```

### 4. **Email Logging**

```javascript
// Track all sent emails
export const EmailLog = new mongoose.Schema({
  recipient: String,
  sender: String,
  subject: String,
  status: { type: String, enum: ['sent', 'failed', 'bounced'] },
  error: String,
  messageId: String,
  createdAt: { type: Date, default: Date.now },
});

// Log every email
await EmailLog.create({
  recipient: options.to,
  sender: options.from,
  subject: options.subject,
  status: 'sent',
  messageId: result.messageId,
});
```

### 5. **Unsubscribe Links**

```html
<!-- Always include in footer -->
<p style="font-size: 12px;">
  <a href="{{unsubscribeLink}}">Unsubscribe from emails</a> | 
  <a href="{{preferencesLink}}">Email Preferences</a>
</p>
```

### 6. **Authentication & SPF/DKIM (Optional for custom domains)**

For custom domains (optional - greatly improves deliverability):

1. **Add SPF Record** (DNS):
   - Check provider docs (Brevo, AWS SES, etc.)
   - Example: `v=spf1 include:relay.brevo.com ~all`

2. **Add DKIM** (Optional, improves authentication):
   - Generate in provider dashboard
   - Add to DNS records
   - Verify completion

3. **Test SPF/DKIM:**
   - MXToolbox: https://mxtoolbox.com/spf.aspx
   - DKIM Checker: https://www.dmarcian.com/dkim-survey/

**Note:** Not required for Brevo/Gmail/AWS free tier - they handle this automatically

---

## Troubleshooting

### Issue: "SMTP Error: Could not authenticate"

**Cause:** Wrong password or app password not generated

**Solution:**
```bash
# If using Gmail:
1. Go to https://myaccount.google.com/apppasswords
2. Generate new app password
3. Update SMTP_PASS in .env with 16-char password (no spaces)
4. Restart server
```

### Issue: "530 5.7.0 Must issue a STARTTLS command first"

**Cause:** TLS not enabled

**Solution:**
```javascript
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: 587, // Use 587, not 465
  secure: false, // Will use STARTTLS
  auth: { ... }
});
```

### Issue: "Authentication failed" with Brevo or other provider

**Cause:** Wrong SMTP credentials

**Solution:**
1. Double-check SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS in .env
2. Generate new SMTP password from provider dashboard
3. Test connection with Nodemailer verify():
   ```javascript
   import nodemailer from 'nodemailer';
   
   const transporter = nodemailer.createTransport({
     host: process.env.SMTP_HOST,
     port: process.env.SMTP_PORT,
     auth: {
       user: process.env.SMTP_USER,
       pass: process.env.SMTP_PASS
     }
   });
   
   transporter.verify((error, success) => {
     if (error) console.log('Error:', error.message);
     else console.log('✅ Connected');
   });
   ```

### Issue: "Emails going to spam"

**Causes & Solutions:**

```
1. Missing SPF/DKIM records
   → Add SPF and DKIM to DNS

2. Generic sender name
   → Use branded sender: noreply@yourdomain.com

3. Suspicious content
   → Avoid too many links, ALL CAPS, emojis
   → Include unsubscribe link

4. High bounce rate
   → Clean invalid emails from list
   → Monitor email logs

5. No reply-to header
   → Add Reply-To header in email
```

**Solution code:**
```javascript
await transporter.sendMail({
  from: `"PeekPost" <noreply@peekpost.com>`,
  replyTo: 'support@peekpost.com',
  to: email,
  subject: 'Welcome',
  html,
  headers: {
    'List-Unsubscribe': `<${process.env.CLIENT_URL}/unsubscribe?token=${token}>`,
  },
});
```

### Issue: "Too many rejected emails"

**Cause:** Invalid email addresses

**Solution:**
```javascript
import validator from 'email-validator';

// Validate before sending
if (!validator.validate(email)) {
  throw new Error('Invalid email address');
}
```

### Issue: "Rate limit exceeded"

**Cause:** Sending too many emails too fast (Gmail: ~1/sec, Brevo: check plan)

**Solution:**
```javascript
// Queue emails with Bull to rate-limit
const emailQueue = new Queue('emails', {
  redis: { url: process.env.REDIS_URL }
});

// Add to queue (processed slowly)
await emailQueue.add({
  to: email,
  subject: 'Test',
  html,
}, {
  attempts: 3,
  backoff: {
    type: 'exponential',
    delay: 2000,
  },
});

// Process queue (5 concurrent, 1 per second)
emailQueue.process(5, async (job) => {
  await new Promise(resolve => setTimeout(resolve, 200));
  return await transporter.sendMail(job.data);
});
```

### Issue: "Connection timeout"

**Cause:** SMTP server unreachable or network issue

**Solution:**
```javascript
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: { ... },
  connectionTimeout: 5000,
  socketTimeout: 5000,
  tls: {
    rejectUnauthorized: false, // For development only
  },
});
```

---

## Testing Emails Locally

### Use Mailtrap (Free)

1. Go to https://mailtrap.io
2. Sign up free
3. Create inbox
4. Copy SMTP credentials
5. Use in development

```env
SMTP_HOST=smtp.mailtrap.io
SMTP_PORT=465
SMTP_USER=your_mailtrap_user
SMTP_PASS=your_mailtrap_password
```

All emails sent go to Mailtrap inbox - great for testing!

### Use Ethereal (Free)

```javascript
import nodemailer from 'nodemailer';

// Create test account
const testAccount = await nodemailer.createTestAccount();

const transporter = nodemailer.createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  secure: false,
  auth: {
    user: testAccount.user,
    pass: testAccount.pass,
  },
});

// Emails go to preview URL
console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
```

---

## Configuration Checklist

### Development Setup
- [ ] Created Gmail app password
- [ ] Set `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` in `.env`
- [ ] Set `SMTP_FROM` to your email
- [ ] Tested send email function
- [ ] Verified email arrives in inbox

### Production Setup (Brevo or Similar)
- [ ] Created Brevo account (or chosen SMTP provider)
- [ ] Got SMTP credentials (Host, Port, User, Pass)
- [ ] Set `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` in Render env vars
- [ ] Set `SMTP_FROM` to verified email
- [ ] Tested email sending to real email
- [ ] Added SPF record to DNS
- [ ] Added DKIM record to DNS
- [ ] Set up email templates
- [ ] Configured error handling & logging
- [ ] Set up email rate limiting
- [ ] Configured unsubscribe links

### Features Implementation
- [ ] Welcome email on registration
- [ ] Email verification
- [ ] Password reset email
- [ ] Notification emails (likes, follows, comments)
- [ ] Weekly digest email
- [ ] Unsubscribe functionality
- [ ] Email preferences for users

---

## Quick Reference

### Brevo Free Setup (5 min)
```
1. Sign up: https://www.brevo.com
2. Go to Settings → SMTP & API
3. Copy SMTP credentials (Host, Port, User, Pass)
4. Set SMTP vars in Render
5. Send test email
```

### Gmail Free Setup (3 min)
```
1. Enable 2FA on Google account
2. Generate app password
3. Set SMTP vars in .env
4. Send test email
```

### Send Email Code
```javascript
import transporter from './config/email.js';
import { renderEmailTemplate } from './utils/templateRenderer.js';

const html = renderEmailTemplate('welcome', { userName: 'John' });

await transporter.sendMail({
  from: process.env.SMTP_FROM,
  to: 'john@example.com',
  subject: 'Welcome to PeekPost',
  html,
});
```

---

## Resources

- **Nodemailer Docs:** https://nodemailer.com
- **Brevo SMTP Docs:** https://www.brevo.com/help/
- **Gmail App Passwords:** https://myaccount.google.com/apppasswords
- **Email Testing:** https://mailtrap.io
- **AWS SES SMTP:** https://docs.aws.amazon.com/ses/latest/dg/smtp-credentials.html

---

**Status:** ✅ Ready for implementation  
**Last Updated:** April 2026
