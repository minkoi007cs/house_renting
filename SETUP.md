# 🚀 Hướng dẫn Setup Chi Tiết

## Bước 1: Chuẩn bị Supabase

### 1.1 Tạo Project Supabase

1. Truy cập [https://supabase.com](https://supabase.com)
2. Click "New Project"
3. Điền thông tin:
   - Name: `house-rental`
   - Database Password: Lưu mật khẩu an toàn
   - Region: Chọn gần bạn
4. Click "Create new project" (chờ 1-2 phút)

### 1.2 Ghi lại thông tin

Sau khi project khởi tạo, copy:
- **SUPABASE_URL**: Settings → API → Project URL
- **SUPABASE_ANON_KEY**: Settings → API → Project API keys (anon)
- **SUPABASE_SERVICE_ROLE_KEY**: Settings → API → Project API keys (service_role) - **Bảo mật!**

### 1.3 Chạy Database Migration

1. Trong Supabase, vào **SQL Editor**
2. Click "New query"
3. Copy toàn bộ nội dung từ `docs/database-migration.sql`
4. Paste vào editor
5. Click "Run"
6. ✅ Nếu thành công, các bảng sẽ được tạo

### 1.4 Kiểm tra Storage

1. Vào **Storage** section
2. Click "New bucket"
3. Name: `rental-files`
4. Đánh dấu "Public bucket"
5. Click "Create bucket"

---

## Bước 2: Setup Google OAuth

### 2.1 Tạo Google OAuth Credentials

1. Truy cập [Google Cloud Console](https://console.cloud.google.com/)
2. Tạo project mới hoặc dùng project hiện tại
3. Vào **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth client ID**
5. Chọn **Web application**
6. Thêm **Authorized redirect URIs**:
   - `https://YOUR_SUPABASE_PROJECT.supabase.co/auth/v1/callback`
   - `http://localhost:3000/auth/callback` (local testing)

7. Copy **Client ID** và **Client Secret**

### 2.2 Setup trong Supabase

1. Vào Supabase **Authentication** → **Providers**
2. Tìm **Google**
3. Toggle "Enabled"
4. Paste **Client ID** và **Client Secret** từ Google
5. Click "Save"

---

## Bước 3: Setup Backend

### 3.1 Chuẩn bị Environment

```bash
cd backend
cp .env.example .env
```

Mở `backend/.env` và điền:

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/house_rental

# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key-from-step-1
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-from-step-1

# JWT
JWT_SECRET=your-super-secret-key-at-least-32-characters-long
JWT_EXPIRATION=86400

# Server
PORT=3001
NODE_ENV=development

# CORS
FRONTEND_URL=http://localhost:5173
```

### 3.2 Install Dependencies

```bash
cd backend
npm install
```

### 3.3 Chạy Backend Development

```bash
npm run start:dev
```

Output sẽ hiển thị:
```
🚀 Application is running on: http://localhost:3001
```

### 3.4 Test Backend

Mở Postman hoặc Insomnia, test:

```
GET http://localhost:3001/api/users/profile
Headers:
  Authorization: Bearer YOUR_JWT_TOKEN
```

---

## Bước 4: Setup Frontend

### 4.1 Chuẩn bị Environment

```bash
cd frontend
cp .env.example .env
```

Mở `frontend/.env` và điền:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_API_URL=http://localhost:3001/api
VITE_NODE_ENV=development
```

### 4.2 Install Dependencies

```bash
cd frontend
npm install
```

### 4.3 Chạy Frontend Development

```bash
npm run dev
```

App sẽ mở tại `http://localhost:5173`

### 4.4 Test Frontend

1. Click "Đăng nhập với Google"
2. Chọn tài khoản Google
3. Nếu thành công, sẽ redirect đến Dashboard
4. Thử tạo nhà mới

---

## Bước 5: Cấu hình thêm (tùy chọn)

### 5.1 Prettier & ESLint

Backend:
```bash
cd backend
npm run lint    # Check linting
npm run format  # Format code
```

Frontend:
```bash
cd frontend
npm run lint    # Check linting
npm run format  # Format code
```

### 5.2 VSCode Extensions (Recommended)

- ESLint
- Prettier - Code formatter
- Tailwind CSS IntelliSense
- TypeScript Vue Plugin
- SQLTools

### 5.3 VSCode Settings

Tạo `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

---

## Bước 6: Troubleshooting

### Lỗi: "SUPABASE_URL not found"
```
✅ Giải pháp:
- Kiểm tra .env file có key SUPABASE_URL không
- Restart dev server: npm run dev
```

### Lỗi: "401 Unauthorized"
```
✅ Giải pháp:
- JWT token hết hạn → đăng nhập lại
- Kiểm tra JWT_SECRET ở backend
- Kiểm tra Authorization header format: "Bearer TOKEN"
```

### Lỗi: "CORS error"
```
✅ Giải pháp:
- Kiểm tra FRONTEND_URL ở backend .env
- Restart backend
- Kiểm tra browser console cho chi tiết lỗi
```

### Lỗi: "RLS policy violation"
```
✅ Giải pháp:
- Kiểm tra RLS policies đã chạy trong Supabase
- Kiểm tra user_id match trong data
- Test với Supabase dashboard query
```

### Lỗi: "Module not found"
```
✅ Giải pháp:
cd backend && npm install
cd frontend && npm install
```

---

## Bước 7: Local Testing Checklist

Trước khi deploy, kiểm tra:

- [ ] Backend chạy tại http://localhost:3001
- [ ] Frontend chạy tại http://localhost:5173
- [ ] Đăng nhập với Google thành công
- [ ] Tạo nhà mới thành công
- [ ] Danh sách nhà hiển thị đúng
- [ ] Thêm phòng, người thuê thành công
- [ ] Ghi nhận giao dịch thành công
- [ ] Dashboard hiển thị stats
- [ ] Xóa nhà soft delete (không mất dữ liệu)

---

## Bước 8: Docker Setup (Optional)

### 8.1 Backend Dockerfile

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

EXPOSE 3001

CMD ["npm", "run", "start:prod"]
```

### 8.2 Frontend Dockerfile

```dockerfile
FROM node:18-alpine as builder

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

---

## Bước 9: Next Steps

Sau khi hoàn tất setup local:

1. **Implement các tính năng còn lại**:
   - Chi tiết form tạo/sửa nhà
   - Quản lý phòng đầy đủ
   - Quản lý hợp đồng
   - Ghi nhận giao dịch
   - Thống kê chi tiết

2. **Testing**:
   - Unit tests
   - E2E tests
   - Load testing

3. **Deployment**:
   - Deploy backend to Vercel/Railway
   - Deploy frontend to Vercel
   - Setup domain custom
   - Configure monitoring & logging

---

**Good luck! 🚀**
