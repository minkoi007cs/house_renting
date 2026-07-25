# BACKEND_AGENT — NestJS API (House Renting)

> ## ⚠️ NGUYÊN TẮC TỐI THƯỢNG
> Thiếu contract/shape/scope → **DỪNG và escalate về BOSS**, không đoán, không mock data cho "chạy được".

## Scope
- **IN (được sửa)**: `backend/**`.
- **OUT (không đụng)**: `frontend/**`. Việc kéo theo sửa frontend → escalate BOSS để giao FRONTEND_AGENT.
- cwd của bạn = **gốc repo**. Chạy lệnh từ đây, ví dụ `npm run start:dev --prefix backend`.
- ⚠️ Thư mục của BẠN trên đĩa là `BACKEND_AGENT/` (không phải `backend/`) — cố ý đặt tên khác
  để tránh trùng ổ đĩa không phân biệt hoa/thường. Code thật bạn sửa vẫn là `backend/**`.

## Stack & kiến trúc
- NestJS, TypeScript, feature-module theo `backend/src/<domain>/`.
- **Supabase** làm datastore: `backend/src/config/supabase.module.ts` + `supabase.service.ts` — dùng
  `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY`, KHÔNG phải TypeORM. Khi đụng schema/RLS/query phức tạp,
  dùng skill `supabase` và `supabase-postgres-best-practices` trong `.agents/skills/` (invoke qua Skill tool).
- Auth: JWT (`backend/src/common/guards/jwt.guard.ts`) + Google OAuth (`google-auth-library`).
  Lấy user qua decorator `current-user.decorator.ts`; có `workspace-owner.decorator.ts` cho multi-tenant/workspace.
- Validation: `class-validator` + `class-transformer`. DTO trong `dto/` mỗi module.
- Swagger bật qua `@nestjs/swagger`. Endpoint mới thêm decorator tương ứng.
- Lỗi: `backend/src/common/filters/http-exception.filter.ts` — dùng filter chung, đừng tự bắt lỗi rải rác.
- Deploy: có `backend/vercel.json` + `backend/api/index.js` + `src/serverless.ts` (serverless) song song với
  `src/main.ts` (local). Giữ cả hai đường chạy được.

## Module hiện có
`auth, user, property, unit, tenant, contract, transaction, reminder, analytics, media`. Một số domain
có cả controller thường và `*-global.controller.ts` (route không giới hạn theo workspace) — xem file
tương ứng (`contract-global.controller.ts`, `reminder-global.controller.ts`, v.v.) trước khi thêm route mới,
để biết nên thêm vào controller nào.

## WORKFLOW 5-PHASE
0. **PRE-FLIGHT**: `bash sync.sh BACKEND_AGENT` + `bash sync.sh check BACKEND_AGENT`. Đọc
   `BACKEND_AGENT/inputs/manifest.md`, `BACKEND_AGENT/state/progress.md`, Key Pointers từ BOSS.
1. **RECEIVE & CLARIFY**: thiếu điều kiện → escalate BOSS ngay.
2. **PLAN & DECLARE**: khai rõ "sẽ thêm/sửa <gì> ở <path backend/...>" trước khi code.
3. **EXECUTE**: bám pattern module lân cận; DTO + validation + Swagger đầy đủ.
4. **REFLECT & SNAPSHOT** (cuối lượt, BẮT BUỘC):
   - Prepend `BACKEND_AGENT/state/progress.md`.
   - Ghi đè BODY `BACKEND_AGENT/overview.md` (≤200 từ).
   - Bump `BACKEND_AGENT/outputs/manifest.md` nếu tạo/đổi artifact.

## Kiểm tra trước khi báo xong (từ gốc repo)
- `npm run lint --prefix backend`
- `npm test --prefix backend` (jest, `*.spec.ts`)
- `npm run build --prefix backend` (`nest build`) khi đổi cấu trúc/type.

## Local
- Env: điền `backend/.env` từ `.env.sample`/`.env.example` (Supabase URL, service role key, JWT secret, Google client id).
- Chạy: `npm run dev:backend` (từ gốc repo) → http://localhost:3001.
- Đổi port/route ảnh hưởng CORS → báo BOSS để đồng bộ `FRONTEND_URL`/`VITE_API_URL`.
