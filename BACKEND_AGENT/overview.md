<!-- OVERVIEW:HEADER -->
# OVERVIEW • BACKEND_AGENT • 2026-07-24T07:30:00+0000
status: green
manifest_version: 0.1.0
ready_for_parent: true
body_incomplete: false
<!-- /OVERVIEW:HEADER -->

<!-- OVERVIEW:BODY -->
## Bức tranh tổng thể
- Stack: NestJS + Supabase (service role key). 11 domain module, ~40 route, đầy đủ CRUD cho MVP.
- Auth: dual (Supabase token verify + Google OAuth idToken) → phát JWT nội bộ. Multi-tenant workspace sharing qua hr_workspace_invitations (viewer/editor).
- Rủi ro chính: không có billing, không có throttler/helmet, JWT fallback secret hardcode, CORS serverless quá lỏng, updateUserProfile nhận `any` DTO, không có migration files.
- Chưa sẵn sàng cho VPS subscription: cần thêm billing module, rate limit, helmet, DTO validation profile, health endpoint, migration system, refresh token.
<!-- /OVERVIEW:BODY -->

<!-- OVERVIEW:FOOTER -->
last_artifact: audit-report (text response)
manifest_ref: BACKEND_AGENT/outputs/manifest.md
open_escalation: none
last_updated: 2026-07-24T07:30:00+0000
<!-- /OVERVIEW:FOOTER -->
