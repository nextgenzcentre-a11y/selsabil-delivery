/**
 * SELSABIL DELIVERY - Complete Arabic and French Dictionaries
 * Arabic: Default (RTL)
 * French: (LTR)
 * Invoices and Delivery notes are ALWAYS in French.
 */

export const translations = {
  ar: {
    brand: 'سلسبيل للتوصيل',
    brandSubtitle: 'منصة التجارة الإلكترونية بالجملة والتجزئة - الجزائر',
    dir: 'rtl',
    lang: 'العربية',
    switchLang: 'Passer en Français',

    // Navigation
    nav: {
      home: 'الرئيسية',
      shop: 'المتجر',
      categories: 'التصنيفات',
      cart: 'السلة',
      myOrders: 'طلباتي',
      trackOrder: 'تتبع الطلب',
      contact: 'اتصل بنا',
      login: 'تسجيل الدخول',
      register: 'إنشاء حساب تاجر',
      logout: 'تسجيل الخروج',
      account: 'حسابي',
      adminDashboard: 'لوحة الإدارة',
      terms: 'الشروط والأحكام',
      privacy: 'سياسة الخصوصية',
    },

    // Badges & Statuses
    status: {
      pending: 'قيد المراجعة',
      approved: 'معتمد ومفعّل',
      suspended: 'معلّق',
      rejected: 'مرفوض',
      active: 'نشط',
      inactive: 'غير نشط',
      outOfStock: 'نفد من المخزون',
      draft: 'مسودة',
      nouveau: 'طلب جديد',
      confirme: 'مؤكد',
      enPreparation: 'قيد التحضير',
      pretAExpedier: 'جاهز للشحن',
      expedie: 'تم الشحن',
      enCoursDeLivraison: 'في طريق التوصيل',
      livre: 'تم التسليم بنجاح',
      annule: 'ملغى',
    },

    // Price tiers
    tiers: {
      GROS: 'سعر الجملة (Gros)',
      DEMI_GROS: 'سعر نصف الجملة (Demi-Gros)',
      DETAIL: 'سعر التجزئة (Détail)',
      customPrice: 'سعر مخصص لك',
      loginToViewPrices: 'سجّل الدخول كتاجر معتمد لمشاهدة أسعارك',
      pendingNotice: 'حسابك قيد التدقيق من الإدارة لتحديد فئة الأسعار المناسبة لك.',
    },

    // Product & Units
    product: {
      sku: 'الرمز (SKU)',
      carton: 'كرتون',
      cartons: 'كراتين',
      unit: 'حبة',
      units: 'حبات',
      unitsPerCarton: 'حبة في الكرتون',
      stockAvailable: 'المخزون المتوفر',
      inStockDisplay: 'متوفر: {cartons} كرتون + {units} حبة',
      cartonPrice: 'سعر الكرتون',
      unitPrice: 'سعر الحبة',
      addToCart: 'إضافة للسلة',
      chooseQuantity: 'حدد الكمية المطلوبة',
      totalUnitsRequested: 'إجمالي الحبات:',
      subtotalForProduct: 'المجموع:',
      category: 'التصنيف',
      allCategories: 'جميع التصنيفات',
      searchPlaceholder: 'ابحث باسم المنتج أو الرمز (SKU)...',
      noProductsFound: 'لم يتم العثور على أي منتج يطابق بحثك.',
      details: 'تفاصيل المنتج',
    },

    // Cart & Checkout
    cart: {
      title: 'سلة المشتريات',
      empty: 'سلة المشتريات فارغة حالياً',
      startShopping: 'ابدأ التسوق وتصفح المنتجات',
      productHeader: 'المنتج',
      quantityHeader: 'الكمية (كرتون / حبة)',
      priceHeader: 'السعر المعتمد',
      totalHeader: 'الإجمالي',
      summary: 'ملخص الطلب',
      subtotal: 'المجموع الفرعي للمنتجات',
      deliveryFee: 'رسوم التوصيل',
      totalToPay: 'الإجمالي للدفع عند الاستلام',
      checkoutBtn: 'تأكيد الطلب الآن (COD)',
      paymentMethodNotice: 'طريقة الدفع الحالية: الدفع نقداً عند الاستلام (Paiement à la livraison)',
      stockWarning: 'تنبيه: الكمية المطلوبة تتجاوز المخزون الفعلي.',
    },

    // Checkout Form
    checkout: {
      title: 'إتمام وتأكيد الطلب',
      shippingInfo: 'عنوان ومعلومات التوصيل',
      receiverName: 'الاسم الكامل للتاجر / المستلم',
      phone: 'رقم الهاتف للتواصل',
      storeName: 'اسم المحل التجاري',
      wilaya: 'الولاية',
      daira: 'الدائرة',
      commune: 'البلدية',
      addressDetails: 'العنوان التفصيلي (الشارع، نقطة دالة)',
      commercialRep: 'المندوب التجاري المنسوب',
      confirmButton: 'تأكيد وإرسال الطلب نهائياً',
      orderSuccess: 'تم تأكيد طلبك بنجاح! رقم طلبك:',
      orderSuccessNote: 'سيقوم فريق التوزيع بالاتصال بكم لتأكيد موعد التسليم.',
    },

    // Commercial Representative
    commercial: {
      codeLabel: 'كود المندوب التجاري (Code Commercial)',
      codePlaceholder: 'مثال: D01',
      optionalNotice: 'إذا كان لديك كود مندوب سلسبيل، أدخله هنا لربط حسابك به',
      validCode: 'كود المندوب صالح ومعتمد',
      invalidCode: 'عذراً، هذا الكود غير موجود أو غير نشط حالياً',
    },

    // Registration & Auth
    auth: {
      loginTitle: 'تسجيل الدخول إلى حسابك',
      registerTitle: 'طلب فتح حساب تاجر جديد',
      email: 'البريد الإلكتروني',
      password: 'كلمة المرور',
      confirmPassword: 'تأكيد كلمة المرور',
      firstName: 'الاسم الشخصي',
      lastName: 'اللقب',
      phonePlaceholder: '05 / 06 / 07 XX XX XX XX',
      loginBtn: 'دخول',
      registerBtn: 'إرسال طلب التسجيل',
      alreadyHaveAccount: 'هل لديك حساب مسجل بالفعل؟',
      noAccount: 'ليس لديك حساب بعد؟ افتح حساب تاجر الآن',
      pendingAccountTitle: 'طلب حسابك قيد المراجعة',
      pendingAccountMsg: 'شكراً لتسجيلك في سلسبيل للتوصيل! حسابك التجاري قيد المراجعة من طرف إدارة المبيعات لتعيين فئة التسعير المناسبة لك وتفعيله. سنتصل بك قريباً.',
    },

    // Admin Dashboard
    admin: {
      dashboard: 'لوحة القيادة',
      clients: 'إدارة الزبائن',
      products: 'إدارة المنتجات',
      categories: 'التصنيفات',
      orders: 'إدارة الطلبات',
      stock: 'إدارة المخزون',
      delivery: 'مناطق التوصيل',
      commercials: 'إدارة المندوبين',
      pricing: 'إدارة الأسعار والتخصيص',
      reports: 'التقارير المالية والمبيعات',
      settings: 'الإعدادات العامة',
      totalRevenue: 'إجمالي المبيعات المحققة',
      totalOrders: 'إجمالي الطلبات',
      pendingClients: 'زبائن قيد الموافقة',
      lowStockProducts: 'منتجات قريبة من النفاد',
      actions: 'الإجراءات',
      approve: 'موافقة واعتماد',
      suspend: 'تعليق الحساب',
      assignTier: 'تعيين فئة السعر',
      printInvoice: 'طباعة الفاتورة (Facture FR)',
      printDeliverySlip: 'طباعة سند التسليم (Bon de livraison FR)',
    },

    // Common
    common: {
      currency: 'د.ج',
      search: 'بحث',
      filter: 'تصفية',
      save: 'حفظ',
      cancel: 'إلغاء',
      edit: 'تعديل',
      delete: 'حذف',
      close: 'إغلاق',
      date: 'التاريخ',
      status: 'الحالة',
      notes: 'الملاحظات',
      customerNote: 'ملاحظة للزبون',
      internalNote: 'ملاحظة داخلية خاصة بالإدارة فقط',
      loading: 'جاري التحميل...',
    },
  },

  fr: {
    brand: 'SELSABIL DELIVERY',
    brandSubtitle: 'Plateforme E-commerce B2B & B2C — Algérie',
    dir: 'ltr',
    lang: 'Français',
    switchLang: 'التبديل إلى العربية',

    // Navigation
    nav: {
      home: 'Accueil',
      shop: 'Boutique',
      categories: 'Catégories',
      cart: 'Panier',
      myOrders: 'Mes commandes',
      trackOrder: 'Suivi de commande',
      contact: 'Contact',
      login: 'Connexion',
      register: 'Créer un compte',
      logout: 'Déconnexion',
      account: 'Mon compte',
      adminDashboard: 'Tableau de bord Admin',
      terms: 'Conditions générales',
      privacy: 'Politique de confidentialité',
    },

    // Badges & Statuses
    status: {
      pending: 'En attente',
      approved: 'Approuvé',
      suspended: 'Suspendu',
      rejected: 'Refusé',
      active: 'Actif',
      inactive: 'Inactif',
      outOfStock: 'Épuisé',
      draft: 'Brouillon',
      nouveau: 'Nouveau',
      confirme: 'Confirmé',
      enPreparation: 'En préparation',
      pretAExpedier: 'Prêt à expédier',
      expedie: 'Expédié',
      enCoursDeLivraison: 'En cours de livraison',
      livre: 'Livré',
      annule: 'Annulé',
    },

    // Price tiers
    tiers: {
      GROS: 'Prix de Gros',
      DEMI_GROS: 'Prix Demi-Gros',
      DETAIL: 'Prix Détail',
      customPrice: 'Tarif personnalisé',
      loginToViewPrices: 'Connectez-vous pour voir vos tarifs professionnels',
      pendingNotice: 'Votre compte est en cours de validation par notre administration pour attribuer votre grille tarifaire.',
    },

    // Product & Units
    product: {
      sku: 'SKU',
      carton: 'Carton',
      cartons: 'Cartons',
      unit: 'Unité',
      units: 'Unités',
      unitsPerCarton: 'Unités / Carton',
      stockAvailable: 'Stock disponible',
      inStockDisplay: 'Disponible : {cartons} Cartons + {units} Unités',
      cartonPrice: 'Prix Carton',
      unitPrice: 'Prix Unité',
      addToCart: 'Ajouter au panier',
      chooseQuantity: 'Sélectionner la quantité',
      totalUnitsRequested: 'Total unités calculé :',
      subtotalForProduct: 'Total produit :',
      category: 'Catégorie',
      allCategories: 'Toutes les catégories',
      searchPlaceholder: 'Rechercher par nom de produit ou SKU...',
      noProductsFound: 'Aucun produit ne correspond à votre recherche.',
      details: 'Détails du produit',
    },

    // Cart & Checkout
    cart: {
      title: 'Mon Panier',
      empty: 'Votre panier est actuellement vide',
      startShopping: 'Explorer notre catalogue',
      productHeader: 'Désignation',
      quantityHeader: 'Quantité (Cartons / Unités)',
      priceHeader: 'Prix appliqué',
      totalHeader: 'Total',
      summary: 'Récapitulatif de la commande',
      subtotal: 'Sous-total produits',
      deliveryFee: 'Frais de livraison',
      totalToPay: 'Total à payer à la livraison',
      checkoutBtn: 'Valider ma commande (Paiement à la livraison)',
      paymentMethodNotice: 'Mode de paiement : Paiement en espèces à la livraison (Cash on Delivery)',
      stockWarning: 'Attention : La quantité demandée dépasse le stock actuel.',
    },

    // Checkout Form
    checkout: {
      title: 'Validation de commande',
      shippingInfo: 'Informations de livraison',
      receiverName: 'Nom complet du commerçant / destinataire',
      phone: 'Numéro de téléphone',
      storeName: 'Nom du magasin / établissement',
      wilaya: 'Wilaya',
      daira: 'Daïra',
      commune: 'Commune',
      addressDetails: 'Adresse exacte (Rue, repère)',
      commercialRep: 'Commercial associé',
      confirmButton: 'Confirmer la commande définitivement',
      orderSuccess: 'Votre commande a été enregistrée avec succès ! N° de commande :',
      orderSuccessNote: 'Notre service logistique vous contactera sous peu pour organiser la livraison.',
    },

    // Commercial Representative
    commercial: {
      codeLabel: 'Code commercial (D01, D02...)',
      codePlaceholder: 'Exemple : D01',
      optionalNotice: 'Si vous avez été contacté par un commercial Selsabil, renseignez son code',
      validCode: 'Code commercial valide et actif',
      invalidCode: 'Code commercial inexistant ou inactif',
    },

    // Registration & Auth
    auth: {
      loginTitle: 'Connexion à votre compte',
      registerTitle: 'Demande d’ouverture de compte professionnel',
      email: 'Adresse email',
      password: 'Mot de passe',
      confirmPassword: 'Confirmer le mot de passe',
      firstName: 'Prénom',
      lastName: 'Nom',
      phonePlaceholder: '05 / 06 / 07 XX XX XX XX',
      loginBtn: 'Se connecter',
      registerBtn: 'Envoyer ma demande d’inscription',
      alreadyHaveAccount: 'Vous avez déjà un compte ?',
      noAccount: 'Pas encore de compte ? Inscrivez votre magasin',
      pendingAccountTitle: 'Compte en attente d’approbation',
      pendingAccountMsg: 'Merci pour votre inscription ! Votre compte commerçant est en cours de vérification par notre direction commerciale pour vous attribuer votre niveau de prix. Nous vous contacterons très prochainement.',
    },

    // Admin Dashboard
    admin: {
      dashboard: 'Tableau de bord',
      clients: 'Gestion des clients',
      products: 'Gestion des produits',
      categories: 'Catégories',
      orders: 'Gestion des commandes',
      stock: 'Gestion du stock',
      delivery: 'Zones de livraison',
      commercials: 'Gestion des commerciaux',
      pricing: 'Gestion des prix et remises',
      reports: 'Rapports & Statistiques',
      settings: 'Paramètres système',
      totalRevenue: 'Chiffre d’affaires',
      totalOrders: 'Total des commandes',
      pendingClients: 'Clients en attente',
      lowStockProducts: 'Produits en rupture imminente',
      actions: 'Actions',
      approve: 'Approuver le client',
      suspend: 'Suspendre le compte',
      assignTier: 'Définir la catégorie de prix',
      printInvoice: 'Imprimer Facture (FR)',
      printDeliverySlip: 'Imprimer Bon de livraison (FR)',
    },

    // Common
    common: {
      currency: 'DA',
      search: 'Rechercher',
      filter: 'Filtrer',
      save: 'Enregistrer',
      cancel: 'Annuler',
      edit: 'Modifier',
      delete: 'Supprimer',
      close: 'Fermer',
      date: 'Date',
      status: 'Statut',
      notes: 'Notes',
      customerNote: 'Note pour le client',
      internalNote: 'Note interne privée (Admin)',
      loading: 'Chargement en cours...',
    },
  },
};

export type Language = 'ar' | 'fr';
export type TranslationDictionary = typeof translations.ar;
