# 🏠 Ứng dụng Quản lý Cho Thuê Nhà

Ứng dụng web toàn diện để quản lý bất động sản cho thuê, bao gồm quản lý nhà, người thuê, hợp đồng, tài chính và thống kê.

## 🚀 Các tính năng chính

- ✅ Xác thực với Google via Supabase
- ✅ Quản lý nhiều nhà cho thuê
- ✅ Hỗ trợ cấu trúc nhà đơn (1 unit) hoặc nhiều phòng (multiple units)
- ✅ Quản lý người thuê, hợp đồng
- ✅ Ghi nhận thu chi chi tiết
- ✅ Dashboard thống kê tài chính
- ✅ Nhắc nhở việc quan trọng
- ✅ Quản lý ảnh và tài liệu
- ✅ RLS (Row Level Security) bảo vệ dữ liệu

## 🛠 Tech Stack

### Frontend
- **React 18** + **Vite**
- **TypeScript**
- **TailwindCSS** - Styling
- **React Router** - Navigation
- **Zustand** - State management
- **React Hook Form** + **Zod** - Form handling
- **Supabase JS Client** - Authentication
- **Axios** - API client
- **Recharts** - Charts & analytics
- **Lucide Icons** - Icons

### Backend
- **NestJS** - Framework
- **TypeScript**
- **Supabase** - Database & Auth
- **JWT** - Token management

### Infrastructure
- **Supabase PostgreSQL** - Database
- **Supabase Storage** - File storage
- **Supabase Auth** - Google OAuth
- **Vercel** - Deployment

## 📋 Chuẩn bị

### Yêu cầu
- Node.js 18+
- npm hoặc yarn
- Supabase account
- Google OAuth credentials

### Bước 1: Setup Supabase

1. Tạo project mới tại [supabase.com](https://supabase.com)
2. Ghi lại `SUPABASE_URL` và `SUPABASE_ANON_KEY`
3. Chạy SQL migration: copy nội dung `docs/database-migration.sql` vào Supabase SQL Editor

### Bước 2: Setup Google OAuth

1. Tạo Google OAuth app tại [Google Cloud Console](https://console.cloud.google.com)
2. Thêm redirect URI: `https://your-project.supabase.co/auth/v1/callback`
3. Copy `Client ID` và `Client Secret`
4. Thêm vào Supabase Auth providers

### Bước 3: Environment Variables

#### Backend (`.env`)
```bash
cp backend/.env.example backend/.env
```

Điền:
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
JWT_SECRET=your-secret-key-min-32-chars
JWT_EXPIRATION=86400
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

#### Frontend (`.env`)
```bash
cp frontend/.env.example frontend/.env
```

Điền:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_API_URL=http://localhost:3001/api
```

## 🚀 Chạy ứng dụng

### Development

**Terminal 1 - Backend:**
```bash
cd backend
npm install
npm run start:dev
# Server chạy tại http://localhost:3001
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm install
npm run dev
# App chạy tại http://localhost:5173
```

### Production

**Backend:**
```bash
cd backend
npm run build
npm run start:prod
```

**Frontend:**
```bash
cd frontend
npm run build
# Dist folder sẵn sàng để deploy
```

## 📚 API Documentation

### Authentication
- `POST /api/auth/verify` - Xác thực Supabase token, trả JWT
- `GET /api/auth/profile` - Lấy profile user

### Properties
- `GET /api/properties` - Danh sách nhà (pagination)
- `POST /api/properties` - Tạo nhà mới
- `GET /api/properties/:id` - Chi tiết nhà
- `PATCH /api/properties/:id` - Cập nhật nhà
- `DELETE /api/properties/:id` - Xóa nhà

### Units
- `GET /api/units/property/:propertyId` - Danh sách phòng
- `POST /api/units/property/:propertyId` - Tạo phòng
- `PATCH /api/units/:id` - Cập nhật phòng
- `DELETE /api/units/:id` - Xóa phòng

### Tenants
- `GET /api/units/:unitId/tenants` - Danh sách người thuê
- `POST /api/units/:unitId/tenants` - Thêm người thuê
- `PATCH /api/tenants/:id` - Cập nhật người thuê
- `DELETE /api/tenants/:id` - Xóa người thuê

### Rental Contracts
- `GET /api/units/:unitId/contracts` - Danh sách hợp đồng
- `POST /api/units/:unitId/contracts` - Tạo hợp đồng
- `PATCH /api/contracts/:id` - Cập nhật hợp đồng
- `DELETE /api/contracts/:id` - Xóa hợp đồng

### Transactions
- `GET /api/properties/:propertyId/transactions` - Danh sách giao dịch
- `POST /api/properties/:propertyId/transactions` - Tạo giao dịch
- `PATCH /api/transactions/:id` - Cập nhật giao dịch
- `DELETE /api/transactions/:id` - Xóa giao dịch
- `GET /api/properties/:propertyId/transactions/summary` - Tóm tắt thu/chi

### Analytics
- `GET /api/analytics/dashboard` - Dashboard tổng hợp
- `GET /api/properties/:propertyId/analytics` - Thống kê chi tiết nhà

## 📁 Cấu trúc thư mục

```
house-rental/
├── backend/
│   ├── src/
│   │   ├── auth/           # Authentication module
│   │   ├── property/       # Property management
│   │   ├── unit/           # Unit/Room management
│   │   ├── tenant/         # Tenant management
│   │   ├── contract/       # Rental contract
│   │   ├── transaction/    # Finance transactions
│   │   ├── media/          # File & image upload
│   │   ├── reminder/       # Reminders
│   │   ├── analytics/      # Statistics
│   │   ├── common/         # Shared utilities
│   │   └── config/         # Configuration
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── pages/          # Route pages
│   │   ├── components/     # Reusable components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── services/       # API & Supabase
│   │   ├── store/          # Zustand stores
│   │   ├── types/          # TypeScript types
│   │   ├── utils/          # Utilities
│   │   └── styles/         # Styling
│   ├── index.html
│   └── package.json
│
├── docs/
│   ├── database-migration.sql
│   └── API_DOCUMENTATION.md
│
└── README.md
```

## 🔐 Bảo mật

### Row Level Security (RLS)
- Tất cả dữ liệu được bảo vệ bằng RLS policies
- User chỉ có thể xem/sửa dữ liệu của chính họ
- Backend validation thêm lớp bảo vệ

### Authentication Flow
1. User đăng nhập với Google
2. Supabase trả JWT token
3. Frontend gửi token này lên backend `/auth/verify`
4. Backend xác thực và trả JWT token riêng
5. Tất cả request sử dụng JWT token này

### File Storage
- Ảnh và file lưu tại: `users/{userId}/properties/{propertyId}/media/`
- Supabase RLS quản lý quyền truy cập

## 🚢 Deployment

### Deploy Backend (Vercel)

```bash
cd backend
vercel deploy
```

Cấu hình biến môi trường tại Vercel dashboard.

### Deploy Frontend (Vercel)

```bash
cd frontend
vercel deploy
```

Hoặc kết nối GitHub repo để auto-deploy.

## 📝 Hướng dẫn sử dụng

1. **Đăng nhập**: Click "Đăng nhập với Google"
2. **Tạo nhà mới**: Điền thông tin nhà, click "Tạo"
3. **Tạo phòng**: Nếu nhà có nhiều phòng, thêm từng phòng
4. **Thêm người thuê**: Ghi thông tin từng người thuê
5. **Tạo hợp đồng**: Tạo HĐ, chọn người thuê, upload file
6. **Ghi nhận giao dịch**: Ghi thu chi hàng ngày
7. **Xem thống kê**: Xem dashboard để hiểu rõ tài chính

## 🐛 Troubleshooting

### "Supabase environment variables missing"
→ Kiểm tra `.env` file có đầy đủ `VITE_SUPABASE_URL` và `VITE_SUPABASE_ANON_KEY`

### "401 Unauthorized"
→ JWT token hết hạn, đăng nhập lại

### "Permission denied" (RLS)
→ Kiểm tra RLS policies đã được tạo trong Supabase

## 📞 Support

Gặp vấn đề? Tạo issue hoặc liên hệ support.

## 📄 License

MIT
