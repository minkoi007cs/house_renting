# 📋 NEXT STEPS - Để Hoàn Thành Full App

## 📊 Current Status
- **Backend:** 100% Structure complete, services ready
- **Frontend:** 60% complete (core pages done, features need implementation)
- **Database:** 100% ready with RLS, triggers, views
- **Auth:** 100% working (Google OAuth + JWT)

**Estimated work left:** 20-30 hours for complete feature implementation

---

## 🎯 Priority Task List

### Phase 1: Core CRUD Forms (6-8 hours)

#### 1. Unit Management
```
Frontend files to create:
├── components/forms/CreateUnitForm.tsx
├── components/forms/EditUnitForm.tsx
├── hooks/useUnits.ts
└── Update: PropertyDetailPage (add UnitsTab)

Backend: ✅ Already complete

Steps:
1. Copy pattern from CreatePropertyForm
2. Add to PropertyDetailPage UnitsTab
3. Test create/edit/delete
4. Add validation for unit names
```

#### 2. Tenant Management  
```
Frontend files to create:
├── components/forms/CreateTenantForm.tsx
├── components/forms/EditTenantForm.tsx
├── hooks/useTenants.ts
└── Update: PropertyDetailPage (add TenantsTab)

Backend: ✅ Already complete

Steps:
1. Create form with phone/email validation
2. Link to unit (via unitId param)
3. Test CRUD operations
```

#### 3. Contract Management
```
Frontend files to create:
├── components/forms/CreateContractForm.tsx
  ├── With file upload for contract document
  ├── Multi-select tenants
  ├── Date pickers for start/end dates
├── components/forms/EditContractForm.tsx
├── hooks/useContracts.ts
└── Update: PropertyDetailPage (add ContractsTab)

Backend: ✅ Already complete

Steps:
1. Complex form with multiple inputs
2. File upload to Supabase Storage
3. Multi-tenant selection
4. Status updates (draft → signed → active, etc)
5. Test all states
```

#### 4. Transaction Management
```
Frontend files to create:
├── components/forms/EditTransactionForm.tsx (Update is already created)
├── components/TransactionsList.tsx (table with pagination)
├── hooks/useTransactions.ts
└── Update: PropertyDetailPage (add FinanceTab)

Backend: ✅ Already complete

Steps:
1. List view with filters (date, type, category)
2. Summary statistics (total income/expense/profit)
3. Category breakdown
4. Test monthly filtering
```

---

### Phase 2: Display Components & Tabs (6-8 hours)

#### 1. Units Tab
```typescript
export const UnitsTab = ({ propertyId }) => {
  // List all units
  // Each unit shows: name, status, tenant count, current contract
  // Buttons: View, Edit, Delete
  // Button: + Add Unit
  // Click unit → show details with tenants & contracts
}
```

#### 2. Tenants Tab
```typescript
export const TenantsTab = ({ propertyId }) => {
  // List all tenants across all units
  // Each tenant shows: name, phone, email, unit assigned, start date
  // Buttons: Edit, Delete
  // Button: + Add Tenant
}
```

#### 3. Contracts Tab
```typescript
export const ContractsTab = ({ propertyId }) => {
  // List contracts (can filter by status: active, expired, draft, etc)
  // Each contract shows: unit, tenants, rent amount, start-end date, status
  // Timeline view (optional) showing contract history
  // Buttons: View, Edit, Change Status, Delete
  // Button: + New Contract
}
```

#### 4. Finance Tab
```typescript
export const FinanceTab = ({ propertyId }) => {
  // Show:
  // - Monthly summary cards (total income, expense, profit)
  // - Transaction list with filters (date range, type, category)
  // - Category breakdown (pie/bar chart)
  // - Button: + Add Transaction
}
```

#### 5. Documents Tab
```typescript
export const DocumentsTab = ({ propertyId }) => {
  // Image gallery (show property photos)
  // Contract files list
  // Button: + Upload File
  // Ability to delete files
}
```

#### 6. Reminders Tab
```typescript
export const RemindersTab = ({ propertyId }) => {
  // List reminders (color code by status: pending, done)
  // Each reminder shows: type, title, due date, status
  // Button: Mark as Done
  // Button: + New Reminder
  // Filter by status
}
```

---

### Phase 3: Common Components (4-6 hours)

#### 1. Table Component
```typescript
<Table
  columns={[
    { key: 'name', label: 'Tên' },
    { key: 'amount', label: 'Số tiền', format: (v) => formatCurrency(v) },
    { key: 'date', label: 'Ngày', format: (v) => formatDate(v) },
  ]}
  data={transactions}
  onRowClick={(row) => handleEdit(row)}
  pagination={{ page, limit, total }}
  onPageChange={setPage}
/>
```

#### 2. Chart Components
```typescript
// For Analytics tab
<LineChart
  data={monthlyData}
  series={[
    { name: 'Thu', color: '#10B981' },
    { name: 'Chi', color: '#EF4444' }
  ]}
/>

<PieChart
  data={categoryBreakdown}
  colors={['#2563EB', '#10B981', '#F59E0B', ...]}
/>
```

#### 3. Card Components
```typescript
<UnitCard unit={unit} onClick={...} />
<TenantCard tenant={tenant} onClick={...} />
<ContractCard contract={contract} onClick={...} />
<TransactionCard transaction={transaction} onClick={...} />
```

#### 4. State Components
```typescript
<EmptyState
  icon={Home}
  title="Chưa có phòng nào"
  action={{ label: 'Thêm phòng', onClick: ... }}
/>

<LoadingState count={3} />  // 3 skeleton items

<ErrorState
  message="Lỗi khi tải dữ liệu"
  onRetry={() => refetch()}
/>
```

---

### Phase 4: Analytics (4-5 hours)

#### Analytics Tab Implementation
```typescript
export const AnalyticsTab = ({ propertyId }) => {
  // Key stats:
  // - Total income
  // - Total expense  
  // - Net profit
  // - Pie chart: Income by category
  // - Pie chart: Expense by category
  // - Line chart: Monthly trend (6 months)
  // - Table: Unit breakdown (income, expense, profit per unit)
  
  // With filters:
  // - Date range selector
  // - By unit (dropdown)
  // - By category (checkbox)
}
```

#### Dashboard Analytics
```typescript
// Enhanced DashboardPage with:
// - Overall statistics cards
// - Top performing properties
// - Recent transactions
// - Upcoming reminders
```

---

## 🛠️ Development Guide

### For Each Feature:

1. **Create the Hook**
   ```typescript
   // hooks/useUnits.ts
   export const useUnits = (propertyId: string) => {
     const [units, setUnits] = useState([]);
     const [isLoading, setIsLoading] = useState(false);
     
     const fetchUnits = async () => { ... };
     const createUnit = async (data) => { ... };
     const updateUnit = async (id, data) => { ... };
     const deleteUnit = async (id) => { ... };
     
     return { units, isLoading, fetchUnits, createUnit, updateUnit, deleteUnit };
   };
   ```

2. **Create the Form Component**
   ```typescript
   // components/forms/CreateUnitForm.tsx
   // Follow CreatePropertyForm pattern:
   // - use react-hook-form + Zod
   // - Add error handling
   // - Show loading state
   // - Call hook onSubmit
   ```

3. **Create the List/Tab Component**
   ```typescript
   // Update PropertyDetailPage with new tab
   // List items in table or grid
   // Add buttons for CRUD operations
   // Show loading/empty/error states
   ```

4. **Test**
   ```
   - Fill form and submit
   - Verify data in Supabase
   - Edit data
   - Delete data (check soft delete)
   - Test error scenarios
   ```

---

## 📝 Code Templates

### Form Component Template
```typescript
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import api from '@/services/api';

const schema = z.object({
  // Define fields
});

export const CreateXForm = ({ onClose, onSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      await api.post('/endpoint', data);
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal">
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Fields */}
        {/* Submit button */}
      </form>
    </div>
  );
};
```

### Hook Template
```typescript
import { useState, useEffect } from 'react';
import api from '@/services/api';

export const useX = (parentId: string) => {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchItems = async () => {
    try {
      setIsLoading(true);
      const response = await api.get(`/endpoint/${parentId}`);
      setItems(response.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [parentId]);

  const createItem = async (data) => {
    await api.post(`/endpoint/${parentId}`, data);
    fetchItems();
  };

  const updateItem = async (id, data) => {
    await api.patch(`/endpoint/${id}`, data);
    fetchItems();
  };

  const deleteItem = async (id) => {
    await api.delete(`/endpoint/${id}`);
    fetchItems();
  };

  return { items, isLoading, createItem, updateItem, deleteItem };
};
```

---

## 🔄 Testing Checklist

For each feature, test:
- [ ] Create: Form submission works, data appears in list
- [ ] Read: Data loads correctly, displays properly
- [ ] Update: Edit form works, changes appear
- [ ] Delete: Soft delete works, item hidden from list
- [ ] Validation: Form shows error messages
- [ ] Loading: Loading state shows while fetching
- [ ] Error: Error state shows on API failure
- [ ] Empty: Empty state shows when no data
- [ ] Responsive: Works on mobile/tablet/desktop

---

## 🚀 Deployment Checklist

Before deploying:
- [ ] All features complete
- [ ] No console errors
- [ ] No unhandled promises
- [ ] Environment variables set
- [ ] API URLs correct
- [ ] CORS configured
- [ ] RLS policies verified
- [ ] Database backups done

---

## 📞 Quick Reference

### API Endpoints Summary
```
Properties:  GET/POST /api/properties, GET/PATCH/DELETE /api/properties/:id
Units:       GET/POST /api/properties/:id/units, PATCH/DELETE /api/units/:id
Tenants:     GET/POST /api/units/:id/tenants, PATCH/DELETE /api/tenants/:id
Contracts:   GET/POST /api/units/:id/contracts, PATCH/DELETE /api/contracts/:id
Transactions: GET/POST /api/properties/:id/transactions, PATCH/DELETE /api/transactions/:id
Media:       POST /api/properties/:id/media, DELETE /api/media/:id
Reminders:   GET/POST /api/properties/:id/reminders, PATCH/DELETE /api/reminders/:id
Analytics:   GET /api/analytics/dashboard, GET /api/properties/:id/analytics
```

### Folder Structure
```
frontend/src/
├── pages/          # Pages (routes)
├── components/
│   ├── common/     # Layout (Navbar, Sidebar)
│   ├── forms/      # Create/Edit forms
│   ├── tabs/       # Feature tabs (UnitsTab, etc)
│   └── shared/     # Reusable (Table, Charts, Cards)
├── hooks/          # Data fetching hooks
├── services/       # API, Supabase
└── types/          # TypeScript types
```

---

## ✨ Final Notes

- The app structure is SOLID - just needs feature implementation
- All CRUD operations follow same pattern
- Database & Auth are bulletproof with RLS
- TypeScript ensures type safety
- Validation at client + server

**You've got this! 🎉**

When stuck, check:
1. IMPLEMENTATION_STATUS.md (what's done)
2. QUICK_START.md (setup issues)
3. Backend logs (API errors)
4. Browser console (frontend errors)
5. Supabase dashboard (data/auth issues)
