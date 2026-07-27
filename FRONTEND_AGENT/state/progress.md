# FRONTEND_AGENT Progress log (mới nhất trên cùng)

> Mỗi turn thực (Read/Write/analysis) → PREPEND một mục `## YYYY-MM-DD HH:MM — headline` + 2–5 bullet.

## 2026-07-27 — Phase 2: Mobile & Responsive polish + PWA

**Layout.tsx**: `p-6` → `p-4 sm:p-6` — reduced mobile content padding.

**PropertyDetailPage.tsx** (5 fixes):
- Tab bar: `px-3 sm:px-5` padding + `<span className="hidden sm:inline">` on labels → icon-only tabs on mobile, full labels on ≥640px. `title={t.label}` for tooltip.
- Stat component value: `text-xl` → `text-base sm:text-xl` + `truncate` — prevents overflow on narrow cards.
- OverviewTab chart: `h-64` → `h-48 sm:h-64`.
- FinanceTab stat row: `gap-3` → `gap-2 sm:gap-3`.
- ReminderTab header: added `flex-wrap` so "Generate defaults" + "Add reminder" wrap on narrow screens.

**ReportsPage.tsx** (2 fixes):
- Cash flow chart: `h-72` → `h-48 sm:h-72`.
- Net profit chart: `h-56` → `h-44 sm:h-56`.

**PWA**:
- Installed `vite-plugin-pwa@0.21.0` (devDependency).
- `vite.config.ts`: added `VitePWA({ registerType: 'autoUpdate' })` with manifest (name, short_name, theme_color #7c3aed, icons: icon.svg), workbox precache of all static assets + navigateFallback to index.html + CacheFirst for Google Fonts.
- Created `public/icon.svg` — house icon on purple (#7c3aed) rounded-square background.
- `index.html`: added `<link rel="apple-touch-icon" href="/icon.svg">`.
- Build outputs: `dist/sw.js`, `dist/workbox-*.js`, `dist/manifest.webmanifest`, `dist/registerSW.js`.

**Build**: ✓ `tsc && vite build` — 0 TypeScript errors, 1.72s. PWA v0.21.0 precached 46 entries (904 KiB).

## 2026-07-27 — Phase 3 complete + Refresh Token (Task A+B)

**Phase 3A — ReportsPage.tsx (full rewrite)**
- Switched from imperative `fetchStats()` pattern → reactive `appliedDates` state driving `useDashboardStats(start, end)`.
- Added `prevDates` (same span, shifted back) + second `useDashboardStats` call with `enabled=!!prevDates`.
- `KPI` component now accepts `delta?: number | null` → renders `DeltaBadge` inline; income/expense/net_profit show % vs prev period when a date range is applied.
- Added Export CSV button (calls `downloadCSV`) and Print PDF button (calls `printPage`); CSV includes summary block + by_month breakdown.
- Replaced `PageLoader` with `SkeletonCardGrid`.

**Phase 3B — TransactionsPage.tsx**
- Added Export CSV button (exports current `filtered` page data: Date, Property, Category, Note, Type, Amount).
- Disabled when `filtered.length === 0`.

**Refresh Token (Task B)**
- `authStore.ts`: added `refreshToken` state + `setRefreshToken` + `updateTokens` (silent rotation — no `isAuthChecked` reset).
- `services/api.ts`: replaced verify-then-logout 401 flow with full refresh loop: try POST `/auth/refresh` → retry original request → flush pending queue; on refresh failure drain queue + trigger logout. Guards: `_retry` flag, `isRefreshing` queuing, `logoutScheduled` dedup.
- `LoginPage.tsx`: extracts `accessToken`/`token` + `refreshToken` from `/auth/google` response; calls `setRefreshToken`.
- `SettingsPage.tsx`: `handleLogout` now calls `POST /api/auth/logout` with `{ refreshToken }` before clearing local state.

**Build**: ✓ `tsc && vite build` — 0 TypeScript errors, 1.64s.

## 2026-07-26 — Pagination Transactions (backend shape migration)
- `utils/transactions.ts`: thay `TransactionListResponse` + `normalizeTransactionListResponse` → `parseTransactionListResponse` đọc shape `{ data: { data, total, page, limit, totalPages } }`.
- `hooks/useTransactions.ts`: parse shape mới, expose `page/totalPages/limit`, bỏ fallbackTake cũ.
- `pages/TransactionsPage.tsx`: thêm `page` state, `resetPage()` gọi khi mỗi filter đổi, UI prev/next + page indicator, bỏ cap `limit: 200`.
- `pages/PropertyDetailPage.tsx`: bỏ import `normalizeTransactionListResponse` (đã xóa); thay bằng inline extractor phòng thủ `Array.isArray(payload) ? payload : payload?.data` cho endpoint per-property (có thể trả shape khác).
- `npm run build` ✓ built in 1.72s, 0 TypeScript error.

## 2026-07-25 — Phase 1: UX hardening (skeleton, 404, onboarding, toast)
- Tạo `Skeleton.tsx` (`SkeletonCard`, `SkeletonCardGrid`, `SkeletonTable`, `SkeletonList`) — thay `PageLoader` trong 5 list pages.
- Tạo `NotFoundPage.tsx`; cập nhật `App.tsx` route `*` → render trang 404 thật (không còn redirect về dashboard).
- `DashboardPage`: thêm `WelcomeBanner` + `ONBOARDING_STEPS` hiển thị khi `total_properties === 0`.
- Toast CRUD wired vào Properties, Tenants, Contracts, Transactions, Reminders (create/update/delete đều có success+error toast).
- `window.confirm` — đã sạch từ Phase 0; xác nhận không còn sót.
- `npm run build` ✓ built in 1.70s, 0 TypeScript error.

## 2026-07-24 — Phase 0: stability & cleanup
- Tạo `frontend/src/components/common/ErrorBoundary.tsx` (class component, fallback UI + reload button); wrap `<App>` trong `main.tsx`.
- Gỡ `@supabase/supabase-js` khỏi `frontend/package.json` (không có import nào trong src); chạy `npm install` để cập nhật lockfile.
- Sửa `WorkspaceSharing.tsx`: thay `window.confirm()` bằng `ConfirmDialog` component; thêm `deletePending` + `deleting` state, `confirmDelete` async handler.
- `npm run build` pass sạch, 0 TypeScript error.

## 2026-07-24 — Bootstrapped via AgentUI
- Parents: BOSS.
- Đã nạp required reads theo AGENT.md.
- Chờ dispatch/task đầu tiên.
