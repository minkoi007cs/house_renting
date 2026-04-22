# 🚀 QUICK START - Chạy ứng dụng

## Yêu cầu
- Node.js 18+
- npm/yarn
- Supabase account
- Google OAuth credentials

---

## 1️⃣ Setup Supabase (5 phút)

### Tạo Project
```bash
# https://supabase.com → New Project
# Database Password: Lưu nơi an toàn
# Region: Chọn gần bạn
# Chờ 1-2 phút...
```

### Copy Info
```
SUPABASE_URL: Settings → API → Project URL
SUPABASE_ANON_KEY: Settings → API → anon key
SUPABASE_SERVICE_ROLE_KEY: Settings → API → service_role key
```

### Import Database Schema
1. SQL Editor → New query
2. Copy tất cả từ `docs/database-migration.sql`
3. Paste → Run
4. ✅ Xong!

---

## 2️⃣ Setup Google OAuth (3 phút)

### Google Cloud Console
```
https://console.cloud.google.com/
→ Create Project
→ APIs & Services → Credentials
→ Create → OAuth Client ID → Web application
```

### Authorized Redirect URIs
```
https://YOUR_SUPABASE_URL.supabase.co/auth/v1/callback
http://localhost:3000/auth/callback (local)
```

### Copy to Supabase
```
Supabase → Authentication → Providers → Google
→ Enabled ✓
→ Paste Client ID & Secret
→ Save
```

---

## 3️⃣ Run Backend (2 phút)

```bash
cd backend

# Setup environment
cp .env.example .env

# Fill .env:
SUPABASE_URL=YOUR_URL
SUPABASE_ANON_KEY=YOUR_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY
JWT_SECRET=your-super-secret-key-at-least-32-chars
JWT_EXPIRATION=86400
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# Install & Run
npm install
npm run start:dev

# Output should be:
# 🚀 Application is running on: http://localhost:3001
```

---

## 4️⃣ Run Frontend (2 phút)

```bash
cd frontend

# Setup environment
cp .env.example .env

# Fill .env:
VITE_SUPABASE_URL=YOUR_URL
VITE_SUPABASE_ANON_KEY=YOUR_ANON_KEY
VITE_API_URL=http://localhost:3001/api

# Install & Run
npm install
npm run dev

# Should open: http://localhost:5173
```

---

## 5️⃣ Test Basic Flow (3 phút)

### Step 1: Click "Đăng nhập với Google"
- Choose your Google account
- Should redirect to Dashboard

### Step 2: Create a Property
- Click "+ Thêm nhà"
- Fill form:
  - Tên: "Nhà tại Quận 1"
  - Địa chỉ: "123 Nguyễn Huệ, Q.1, TP.HCM"
  - Loại: "apartment"
- Click "Tạo"
- ✅ Property appears in list

### Step 3: View Property Details
- Click on property → "Xem"
- Should see PropertyDetailPage with tabs
- ✅ Backend & Frontend communicating!

---

## 📂 Project Structure

```
/
├── backend/
│   ├── src/
│   │   ├── auth/        ✅ Complete
│   │   ├── property/    ✅ Complete
│   │   ├── unit/        ✅ Complete
│   │   ├── tenant/      ✅ Complete
│   │   ├── contract/    ✅ Complete
│   │   ├── transaction/ ✅ Complete
│   │   ├── media/       ✅ Complete
│   │   ├── reminder/    ✅ Complete
│   │   ├── analytics/   ✅ Complete
│   │   └── common/      ✅ Complete
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── LoginPage.tsx          ✅
│   │   │   ├── DashboardPage.tsx      ✅
│   │   │   └── PropertyDetailPage.tsx ✅
│   │   ├── components/
│   │   │   ├── common/Navbar.tsx      ✅
│   │   │   └── forms/                 🚧
│   │   ├── hooks/                    ✅
│   │   ├── services/                 ✅
│   │   └── App.tsx                   ✅
│   ├── .env.example
│   └── package.json
│
├── docs/
│   └── database-migration.sql        ✅
│
├── README.md                          ✅
├── SETUP.md                           ✅
├── IMPLEMENTATION_STATUS.md          ✅
└── QUICK_START.md (this file)       📍
```

---

## ✅ Checklist

- [ ] Supabase project created
- [ ] Database migration imported
- [ ] Google OAuth setup
- [ ] Backend .env filled
- [ ] Backend running (`npm run start:dev`)
- [ ] Frontend .env filled
- [ ] Frontend running (`npm run dev`)
- [ ] Can log in with Google
- [ ] Can create property
- [ ] Can view property details

---

## 🐛 Troubleshooting

### "Supabase URL not found"
```bash
❌ .env not filled correctly
✅ Fill all required variables
✅ Restart `npm run dev`
```

### "401 Unauthorized"
```bash
❌ JWT token invalid/expired
✅ Log out & log in again
✅ Check JWT_SECRET in backend .env
```

### "CORS error"
```bash
❌ FRONTEND_URL mismatch
✅ Check backend .env FRONTEND_URL=http://localhost:5173
✅ Restart backend
```

### "RLS policy violation"
```bash
❌ Database migration not imported
✅ Run full SQL from docs/database-migration.sql
✅ Check table created in Supabase
```

---

## 🎯 Next: Implement Features

See `IMPLEMENTATION_STATUS.md` for detailed feature roadmap.

### Quick Overview
1. **Create remaining forms** (Unit, Tenant, Contract, Transaction, Media, Reminder)
2. **Create tab components** (integrate forms into PropertyDetailPage)
3. **Create common components** (Table, Charts, Cards)
4. **Implement analytics** (calculate stats, draw charts)
5. **Add loading/error/empty states**
6. **Test & deploy**

---

## 📚 Useful Commands

```bash
# Backend
cd backend
npm run start:dev     # Start dev server
npm run build         # Build for prod
npm run lint          # Check linting
npm run format        # Format code

# Frontend
cd frontend
npm run dev           # Start dev server
npm run build         # Build for prod
npm run lint          # Check linting
npm run format        # Format code
```

---

## 🔗 Links

- [Supabase](https://supabase.com)
- [Google Cloud Console](https://console.cloud.google.com)
- [NestJS Docs](https://docs.nestjs.com)
- [React Docs](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)

---

**Happy coding! 🚀**

Questions? Check README.md, SETUP.md, or IMPLEMENTATION_STATUS.md
