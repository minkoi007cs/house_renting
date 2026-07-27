# BOSS Progress log (mới nhất trên cùng)

> Mỗi turn thực (Read/Write/analysis) → PREPEND một mục `## YYYY-MM-DD HH:MM — headline` + 2–5 bullet.

## 2026-07-27 — Phase 2 hoàn tất (mobile & responsive polish)
- PropertyDetailPage: tab bar icon-only mobile, stat truncate, chart h-48 sm:h-64, FinanceTab card layout mobile.
- Chart heights responsive (Reports h-48/h-44 sm:full).
- Mobile card layout thay bảng ở TransactionsPage + ContractsPage + FinanceTab (sm:hidden card / hidden sm:block table + overflow-x-auto). Không còn scroll ngang toàn trang @375px.
- PWA: vite-plugin-pwa, manifest + icon.svg tím, theme #7c3aed, standalone, precache 46 files (offline app shell). apple-touch-icon cho iOS.
- Verify: frontend build ✓. Push branch AgentUIslate.
- Còn lại: Phase 4 (billing/subscription) — chờ user quyết cổng thanh toán + mô hình giá.

## 2026-07-27 — Phase 3 hoàn tất (đánh bóng chức năng)
- Backend: refresh token — login trả accessToken/refreshToken/expiresIn/refreshExpiresAt (giữ token cũ), POST /auth/refresh (rotation), POST /auth/logout (revoke). Bảng mới hr_refresh_tokens. Env JWT_REFRESH_EXPIRATION_DAYS (default 30).
- ⚠️ CHƯA CHẠY: SQL migration BACKEND_AGENT/outputs/migration_refresh_tokens.sql phải chạy tay trên Supabase trước khi deploy.
- Frontend: Export CSV (Transactions theo filter, Reports) + Print PDF Reports; currency dùng Intl.NumberFormat extensible; so sánh kỳ DeltaBadge % (income/expense/net) trên Dashboard + Reports; interceptor silent-refresh 401 + rotation, logout gọi API revoke.
- Verify: frontend build ✓, backend tsc ✓. Push branch AgentUIslate.
- Next: Phase 2 (mobile/responsive polish, PWA). Phase 4 (billing) để sau.

## 2026-07-26 — Phase 1 hoàn tất (UX & lỗ hổng chức năng)
- Hướng đổi: bỏ VPS, tập trung hoàn thiện app trên Vercel cho chuyên nghiệp, bán sau.
- Frontend: onboarding empty-state, NotFoundPage (404 thật), Skeleton loading, toast CRUD, dọn window.confirm.
- Backend: pagination thật GET /api/transactions → shape {status,data:{data,total,page,limit,totalPages}}, limit default 50 cap 100, bỏ cap cứng 200/500.
- Frontend nối pagination + UI prev/next, reset page khi filter đổi; fix PropertyDetailPage import vỡ.
- Verify: frontend build ✓, backend tsc ✓. Push branch AgentUIslate.
- Next: Phase 2 (mobile/responsive polish) hoặc Phase 3 (export CSV/PDF, refresh token, Intl currency).

## 2026-07-24 — Audit tổng thể app + đề xuất plan subscription
- Dispatch BACKEND_AGENT + FRONTEND_AGENT rà soát hiện trạng.
- Kết luận: core CRUD/dashboard/reports/workspace-sharing hoàn thiện, chạy được cho demo gia đình.
- Khoảng trống go-live subscription: bảo mật P0 (JWT_SECRET fallback, updateProfile any, CORS origin:true, no helmet/throttler, RLS bypass), không có billing, không có migration, không onboarding/pricing UI, thiếu Docker/health/log cho VPS.
- Đề xuất 5 phase (P0 ổn định → P1 nền VPS → P2 multi-tenant/quota → P3 billing/Stripe → P4 polish). Mỗi phase xong tạo branch AgentUIslate.
- Đang chờ user chốt: bắt đầu Phase 0? đối tượng subscription? cổng thanh toán? mô hình giá?

## 2026-07-24 — Bootstrapped via AgentUI
- Parents: none (root).
- Đã nạp required reads theo AGENT.md.
- Chờ dispatch/task đầu tiên.
