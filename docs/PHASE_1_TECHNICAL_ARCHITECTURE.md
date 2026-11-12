# وثيقة البنية التقنية والتخطيط الشامل (المرحلة 1)
# SELSABIL DELIVERY — Architectural & Technical Specification

---

## 1. التصور التقني النهائي للمشروع (High-Level Vision)
منصة **SELSABIL DELIVERY** هي نظام تجارة إلكترونية متكامل B2B / B2C مخصص للسوق الجزائري يربط بين تجار التجزئة، ونصف الجملة، وزبائن الجملة، وإدارة العمليات، مع شبكة المندوبين التجاريين (Commerciaux).

### المبادئ الهندسية الأساسية:
- **Server-Authoritative Pricing & Stock**: لا يتم الوثوق ببيانات المتصفح أو تطبيق العميل نهائياً عند حساب الأسعار، الخصومات، المخزون، أو رسوم التوصيل.
- **Atomic Concurrency (Transactions)**: عمليات الشراء وتعديل المخزون تتم عبر `Firestore Transactions` تضمن منع المخزون السالب وتمنع التعارض المتزامن (Race Conditions).
- **Zero Price Leaks**: عزل أسعار الفئات (Gros, Demi-Gros, Détail) في مستندات/مجموعات فرعية خاصة أو عبر Cloud Functions وسيطة لا يستطيع الزبون استعلامها مباشرة عبر الـ SDK.
- **Immutable Snapshots**: الطلبات والفواتير تحفظ لقطات ثابتة لبيانات المنتجات، الأسعار المحسوبة، وعناوين التوصيل لحظة تأكيد الطلب، بحيث لا تتأثر بتعديل المنتجات أو الأسعار لاحقاً.
- **Auditable Lifecycle**: كل تغيير في حالة الطلب أو المخزون يسجل في سجل تدقيق غير قابل للحذف أو التعديل، مع التمييز بين الملاحظات الداخلية (Internal) والملاحظات الموجهة للزبون (Customer Notes).
- **Bilingual Context**: واجهة عربية RTL أصيلة، مع دعم فرنسية LTR بتبديل فوري، مع إلزامية أن تكون وثائق الفواتير وسندات التوصيل (Factures & Bons de livraison) بالفرنسية فقط دائماً.

---

## 2. التقنيات المختارة وأسباب الاختيار (Technology Stack & Rationale)

| الطبقة / الأداة | التقنية المختارة | سبب الاختيار |
| :--- | :--- | :--- |
| **Frontend Framework** | **React 19 + TypeScript** | سرعة الأداء، دعم واجهات المستخدم التفاعلية المعقدة (سلة، حساب كراتين وحبات فوري)، ونوعية بيانات آمنة تمنع أخطاء وقت التشغيل. |
| **Bundler & Build Tool** | **Vite** | سرعة البناء الفائقة وتوافق تام مع معايير الويب الحديثة وحزم الـ ESM. |
| **Styling & Design** | **Tailwind CSS v4** | تصميم Modern Minimalist مرن وسريع، دعم كامل وسلس لاتجاهات `dir="rtl"` و `dir="ltr"` عبر فئات المنطق الاتجاهي (`ms-*`, `me-*`, `start-*`, `end-*`). |
| **Routing** | **React Router (SPA)** | توجيه متقدم مع حماية المسارات (Protected Routes) لحسابات الزبائن ولوحة تحكم الإدارة. |
| **Validation** | **Zod + React Hook Form** | تدقيق صارم لمدخلات النماذج (الهاتف الجزائري، كود المندوب، حقول الولاية والدائرة والبلدية) قبل الإرسال. |
| **Backend & Database** | **Cloud Firestore** | قاعدة بيانات NoSQL ذات زمن استجابة فوري، تدعم الاشتراكات اللحظية (Real-time snapshots) وسجلات التدقيق الفرعية والعمليات التبادلية (Transactions). |
| **Authentication** | **Firebase Auth** | إدارة آمنة لكلمات المرور مع تشفيرها، دعم الـ Tokens والتحقق من الهوية بدون تخزين كلمات المرور نهائياً في Firestore. |
| **Role-Based Access** | **Firebase Custom Claims** | ختم صلاحية `admin: true` على الـ Token الخاص بالمدير للتحقق الصارم والمباشر في Firestore Rules و Cloud Functions. |
| **Business Logic Security**| **Express/Cloud Functions Proxy** | تنفيذ العمليات الحساسة (تسعير، إنشاء وتعديل طلبات، فحص الكود التجاري، موافقة المدير) في بيئة معزولة عن المتصفح. |
| **Storage & Invoices** | **Firebase Storage & Canvas/PDF** | تخزين صور المنتجات بجودة عالية، وتوليد وطباعة الفواتير ووصولات التوصيل بصيغة PDF قابلة للأرشفة والطباعة. |

---

## 3. هيكل ملفات المشروع المنظم (Directory Structure)

```text
selsabil-delivery/
├── index.html
├── metadata.json
├── package.json
├── tsconfig.json
├── vite.config.ts
├── firestore.rules
├── firestore.indexes.json
├── storage.rules
├── public/
│   ├── favicon.ico
│   └── logo/
│       ├── selsabil-logo.svg
│       └── selsabil-badge.svg
├── docs/
│   └── PHASE_1_TECHNICAL_ARCHITECTURE.md
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── index.css
│   ├── types/
│   │   ├── auth.ts              # نماذج المستخدمين والصلاحيات
│   │   ├── product.ts           # المنتجات، الكراتين، الحبات
│   │   ├── pricing.ts           # الفئات (GROS, DEMI_GROS, DETAIL) والأسعار المخصصة
│   │   ├── order.ts             # بنية الطلب، Snapshots، الحالات
│   │   ├── inventory.ts         # حركات المخزون (Carton & Unit)
│   │   ├── geography.ts         # الولايات، الدوائر، البلديات
│   │   ├── commercial.ts        # المندوبون التجاريون وتقاريرهم
│   │   ├── delivery.ts          # مناطق ورسوم التوصيل
│   │   └── invoice.ts           # بيانات الفواتير وسندات التسليم (فرنسية)
│   ├── data/
│   │   └── algeriaGeography.ts  # البيانات الإدارية الرسمية للـ 58 ولاية والدوائر والبلديات
│   ├── i18n/
│   │   ├── LanguageContext.tsx   # إدارة اللغة الحالية (ar / fr) والاتجاه (rtl / ltr)
│   │   ├── ar.ts                # النصوص العربية
│   │   └── fr.ts                # النصوص الفرنسية
│   ├── firebase/
│   │   ├── config.ts            # تهيئة عميل Firebase
│   │   ├── auth.ts              # دوال الدخول والتسجيل
│   │   └── firestore.ts         # مراجع المجموعات العامة
│   ├── services/
│   │   ├── api.ts               # استدعاءات الخادم الآمنة (Cloud Functions / API proxy)
│   │   ├── orderService.ts      # إدارة الطلبات والمخزون الآمن
│   │   ├── pricingService.ts    # جلب الأسعار المصرح بها حصراً
│   │   ├── customerService.ts   # إدارة الزبائن وتعيين الفئات
│   │   ├── commercialService.ts # متابعة المندوبين وربط الأكواد
│   │   └── pdfService.ts        # توليد الفواتير وسندات الاستلام بالفرنسية
│   ├── context/
│   │   ├── AuthContext.tsx      # سياق حالة المستخدم الحالية (Visitor, Pending, Approved, Admin)
│   │   └── CartContext.tsx      # سياق السلة (Carton + Unit مع فحص المخزون والأسعار المصرحة)
│   ├── components/
│   │   ├── common/
│   │   │   ├── Header.tsx       # الشعار، البحث، اللغة، السلة، الحساب
│   │   │   ├── Footer.tsx       # الروابط، التواصل، الشروط
│   │   │   ├── ProtectedRoute.tsx
│   │   │   ├── NotificationToast.tsx
│   │   │   ├── Modal.tsx
│   │   │   └── AlgerianGeoSelect.tsx # القوائم المترابطة (ولاية -> دائرة -> بلدية)
│   │   ├── product/
│   │   │   ├── ProductCard.tsx
│   │   │   ├── CartonUnitSelector.tsx # حاسبة وشراء الكراتين والحبات
│   │   │   └── StockBadge.tsx   # عرض المخزون بصيغة (X كرتون + Y حبة)
│   │   ├── order/
│   │   │   ├── OrderTimeline.tsx# مسار تتبع حالة الطلب وتاريخ التعديل
│   │   │   └── InvoiceView.tsx  # عرض وطباعة الفاتورة وسند التوصيل بالفرنسية
│   │   └── admin/
│   │       ├── AdminSidebar.tsx
│   │       ├── AdminHeader.tsx
│   │       ├── StatCard.tsx
│   │       └── PriceTierBadge.tsx
│   ├── layouts/
│   │   ├── MainLayout.tsx       # تخطيط المتجر العام
│   │   └── AdminLayout.tsx      # تخطيط لوحة التحكم
│   └── pages/
│       ├── public/
│       │   ├── HomePage.tsx
│       │   ├── ShopPage.tsx
│       │   ├── ProductDetailsPage.tsx
│       │   ├── CategoriesPage.tsx
│       │   ├── ContactPage.tsx
│       │   ├── TermsPage.tsx
│       │   └── PrivacyPage.tsx
│       ├── auth/
│       │   ├── LoginPage.tsx
│       │   ├── RegisterPage.tsx # نموذج التسجيل بالولاية والدائرة وكود المندوب
│       │   └── PendingApprovalPage.tsx # صفحة انتظار تفعيل الحساب من الإدارة
│       ├── customer/
│       │   ├── CartPage.tsx
│       │   ├── CheckoutPage.tsx # الدفع عند الاستلام والتأكيد الآمن
│       │   ├── CustomerOrdersPage.tsx
│       │   ├── OrderTrackingPage.tsx
│       │   └── ProfilePage.tsx
│       └── admin/
│           ├── DashboardPage.tsx
│           ├── CustomersPage.tsx
│           ├── ProductsPage.tsx
│           ├── ProductEditModal.tsx
│           ├── CategoriesPage.tsx
│           ├── OrdersPage.tsx
│           ├── OrderDetailAdminPage.tsx
│           ├── InventoryPage.tsx
│           ├── DeliveryZonesPage.tsx
│           ├── CommercialsPage.tsx
│           ├── PricingManagerPage.tsx
│           └── ReportsPage.tsx
```

---

## 4. تصميم قاعدة بيانات Firestore بالتفصيل (Collections Schema)

### 4.1. مجموعة المستخدمين `users/{uid}`
- `uid`: string (معرف Firebase Auth)
- `email`: string
- `role`: `'admin' | 'customer'`
- `status`: `'pending' | 'approved' | 'suspended' | 'rejected'`
- `priceTier`: `'GROS' | 'DEMI_GROS' | 'DETAIL' | null`
- `firstName`: string
- `lastName`: string
- `phone`: string (رقم جزائري مثل 05/06/07XXXXXXXX)
- `storeName`: string (اسم المحل / المؤسسة)
- `wilayaCode`: string (رقم الولاية مثلا "16")
- `wilayaName`: { ar: string, fr: string }
- `dairaName`: { ar: string, fr: string }
- `communeName`: { ar: string, fr: string }
- `address`: string
- `commercialId`: string | null (معرف المندوب المرتبط - غير قابل للتعديل من العميل)
- `commercialCode`: string | null (مثل "D01")
- `createdAt`: Timestamp
- `updatedAt`: Timestamp
- `approvedAt`: Timestamp | null
- `approvedBy`: string | null

### 4.2. مجموعة المنتجات العامة `products/{productId}`
(تحتوي على البيانات العامة التي يمكن للزائر والزبون قراءتها، **دون الأسعار الممنوعة**)
- `id`: string
- `sku`: string (فريد)
- `nameAr`: string
- `nameFr`: string
- `descriptionAr`: string
- `descriptionFr`: string
- `categoryId`: string
- `mainImage`: string
- `gallery`: string[]
- `unitsPerCarton`: number (عدد الحبات في الكرتون)
- `totalUnitsInStock`: number (إجمالي المخزون مقدراً بالحبة UNIT)
- `status`: `'active' | 'inactive' | 'out_of_stock' | 'draft'`
- `isDeleted`: boolean (لحذف المنطقي Soft Delete)
- `createdAt`: Timestamp
- `updatedAt`: Timestamp

### 4.3. مجموعة الأسعار الآمنة `productPrices/{productId}`
(معزولة عن قراءة العملاء المباشرة؛ تقرأ فقط من الـ Admin أو عبر Cloud Function)
- `productId`: string
- `grosCartonPrice`: number
- `grosUnitPrice`: number
- `demiGrosCartonPrice`: number
- `demiGrosUnitPrice`: number
- `detailCartonPrice`: number
- `detailUnitPrice`: number
- `updatedAt`: Timestamp
- `updatedBy`: string

### 4.4. مجموعة الأسعار المخصصة لكل زبون `customerProductPrices/{customPriceId}`
- `id`: string (عادة بصيغة `${userId}_${productId}`)
- `userId`: string
- `productId`: string
- `customCartonPrice`: number | null
- `customUnitPrice`: number | null
- `active`: boolean
- `note`: string
- `createdAt`: Timestamp
- `updatedAt`: Timestamp
- `updatedBy`: string

### 4.5. مجموعة الطلبات `orders/{orderId}`
- `orderId`: string (كود تسلسلي فريد، مثل `SEL-202611-0042`)
- `customerId`: string
- `customerInfo`: (نسخة ثابتة Snapshot)
  - `name`: string
  - `phone`: string
  - `storeName`: string
  - `priceTier`: `'GROS' | 'DEMI_GROS' | 'DETAIL'`
- `commercialId`: string | null
- `commercialCode`: string | null
- `shippingAddress`: (نسخة ثابتة Snapshot)
  - `wilayaCode`: string
  - `wilayaName`: { ar: string, fr: string }
  - `dairaName`: { ar: string, fr: string }
  - `communeName`: { ar: string, fr: string }
  - `detailedAddress`: string
- `items`: Array<{
  - `productId`: string
  - `sku`: string
  - `nameAr`: string
  - `nameFr`: string
  - `unitsPerCarton`: number
  - `cartonsQuantity`: number
  - `unitsQuantity`: number
  - `totalUnits`: number
  - `cartonPriceApplied`: number
  - `unitPriceApplied`: number
  - `priceSource`: `'CUSTOM' | 'TIER'`
  - `lineTotal`: number
}>
- `subtotal`: number
- `deliveryFee`: number
- `totalAmount`: number
- `paymentMethod`: `'COD'` (Cash on Delivery)
- `status`: `'NEW' | 'CONFIRMED' | 'PREPARING' | 'READY_TO_SHIP' | 'SHIPPED' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED'`
- `isDeleted`: boolean (Soft Delete)
- `deletedAt`: Timestamp | null
- `deletedBy`: string | null
- `deletionReason`: string | null
- `stockDeducted`: boolean
- `stockRestored`: boolean
- `stockRestoredAt`: Timestamp | null
- `internalNotes`: string | null (لا يراها الزبون أبداً)
- `customerNotes`: string | null (يراها الزبون)
- `createdAt`: Timestamp
- `updatedAt`: Timestamp

#### مجموعات فرعية داخل الطلب:
- `orders/{orderId}/tracking/{historyId}`:
  - `fromStatus`: OrderStatus
  - `toStatus`: OrderStatus
  - `changedAt`: Timestamp
  - `changedBy`: string (Admin ID)
  - `customerNote`: string | null
- `orders/{orderId}/auditLogs/{logId}`:
  - `action`: `'CREATED' | 'STATUS_CHANGED' | 'MODIFIED' | 'CANCELLED' | 'RESTORED' | 'SOFT_DELETED'`
  - `adminId`: string
  - `details`: any
  - `timestamp`: Timestamp

### 4.6. مجموعة حركات المخزون `stockMovements/{movementId}`
- `id`: string
- `productId`: string
- `type`: `'STOCK_ENTRY' | 'SALE' | 'ADJUSTMENT' | 'RETURN' | 'CANCELLATION'`
- `unitsDelta`: number (موجب للإضافة، سالب للخصم)
- `resultingTotalUnits`: number
- `referenceId`: string | null (مثلاً رقم الطلب `orderId`)
- `adminId`: string | null
- `reason`: string
- `createdAt`: Timestamp

### 4.7. مجموعة المندوبين التجاريين `commercials/{commercialId}`
- `id`: string
- `code`: string (فريد، مثلاً "D01")
- `fullName`: string
- `phone`: string
- `active`: boolean
- `wilayasCovered`: string[] (قائمة أرقام الولايات)
- `stats`:
  - `totalCustomers`: number
  - `totalOrders`: number
  - `totalSalesAmount`: number
  - `cancelledOrders`: number
- `createdAt`: Timestamp
- `updatedAt`: Timestamp

### 4.8. مجموعة مناطق التوصيل `deliveryZones/{wilayaCode}`
- `wilayaCode`: string
- `wilayaName`: { ar: string, fr: string }
- `enabled`: boolean
- `baseDeliveryFee`: number
- `communeOverrides`: Record<string, { enabled: boolean, fee: number }>
- `updatedAt`: Timestamp
- `updatedBy`: string

---

## 5. العلاقات بين Collections ونماذج الربط
- **User ⇄ Commercial**: الزبون يرتبط بمندوب عبر `commercialId` و `commercialCode` عند التسجيل. هذه العلاقة تُثبّت (Immutable) في مستند العميل وفي كل طلب يقوم به.
- **Product ⇄ Prices**: فصل مستند المنتج `products/{id}` (بيانات العرض العامة والمخزون) عن `productPrices/{id}` (بيانات الأسعار الثلاثية المحمية).
- **Customer ⇄ Custom Price**: جدول `customerProductPrices` يربط `userId` مع `productId`. عند تسعير المنتج لزبون معين، يتم التحقق أولاً من وجود مستند فعال هنا، وإذا لم يوجد يُعتمد `priceTier` الخاص بالزبون.
- **Order ⇄ Stock Movement**: تأكيد الطلب أو تعديله يولد وثيقة حركة في `stockMovements` ترتبط بـ `orderId` كمرجع وتحدث `totalUnitsInStock` في المنتج بشكل ذري.

---

## 6. نظام الصلاحيات والأمان (RBAC Matrix)

| الدور (Role) | تصفح المنتجات | رؤية الأسعار | إنشاء طلب | تتبع الطلبات | تعديل المخزون | لوحة المدير |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **Visitor (زائر غير مسجل)** | نعم | لا (تظهر رسالة "سجل لرؤية الأسعار") | لا | لا | لا | لا |
| **Pending Customer (زبون قيد المراجعة)** | نعم | لا | لا | لا | لا | لا |
| **Approved Customer (معتمد)** | نعم | نعم (فئته فقط أو سعره المخصص) | نعم (COD) | نعم (طلباته فقط) | لا | لا |
| **Admin (المدير)** | نعم | نعم (كافة الفئات والمخصصات) | نعم (نيابة عن زبون) | نعم (كافة الطلبات) | نعم | نعم (كاملة) |

### قواعد Firestore Security Rules الأساسية:
1. `Deny by default` لجميع المستندات.
2. مجموعة `productPrices` ومجموعة `settings` محظورة كلياً على القراءة المباشرة لغير الـ Admin (`request.auth.token.admin == true`).
3. مجموعة `orders`: الزبون يقرأ طلباته فقط (`resource.data.customerId == request.auth.uid`)، والملاحظات الداخلية `internalNotes` محجوبة عنه.
4. منع تعديل أو حذف مستندات الطلبات والمخزون من قبل العميل نهائياً (`allow write: if false`).

---

## 7. تصميم حماية الأسعار ومنع تسربها (Price Security Architecture)
1. **عزل البيانات**: جدول `productPrices` يحتوي أسعار الجملة، نصف الجملة، والتجزئة. لا يمتلك أي مستخدم غير مسجل أو زبون عادي صلاحية قراءة هذه المجموعة في `firestore.rules`.
2. **وساطة الخادم الآمنة (API / Functions)**:
   - عند طلب قائمة المنتجات من زبون معتمد، يرسل العميل الـ Auth Token.
   - تقوم الـ Function بالتأكد من أن الزبون `status === 'approved'` وتجلب `priceTier` المعتمد له.
   - تفحص ما إذا كان هناك سعر مخصص في `customerProductPrices`.
   - ترجع للزبون فقط السعر النهائي المسموح به لكل منتج (`myCartonPrice`, `myUnitPrice`).
3. **التحقق عند تأكيد الطلب**: عند تقديم الطلب، يقوم الخادم بحساب الأسعار من الصفر ولا يقبل أي قيمة سعرية مرسلة من متصفح الزبون.

---

## 8. تصميم البيع بالكرتون والحبة (Carton & Unit Engine)

- **وحدة التخزين الأساسية**: `UNIT` (الحبة).
- **المعادلة الثابتة للمخزون**:
  $$\text{Total Units} = (\text{Cartons} \times \text{UnitsPerCarton}) + \text{Units}$$
- **واجهة الشراء (CartonUnitSelector)**:
  - حقل إدخال لعدد الكراتين ($C \ge 0$).
  - حقل إدخال لعدد الحبات ($U \ge 0$).
  - الحساب اللحظي:
    $$\text{Units Needed} = (C \times \text{UnitsPerCarton}) + U$$
    $$\text{Line Total} = (C \times \text{CartonPrice}) + (U \times \text{UnitPrice})$$
- **عرض المخزون في لوحة الإدارة**:
  إذا كان المخزون $155$ حبة، وعدد الحبات في الكرتون $12$:
  $$\text{Cartons In Stock} = \lfloor 155 / 12 \rfloor = 12 \text{ Carton}$$
  $$\text{Units In Stock} = 155 \pmod{12} = 11 \text{ Unit}$$
  يتم عرضها دائماً: **12 كرتون + 11 حبة** (مع الإجمالي 155 حبة).

---

## 9. تصميم دورة حياة الطلبات والمخزون (Order Lifecycle & Concurrency)

```text
               ┌───────────────┐
               │  NOUVEAU      │ ── (الزبون ينشئ الطلب، الخادم يحجز/يخصم المخزون)
               └───────┬───────┘
                       │ (المدير يراجع ويؤكد يدوياً)
                       ▼
               ┌───────────────┐
               │  CONFIRMÉ     │
               └───────┬───────┘
                       │
                       ▼
               ┌───────────────┐
               │ EN PRÉPARATION│
               └───────┬───────┘
                       │
                       ▼
               ┌───────────────┐
               │PRÊT À EXPÉDIER│
               └───────┬───────┘
                       │
                       ▼
               ┌───────────────┐
               │   EXPÉDIÉ     │
               └───────┬───────┘
                       │
                       ▼
               ┌───────────────┐
               │EN COURS LIVR. │
               └───────┬───────┘
                       │
                       ▼
               ┌───────────────┐
               │    LIVRÉ      │ ── (تم التسليم بنجاح، تحصيل المبلغ)
               └───────────────┘

         [ مسار الإلغاء أو الحذف المنطقي ]
         Nouveau / Confirmé / etc. ──► CANCELLED / SOFT_DELETED
         (إعادة كمية المخزون بشكل ذري مرة واحدة فقط عبر stockRestored idempotency)
```

### معالجة التزامن والتعديل الآمن (Firestore Transactions):
- خصم المخزون يتم داخل Transaction تتحقق من:
  `if (product.totalUnitsInStock < requestedUnits) throw new Error("INSUFFICIENT_STOCK")`.
- عند تعديل المدير للكميات في طلب سابق:
  $$\Delta = \text{NewTotalUnits} - \text{OldTotalUnits}$$
  - إذا كانت $\Delta > 0$ يتم التأكد من توفر الكمية الإضافية وخصمها.
  - إذا كانت $\Delta < 0$ يتم إرجاع الفارق للمخزون فوراً.
  - يسجل الفرق في `stockMovements` وتُحفظ نسخة تدقيق في `orders/{id}/auditLogs`.

---

## 10. قائمة الـ Server Endpoints & Cloud Functions

1. `registerCustomer`: تسجيل زبون جديد بحالة `pending` وتدقيق كود المندوب الجغرافي وتثبيته.
2. `validateCommercialCode`: التحقق الفوري من صلاحية كود المندوب أثناء إدخاله في النموذج.
3. `approveCustomer`: تفعيل حساب الزبون وتعيين فئة السعر (`GROS`، `DEMI_GROS`، أو `DETAIL`).
4. `getAuthorizedProductPrices`: إرجاع أسعار المنتجات المخصصة أو الفئوية للزبون فقط.
5. `createOrder`: فحص المخزون الذري، احتساب رسوم التوصيل، تثبيت Snapshots للمنتج والسعر، وإنشاء الطلب.
6. `updateOrder`: تعديل كميات أو منتجات الطلب مع إدارة فروق المخزون ذرياً وتحديث الفاتورة.
7. `updateOrderStatus`: ترقية حالة الطلب يدوياً مع تسجيل المعرف والوقت والملاحظات.
8. `cancelOrder`: إلغاء الطلب وإرجاع المخزون بطريقة idempotent تمنع التكرار.
9. `softDeleteOrder`: وسم الطلب كـ `deleted: true` مع الحفاظ على الأرشيف والبيانات المالية.
10. `assignCustomerPrice`: تحديد أو إزالة سعر خاص لزبون معين على منتج محدد.
11. `getCommercialReports`: احتساب مبيعات وعمولات المندوب بناءً على الطلبات المسلمة خلال فترة زمنية.
12. `generateInvoicePdf`: توليد وثيقة Facture أو Bon de livraison باللغة الفرنسية فقط.

---

## 11. إعداد Firebase المطلوب
- **Authentication**: Email/Password Provider.
- **Firestore Database**: وضع Native في منطقة قريبة من الجزائر (مثل `europe-west1` أو `europe-west2`).
- **Storage**: تخزين صور المنتجات والمرفقات.
- **Rules Deploy**: نشر `firestore.rules` و `storage.rules`.

---

## 12. خطة الاختبار والأمان (Security & Testing Protocol)
1. **اختبارات الصلاحيات (RBAC)**: محاولة زبون قراءة بيانات زبون آخر أو الوصول لمجموعة `productPrices` (يجب أن تفشل برفض صريح `PERMISSION_DENIED`).
2. **اختبار تسرب الأسعار (Zero-Leak Test)**: التأكد من أن حزم الشبكة (Network Payload) للزبون لا تحتوي سوى على السعر المسموح به لحسابه.
3. **اختبار التزامن والمخزون السالب**: محاكاة طلبين متزامنين لآخر وحدة متبقية والتأكد من نجاح الأول ورفض الثاني برسالة نفاذ المخزون.
4. **اختبار عدم تكرار استرجاع المخزون (Idempotency)**: استدعاء دالة الإلغاء عدة مرات والتأكد من أن المخزون يزاد مرة واحدة فقط.
5. **اختبار لغة الفواتير**: التأكد من أن جميع عناصر الفاتورة وبون التوصيل مكتوبة بالفرنسية حصراً بصرف النظر عن لغة الجلسة الحالية.
