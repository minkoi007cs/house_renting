# FRONTEND_AGENT — React client (House Renting)

> ## ⚠️ NGUYÊN TẮC TỐI THƯỢNG
> Cần endpoint/shape mới mà chưa có → **DỪNG và escalate về BOSS** (giao BACKEND_AGENT), không tự đoán response.

## Scope
- **IN (được sửa)**: `frontend/**`.
- **OUT (không đụng)**: `backend/**`. Cần API mới → escalate BOSS.
- cwd của bạn = **gốc repo**. Chạy lệnh từ đây, ví dụ `npm run dev:frontend`.
- ⚠️ Thư mục của BẠN trên đĩa là `FRONTEND_AGENT/` (không phải `frontend/`) — cố ý đặt tên khác
  để tránh trùng ổ đĩa không phân biệt hoa/thường. Code thật bạn sửa vẫn là `frontend/**`.

## Stack & kiến trúc
- React + Vite + TypeScript, alias `@` → `frontend/src` (xem `vite.config.ts`).
- Dev server `:5173`, có proxy `/api` → `http://localhost:3001` (đã cấu hình trong `vite.config.ts`) —
  vì vậy gọi API bằng path tương đối `/api/...` qua `frontend/src/services/api.ts`, không hardcode origin.
- TailwindCSS cho style.
- State: **Zustand** (`frontend/src/store/authStore.ts`, `toastStore.ts`).
- Form: **react-hook-form** + **zod** (qua `@hookform/resolvers`) — mọi form validate bằng schema zod.
- Chart: `recharts`. Ngày: `dayjs`. Icon: `lucide-react`. Class merge: `clsx`.
- Data hook theo domain: `frontend/src/hooks/use<Domain>.ts` (useProperties, useTenants, useContracts,
  useTransactions, useUnits, useReminders, useAnalytics, useAuth...) — gọi qua `services/api.ts`. Component
  không gọi axios trực tiếp, luôn qua hook tương ứng.

## Cấu trúc
- `src/pages/` (route theo domain) · `src/components/common/` (primitive: Modal, Toast, Sidebar, TopBar...)
  · `src/components/forms/` (Create*Form theo domain) · `src/components/settings/` · `src/hooks/` · `src/store/`
  · `src/services/api.ts` (client gọi API) · `src/types/index.ts` (type dùng chung UI) · `src/utils/`.

## WORKFLOW 5-PHASE
0. **PRE-FLIGHT**: `bash sync.sh FRONTEND_AGENT` + `bash sync.sh check FRONTEND_AGENT`. Đọc
   `FRONTEND_AGENT/inputs/manifest.md`, `FRONTEND_AGENT/state/progress.md`, Key Pointers từ BOSS.
1. **RECEIVE & CLARIFY**: thiếu endpoint/type → escalate BOSS, không đoán response shape.
2. **PLAN & DECLARE**: khai rõ "sẽ thêm/sửa <page/component/hook> ở <path frontend/...>".
3. **EXECUTE**: theo pattern hook + service + zod schema có sẵn. Bám style component lân cận.
4. **REFLECT & SNAPSHOT** (cuối lượt, BẮT BUỘC):
   - Prepend `FRONTEND_AGENT/state/progress.md`.
   - Ghi đè BODY `FRONTEND_AGENT/overview.md` (≤200 từ).
   - Bump `FRONTEND_AGENT/outputs/manifest.md` nếu tạo/đổi artifact.

## Kiểm tra trước khi báo xong (từ gốc repo)
- `npm run lint --prefix frontend`
- `npm run build --prefix frontend` (`tsc && vite build`) — phải pass sau khi đổi type.

## Local
- Env: điền `frontend/.env` từ `.env.sample`/`.env.example` (`VITE_API_URL`, `VITE_GOOGLE_CLIENT_ID`).
- Chạy: `npm run dev:frontend` (từ gốc repo) → http://localhost:5173.
- Đổi API path/shape → báo BOSS để BACKEND_AGENT xác nhận đã deploy đúng contract.
