# 📝 TODO - Phát triển tiếp theo

## Phase 2: Implement Core Features

### Backend - API Endpoints

#### Unit Module
- [ ] GET /api/units/property/:propertyId (list)
- [ ] POST /api/units/property/:propertyId (create)
- [ ] PATCH /api/units/:id (update)
- [ ] DELETE /api/units/:id (delete)
- [ ] GET /api/units/:id/details (with tenants + contracts)

#### Tenant Module
- [ ] GET /api/units/:unitId/tenants (list)
- [ ] POST /api/units/:unitId/tenants (create)
- [ ] PATCH /api/tenants/:id (update)
- [ ] DELETE /api/tenants/:id (delete)
- [ ] GET /api/units/:unitId/tenants/count

#### Contract Module
- [ ] GET /api/units/:unitId/contracts (list with status filter)
- [ ] POST /api/units/:unitId/contracts (create + link tenants)
- [ ] PATCH /api/contracts/:id (update)
- [ ] PATCH /api/contracts/:id/status (change status)
- [ ] DELETE /api/contracts/:id (delete)
- [ ] GET /api/contracts/:id/tenants (linked tenants)

#### Transaction Module
- [ ] GET /api/properties/:propertyId/transactions (with filters)
- [ ] POST /api/properties/:propertyId/transactions (create)
- [ ] PATCH /api/transactions/:id (update)
- [ ] DELETE /api/transactions/:id (delete)
- [ ] GET /api/properties/:propertyId/transactions/summary
- [ ] GET /api/properties/:propertyId/transactions/by-category

#### Media Module
- [ ] POST /api/properties/:propertyId/media (upload)
- [ ] GET /api/properties/:propertyId/media (list)
- [ ] PATCH /api/media/:id (reorder, update metadata)
- [ ] DELETE /api/media/:id (delete from storage)

#### Reminder Module
- [ ] GET /api/properties/:propertyId/reminders
- [ ] POST /api/properties/:propertyId/reminders (create)
- [ ] PATCH /api/reminders/:id (update)
- [ ] PATCH /api/reminders/:id/status (mark done)
- [ ] DELETE /api/reminders/:id
- [ ] GET /api/reminders/upcoming (next 7 days)

#### Analytics Module
- [ ] GET /api/analytics/dashboard (all properties summary)
- [ ] GET /api/properties/:propertyId/analytics
- [ ] GET /api/units/:unitId/analytics
- [ ] GET /api/analytics/property-ranking
- [ ] GET /api/analytics/monthly-trend

### Frontend - Pages & Components

#### Property Management Pages
- [ ] PropertyDetailPage (complete layout)
- [ ] PropertyEditModal/Form
- [ ] PropertyDeleteConfirm

#### Unit Management
- [ ] UnitsTab component (in property detail)
- [ ] CreateUnitModal
- [ ] EditUnitModal
- [ ] UnitCard/UnitRow

#### Tenant Management
- [ ] TenantsTab component
- [ ] CreateTenantModal
- [ ] EditTenantModal
- [ ] TenantsList

#### Contract Management
- [ ] ContractsTab component
- [ ] CreateContractModal (with tenant multi-select)
- [ ] ContractDetails component
- [ ] ContractTimeline/History

#### Finance & Transactions
- [ ] FinanceTab component
- [ ] CreateTransactionModal
- [ ] TransactionsTable (with filters)
- [ ] TransactionChart (income vs expense)
- [ ] CategoryBreakdown

#### Media Management
- [ ] DocumentsTab component
- [ ] MediaGallery component
- [ ] FileUpload component
- [ ] MediaViewer (images, PDFs)

#### Reminders
- [ ] RemindersTab component
- [ ] RemindersList component
- [ ] CreateReminderModal
- [ ] ReminderCard

#### Analytics
- [ ] AnalyticsDashboardPage
- [ ] PropertyStatsCard
- [ ] IncomeChart (bar/line)
- [ ] ExpenseChart (pie)
- [ ] PropertiesRanking (table)
- [ ] MonthlyTrendChart

### Common Components
- [ ] FormInput (wrapper)
- [ ] FormSelect
- [ ] FormDatePicker
- [ ] FormNumberInput
- [ ] FormTextArea
- [ ] Button (variants)
- [ ] Modal (reusable)
- [ ] Table (with sorting, pagination)
- [ ] Card components
- [ ] Badge (status)
- [ ] EmptyState
- [ ] LoadingSkeleton
- [ ] Alert/Toast notifications

---

## Phase 3: Polish & Optimization

### Frontend
- [ ] Loading states for all async operations
- [ ] Error handling & error messages
- [ ] Success notifications
- [ ] Empty states
- [ ] Form validation with Zod
- [ ] Responsive design testing (mobile, tablet)
- [ ] Dark mode support (optional)
- [ ] Keyboard shortcuts
- [ ] Search functionality (properties, transactions)

### Backend
- [ ] Input validation for all endpoints
- [ ] Error handling & proper HTTP codes
- [ ] Logging (Winston/Pino)
- [ ] Request rate limiting
- [ ] Pagination optimization
- [ ] Database query optimization
- [ ] Caching strategy (Redis if needed)

### Testing
- [ ] Unit tests (Backend)
- [ ] Integration tests (API)
- [ ] E2E tests (Frontend)
- [ ] Accessibility testing
- [ ] Performance testing

---

## Phase 4: Advanced Features

### Notifications
- [ ] Email notifications (Rent due)
- [ ] Browser notifications
- [ ] In-app notifications
- [ ] Notification preferences

### Reporting
- [ ] PDF export (property report)
- [ ] Excel export (transactions)
- [ ] Monthly summary report
- [ ] Annual report

### Multi-User Support (Phase 2+)
- [ ] Share property with manager
- [ ] Role-based access (owner, manager, accountant)
- [ ] Activity log

### Mobile App (Phase 3+)
- [ ] React Native implementation
- [ ] Push notifications
- [ ] Offline support
- [ ] Document camera

### Automation
- [ ] Auto-generate reminders (rent due)
- [ ] Scheduled reports
- [ ] Webhook integrations
- [ ] API for third-party integrations

---

## Bugs & Fixes

- [ ] Handle network errors gracefully
- [ ] Refresh token rotation
- [ ] Logout on other devices
- [ ] Session timeout
- [ ] Data consistency (concurrent updates)
- [ ] Memory leaks prevention

---

## Deployment Checklist

- [ ] Environment variables configured
- [ ] Database migrations tested
- [ ] RLS policies verified
- [ ] File upload working
- [ ] Auth flow tested
- [ ] CORS configured
- [ ] Error logging setup
- [ ] Monitoring setup
- [ ] Backup strategy
- [ ] Database indexes optimized
- [ ] API rate limiting
- [ ] Security headers

---

## Documentation

- [ ] API Documentation (Swagger/OpenAPI)
- [ ] Database schema diagram
- [ ] Architecture diagram
- [ ] User guide
- [ ] Admin guide
- [ ] Developer guide
- [ ] Deployment guide

---

## Performance Goals

- [ ] Page load < 2s
- [ ] API response < 200ms
- [ ] Database query < 100ms
- [ ] LCP < 2.5s (Lighthouse)
- [ ] FID < 100ms
- [ ] CLS < 0.1

---

## Security Audit

- [ ] XSS prevention
- [ ] CSRF protection
- [ ] SQL injection prevention
- [ ] Rate limiting
- [ ] Input validation
- [ ] Output encoding
- [ ] Authentication flow security
- [ ] RLS policy audit
- [ ] File upload security
- [ ] Secrets management

---

**Last updated:** 2026-04-21
