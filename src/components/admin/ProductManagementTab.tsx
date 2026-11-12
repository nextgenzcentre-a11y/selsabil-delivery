import React, { useState } from 'react';
import {
  Package,
  Plus,
  FileSpreadsheet,
  Download,
  UploadCloud,
  Edit3,
  Trash2,
  Eye,
  EyeOff,
  Image as ImageIcon,
  CheckCircle,
  AlertCircle,
  Search,
  Filter,
  Check,
  X,
  History,
  Layers,
  Sparkles,
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { ProductWithPrices } from '../../data/sampleProducts';
import {
  StockMovement,
  ExcelProductRow,
  addSingleProduct,
  updateProductDetails,
  toggleProductVisibility,
  softDeleteProduct,
  batchImportExcelProducts,
} from '../../services/productService';

interface ProductManagementTabProps {
  products: ProductWithPrices[];
  stockMovements: StockMovement[];
  onRefresh: () => void;
  language: 'ar' | 'fr';
  currency: string;
}

// Preset curated Algerian wholesale images for 1-click selection
const ALGERIAN_IMAGE_PRESETS = [
  {
    name: 'زيت المائدة سيفيتال / إيليو 5L',
    url: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'طماطم مصبرة كاب / بن عمر 800g',
    url: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'قهوة مطحونة فاميكو / بونال 250g',
    url: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'عجائن وكسكسي ماما / سيم 1kg',
    url: 'https://images.unsplash.com/photo-1551462147-ff29053bfc14?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'مشروبات وعصائر رامي / إفروي 1L',
    url: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'مسحوق غسيل إيزيس / أومو 3kg',
    url: 'https://images.unsplash.com/photo-1585421514738-01798e348b17?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'سكر أبيض سيفيتال 1kg',
    url: 'https://images.unsplash.com/photo-1581600140682-d4e68c8cde32?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'مياه معدنية لالة خديجة 1.5L',
    url: 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?auto=format&fit=crop&w=600&q=80',
  },
];

export const ProductManagementTab: React.FC<ProductManagementTabProps> = ({
  products,
  stockMovements,
  onRefresh,
  language,
  currency,
}) => {
  // Search and filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [showMovementsLog, setShowMovementsLog] = useState(false);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<{
    text: string;
    type: 'success' | 'error';
  } | null>(null);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3800);
  };

  // ----------------------------------------------------
  // 1. ADD SINGLE PRODUCT MODAL STATE
  // ----------------------------------------------------
  const [showAddModal, setShowAddModal] = useState(false);
  const [addSku, setAddSku] = useState('');
  const [addNameAr, setAddNameAr] = useState('');
  const [addNameFr, setAddNameFr] = useState('');
  const [addCategory, setAddCategory] = useState('cat-alimentaire');
  const [addUnitsPerCarton, setAddUnitsPerCarton] = useState<number>(12);
  const [addInitialCartons, setAddInitialCartons] = useState<number>(50);
  const [addDetailUnitPrice, setAddDetailUnitPrice] = useState<number>(250);
  const [addDemiGrosUnitPrice, setAddDemiGrosUnitPrice] = useState<number>(230);
  const [addGrosUnitPrice, setAddGrosUnitPrice] = useState<number>(215);
  const [addImageUrl, setAddImageUrl] = useState(ALGERIAN_IMAGE_PRESETS[0].url);

  // ----------------------------------------------------
  // 2. EXCEL BULK IMPORT MODAL STATE
  // ----------------------------------------------------
  const [showExcelModal, setShowExcelModal] = useState(false);
  const [excelRows, setExcelRows] = useState<ExcelProductRow[]>([]);
  const [excelFileName, setExcelFileName] = useState('');
  const [excelError, setExcelError] = useState<string | null>(null);
  const [defaultUnitsPerCarton, setDefaultUnitsPerCarton] = useState<number>(12);
  const [defaultCartonsStock, setDefaultCartonsStock] = useState<number>(15);
  const [defaultCategory, setDefaultCategory] = useState('cat-alimentaire');
  const [isImporting, setIsImporting] = useState(false);

  // ----------------------------------------------------
  // 3. EDIT PRODUCT MODAL STATE
  // ----------------------------------------------------
  const [editingItem, setEditingItem] = useState<ProductWithPrices | null>(null);
  const [editSku, setEditSku] = useState('');
  const [editNameAr, setEditNameAr] = useState('');
  const [editNameFr, setEditNameFr] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editUnitsPerCarton, setEditUnitsPerCarton] = useState<number>(12);
  const [editAddCartons, setEditAddCartons] = useState<number>(0);
  const [editDetailUnitPrice, setEditDetailUnitPrice] = useState<number>(0);
  const [editDemiGrosUnitPrice, setEditDemiGrosUnitPrice] = useState<number>(0);
  const [editGrosUnitPrice, setEditGrosUnitPrice] = useState<number>(0);
  const [editImageUrl, setEditImageUrl] = useState('');

  // ----------------------------------------------------
  // 4. DELETE CONFIRMATION STATE
  // ----------------------------------------------------
  const [deletingItem, setDeletingItem] = useState<ProductWithPrices | null>(null);

  // Filtered products list (excluding soft deleted items)
  const visibleProducts = products.filter(({ product }) => {
    if (product.isDeleted) return false;
    if (statusFilter !== 'all' && product.status !== statusFilter) return false;
    if (categoryFilter !== 'all' && product.categoryId !== categoryFilter) return false;
    const term = searchQuery.toLowerCase().trim();
    if (term) {
      const matchAr = product.nameAr.toLowerCase().includes(term);
      const matchFr = product.nameFr.toLowerCase().includes(term);
      const matchSku = product.sku.toLowerCase().includes(term);
      if (!matchAr && !matchFr && !matchSku) return false;
    }
    return true;
  });

  // Open Edit Modal
  const handleOpenEdit = (item: ProductWithPrices) => {
    setEditingItem(item);
    setEditSku(item.product.sku);
    setEditNameAr(item.product.nameAr);
    setEditNameFr(item.product.nameFr);
    setEditCategory(item.product.categoryId);
    setEditUnitsPerCarton(item.product.unitsPerCarton);
    setEditAddCartons(0);
    setEditDetailUnitPrice(item.prices.detailUnitPrice);
    setEditDemiGrosUnitPrice(item.prices.demiGrosUnitPrice);
    setEditGrosUnitPrice(item.prices.grosUnitPrice);
    setEditImageUrl(item.product.mainImage);
  };

  // Submit Add Single Product
  const handleCreateSingleProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addNameAr.trim()) {
      showToast('يرجى كتابة اسم السلعة بالعربية على الأقل', 'error');
      return;
    }
    if (addDetailUnitPrice <= 0 || addGrosUnitPrice <= 0) {
      showToast('يرجى تحديد أسعار صالحة للسلعة (سعر الحبة)', 'error');
      return;
    }

    const skuToUse =
      addSku.trim() || `SEL-${Math.floor(1000 + Math.random() * 9000)}`;

    addSingleProduct({
      sku: skuToUse,
      nameAr: addNameAr.trim(),
      nameFr: addNameFr.trim() || addNameAr.trim(),
      descriptionAr: addNameAr.trim(),
      descriptionFr: addNameFr.trim() || addNameAr.trim(),
      categoryId: addCategory,
      mainImage: addImageUrl,
      unitsPerCarton: addUnitsPerCarton,
      initialCartons: addInitialCartons,
      detailUnitPrice: addDetailUnitPrice,
      demiGrosUnitPrice: addDemiGrosUnitPrice || Math.round(addDetailUnitPrice * 0.92),
      grosUnitPrice: addGrosUnitPrice || Math.round(addDetailUnitPrice * 0.85),
    });

    onRefresh();
    setShowAddModal(false);
    // Reset form
    setAddSku('');
    setAddNameAr('');
    setAddNameFr('');
    setAddInitialCartons(50);
    showToast(
      language === 'ar'
        ? `تمت إضافة السلعة "${addNameAr}" بنجاح إلى المستودع!`
        : `Produit "${addNameAr}" ajouté avec succès au stock!`
    );
  };

  // Submit Edit Product
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    updateProductDetails(editingItem.product.id, {
      sku: editSku,
      nameAr: editNameAr,
      nameFr: editNameFr,
      categoryId: editCategory,
      mainImage: editImageUrl,
      unitsPerCarton: editUnitsPerCarton,
      addCartonsDelta: editAddCartons,
      detailUnitPrice: editDetailUnitPrice,
      demiGrosUnitPrice: editDemiGrosUnitPrice,
      grosUnitPrice: editGrosUnitPrice,
    });

    onRefresh();
    setEditingItem(null);
    showToast(
      language === 'ar'
        ? 'تم تحديث بيانات السلعة والأسعار والصور بنجاح!'
        : 'Données du produit mises à jour avec succès!'
    );
  };

  // Toggle Visibility (Hide / Show)
  const handleToggleHide = (productId: string, currentStatus: string) => {
    const updated = toggleProductVisibility(productId);
    onRefresh();
    if (updated) {
      if (updated.product.status === 'inactive') {
        showToast(
          language === 'ar'
            ? 'تم إخفاء السلعة من المتجر، ولن تظهر للزبائن الآن'
            : 'Produit masqué du magasin avec succès'
        );
      } else {
        showToast(
          language === 'ar'
            ? 'تم إظهار السلعة في المتجر وأصبحت متاحة للطلب'
            : 'Produit rendu visible aux clients'
        );
      }
    }
  };

  // Soft Delete Product
  const handleConfirmDelete = () => {
    if (!deletingItem) return;
    softDeleteProduct(deletingItem.product.id);
    onRefresh();
    const name = deletingItem.product.nameAr;
    setDeletingItem(null);
    showToast(
      language === 'ar'
        ? `تم حذف السلعة "${name}" من الكتالوج بنجاح`
        : `Produit "${name}" supprimé avec succès`
    );
  };

  // Download Sample Excel Template
  const handleDownloadExcelTemplate = () => {
    const wsData = [
      ['اسم السلعة', 'سعر detail', 'سعر demi gros', 'سعر gros'],
      ['زيت إيليو 5 لتر Elio', 650, 620, 600],
      ['طماطم مصبرة كاب 800غ Cab', 260, 245, 235],
      ['سكر أبيض سيفيتال 1 كغ Cevital', 110, 102, 98],
      ['قهوة فاميكو 250غ Famico', 240, 220, 210],
      ['عجائن سميد سيم 500غ Sim', 90, 82, 78],
      ['حليب مجفف كانديا 500غ Candia', 480, 450, 430],
      ['مسحوق غسيل إيزيس 3 كغ Isis', 520, 490, 470],
    ];
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    ws['!cols'] = [{ wch: 35 }, { wch: 18 }, { wch: 20 }, { wch: 18 }];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'MODELE_PRODUITS');
    XLSX.writeFile(wb, 'SELSABIL_MODELE_IMPORT_PRODUITS.xlsx');
  };

  // Parse Excel File on Upload
  const handleExcelUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setExcelFileName(file.name);
    setExcelError(null);

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const buffer = evt.target?.result as ArrayBuffer;
        const wb = XLSX.read(new Uint8Array(buffer), { type: 'array' });
        const sheetName = wb.SheetNames[0];
        const ws = wb.Sheets[sheetName];
        const rawData: any[][] = XLSX.utils.sheet_to_json(ws, { header: 1 });

        if (!rawData || rawData.length < 2) {
          setExcelError('الملف فارغ أو لا يحتوي على صفوف بيانات.');
          return;
        }

        // Data rows without header
        const rows = rawData.slice(1);
        const parsedRows: ExcelProductRow[] = [];

        rows.forEach((r) => {
          const name = r[0] ? String(r[0]).trim() : '';
          const detail = parseFloat(r[1]) || 0;
          const demi = parseFloat(r[2]) || (detail > 0 ? Math.round(detail * 0.92) : 0);
          const gros = parseFloat(r[3]) || (detail > 0 ? Math.round(detail * 0.85) : 0);

          if (name && detail > 0) {
            parsedRows.push({
              name,
              detailPrice: detail,
              demiGrosPrice: demi,
              grosPrice: gros,
              unitsPerCarton: defaultUnitsPerCarton,
              cartonsStock: defaultCartonsStock,
              category: defaultCategory,
            });
          }
        });

        if (parsedRows.length === 0) {
          setExcelError(
            'لم يتم استخراج أي سلع صالحة. تأكد من تطابق الأعمدة الأربعة: (اسم السلعة، سعر detail، سعر demi gros، سعر gros).'
          );
        } else {
          setExcelRows(parsedRows);
        }
      } catch (err: any) {
        setExcelError('تعذر تحليل ملف الإكسل: ' + err.message);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  // Execute Excel Batch Import
  const handleExecuteBatchImport = () => {
    if (excelRows.length === 0) return;
    setIsImporting(true);

    // Apply defaults to rows before import
    const rowsToImport = excelRows.map((r) => ({
      ...r,
      unitsPerCarton: defaultUnitsPerCarton,
      cartonsStock: defaultCartonsStock,
      category: defaultCategory,
    }));

    const added = batchImportExcelProducts(rowsToImport);
    onRefresh();
    setIsImporting(false);
    setShowExcelModal(false);
    setExcelRows([]);
    setExcelFileName('');
    showToast(
      language === 'ar'
        ? `تم استيراد ${added} سلعة بنجاح إلى المستودع والكتالوج!`
        : `${added} produits importés avec succès dans le catalogue!`
    );
  };

  // Convert uploaded image to Data URL
  const handleImageFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (url: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      if (evt.target?.result) {
        setter(evt.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div
          className={`p-3.5 rounded-xl border text-xs font-semibold flex items-center justify-between shadow-md transition ${
            toastMessage.type === 'success'
              ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
              : 'bg-red-50 border-red-300 text-red-900'
          }`}
        >
          <div className="flex items-center gap-2">
            {toastMessage.type === 'success' ? (
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            )}
            <span>{toastMessage.text}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-stone-400 hover:text-stone-700">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Header with Required Action Buttons */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-xs p-6 space-y-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200 mb-1.5">
              <Package className="w-3.5 h-3.5 text-emerald-700" />
              <span>SELSABIL INVENTORY & PRODUCT ENGINE</span>
            </div>
            <h2 className="text-xl font-black text-stone-900 tracking-tight">
              {language === 'ar' ? 'إدارة المنتجات والمخزون والأسعار' : 'Gestion des Produits & Stocks'}
            </h2>
            <p className="text-xs text-stone-500 mt-1">
              {language === 'ar'
                ? 'إدراج السلع مع الصور، استيراد دفعات عبر ملف إكسل، أسعار الحبة للفئات الثلاث، إخفاء/إظهار، وحذف السلع'
                : 'Ajout de produits avec photos, import Excel, gestion des 3 barèmes, masquage et suppression'}
            </p>
          </div>

          {/* TWO PRIMARY REQUIRED BUTTONS */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Button 1: Add Single Product with Images */}
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-[#0F392B] hover:bg-[#16543F] text-white text-xs font-bold rounded-lg shadow-xs transition"
            >
              <Plus className="w-4 h-4" />
              <ImageIcon className="w-4 h-4 text-amber-300" />
              <span>{language === 'ar' ? 'إضافة سلعة جديدة (مع الصور)' : 'Ajouter un Produit (avec photo)'}</span>
            </button>

            {/* Button 2: Bulk Import via Excel */}
            <button
              onClick={() => setShowExcelModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-stone-900 text-xs font-black rounded-lg shadow-xs transition"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>
                {language === 'ar' ? 'إدراج سلع بواسطة ملف إكسل' : 'Importer via Excel (XLSX)'}
              </span>
            </button>

            {/* Toggle Stock Movements Log */}
            <button
              onClick={() => setShowMovementsLog(!showMovementsLog)}
              className="flex items-center gap-1.5 px-3 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-lg border border-stone-200 transition"
              title="عرض سجل حركات المستودع"
            >
              <History className="w-3.5 h-3.5 text-stone-500" />
              <span>{language === 'ar' ? 'سجل الحركات' : 'Historique'}</span>
            </button>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2 border-t border-stone-100">
          <div className="sm:col-span-2 relative">
            <Search className="w-4 h-4 absolute top-2.5 start-3 text-stone-400" />
            <input
              type="text"
              placeholder={
                language === 'ar'
                  ? 'ابحث باسم السلعة بالعربية أو الفرنسية، أو كود SKU...'
                  : 'Rechercher par nom (AR/FR) ou SKU...'
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-stone-50 border border-stone-300 rounded-lg py-2 ps-9 pe-3 text-xs text-stone-900 focus:outline-emerald-800"
            />
          </div>

          <div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-xs font-semibold text-stone-800 focus:outline-emerald-800"
            >
              <option value="all">{language === 'ar' ? 'جميع التصنيفات' : 'Toutes les catégories'}</option>
              <option value="cat-alimentaire">{language === 'ar' ? 'مواد غذائية وزيوت' : 'Alimentaire'}</option>
              <option value="cat-conserves">{language === 'ar' ? 'معلبات ومصبرات' : 'Conserves'}</option>
              <option value="cat-boissons">{language === 'ar' ? 'قهوة ومشروبات' : 'Boissons'}</option>
              <option value="cat-entretien">{language === 'ar' ? 'مواد تنظيف وصابون' : 'Entretien'}</option>
            </select>
          </div>

          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-xs font-semibold text-stone-800 focus:outline-emerald-800"
            >
              <option value="all">{language === 'ar' ? 'جميع الحالات (الكل)' : 'Tous les statuts'}</option>
              <option value="active">{language === 'ar' ? 'ظاهر للزبائن (Actif)' : 'Actifs'}</option>
              <option value="inactive">{language === 'ar' ? 'مخفي من المتجر (Inactif)' : 'Masqués'}</option>
            </select>
          </div>
        </div>

        {/* PRODUCTS TABLE WITH ACTIONS (EDIT, HIDE, DELETE) */}
        <div className="overflow-x-auto rounded-lg border border-stone-200">
          <table className="w-full text-xs text-start">
            <thead className="bg-stone-50 text-stone-700 font-bold border-b border-stone-200">
              <tr>
                <th className="py-3 px-3 text-start w-16">{language === 'ar' ? 'الصورة' : 'Image'}</th>
                <th className="py-3 px-3 text-start">{language === 'ar' ? 'السلعة / SKU' : 'Produit & SKU'}</th>
                <th className="py-3 px-3 text-start">{language === 'ar' ? 'التعبئة' : 'Colisage'}</th>
                <th className="py-3 px-3 text-start bg-stone-100/40">
                  {language === 'ar' ? 'سعر DETAIL (حبة)' : 'Détail (Unité)'}
                </th>
                <th className="py-3 px-3 text-start bg-amber-50/40">
                  {language === 'ar' ? 'سعر DEMI (حبة)' : 'Demi-Gros (Unité)'}
                </th>
                <th className="py-3 px-3 text-start bg-emerald-50/40">
                  {language === 'ar' ? 'سعر GROS (حبة)' : 'Gros (Unité)'}
                </th>
                <th className="py-3 px-3 text-start">{language === 'ar' ? 'المخزون' : 'Stock'}</th>
                <th className="py-3 px-3 text-start">{language === 'ar' ? 'الحالة' : 'Statut'}</th>
                <th className="py-3 px-3 text-center min-w-[140px]">{language === 'ar' ? 'الإجراءات' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 bg-white">
              {visibleProducts.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-stone-400">
                    {language === 'ar'
                      ? 'لا توجد منتجات مطابقة لخيارات البحث أو الفلترة.'
                      : 'Aucun produit ne correspond à vos critères.'}
                  </td>
                </tr>
              ) : (
                visibleProducts.map((item) => {
                  const { product, prices } = item;
                  const cartons = Math.floor(product.totalUnitsInStock / product.unitsPerCarton);
                  const units = product.totalUnitsInStock % product.unitsPerCarton;
                  const isHidden = product.status === 'inactive';

                  return (
                    <tr
                      key={product.id}
                      className={`hover:bg-stone-50/80 transition ${
                        isHidden ? 'bg-stone-50/50 opacity-80' : ''
                      }`}
                    >
                      {/* Image Thumbnail */}
                      <td className="py-2.5 px-3">
                        <div className="w-12 h-12 rounded-lg bg-stone-100 border border-stone-200 overflow-hidden shrink-0 relative group">
                          <img
                            src={product.mainImage}
                            alt={product.nameAr}
                            className="w-full h-full object-cover group-hover:scale-110 transition"
                          />
                        </div>
                      </td>

                      {/* Product Name & SKU */}
                      <td className="py-2.5 px-3">
                        <div className="font-bold text-stone-900 text-xs">
                          {language === 'ar' ? product.nameAr : product.nameFr}
                        </div>
                        <div className="text-[11px] text-stone-500 font-medium">
                          {language === 'ar' ? product.nameFr : product.nameAr}
                        </div>
                        <div className="font-mono text-[10px] text-stone-400 font-semibold mt-0.5">
                          {product.sku}
                        </div>
                      </td>

                      {/* Colisage */}
                      <td className="py-2.5 px-3">
                        <span className="inline-block bg-stone-100 text-stone-700 px-2 py-0.5 rounded text-[11px] font-semibold">
                          {product.unitsPerCarton} UNIT / كرتون
                        </span>
                      </td>

                      {/* DETAIL Price */}
                      <td className="py-2.5 px-3 bg-stone-50/30">
                        <div className="font-black text-stone-900 text-xs">
                          {prices.detailUnitPrice} {currency}
                        </div>
                        <div className="text-[10px] text-stone-400">
                          الكرتون: {prices.detailCartonPrice} {currency}
                        </div>
                      </td>

                      {/* DEMI GROS Price */}
                      <td className="py-2.5 px-3 bg-amber-50/30">
                        <div className="font-black text-amber-900 text-xs">
                          {prices.demiGrosUnitPrice} {currency}
                        </div>
                        <div className="text-[10px] text-stone-400">
                          الكرتون: {prices.demiGrosCartonPrice} {currency}
                        </div>
                      </td>

                      {/* GROS Price */}
                      <td className="py-2.5 px-3 bg-emerald-50/30">
                        <div className="font-black text-emerald-900 text-xs">
                          {prices.grosUnitPrice} {currency}
                        </div>
                        <div className="text-[10px] text-stone-400">
                          الكرتون: {prices.grosCartonPrice} {currency}
                        </div>
                      </td>

                      {/* Stock in Cartons + Units */}
                      <td className="py-2.5 px-3 font-medium text-stone-700">
                        <div className="font-bold">
                          {cartons} كرتون {units > 0 ? `+ ${units} حبة` : ''}
                        </div>
                        <div className="text-[10px] text-stone-400">
                          الإجمالي: {product.totalUnitsInStock} UNIT
                        </div>
                      </td>

                      {/* Status Badge */}
                      <td className="py-2.5 px-3">
                        {product.status === 'active' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                            {language === 'ar' ? 'ظاهر للزبائن' : 'Actif'}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-stone-200 text-stone-700">
                            <EyeOff className="w-3 h-3 text-stone-500" />
                            {language === 'ar' ? 'مخفي' : 'Masqué'}
                          </span>
                        )}
                      </td>

                      {/* REQUIRED ACTIONS: EDIT, HIDE/SHOW, DELETE */}
                      <td className="py-2.5 px-3 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {/* 1. EDIT BUTTON */}
                          <button
                            onClick={() => handleOpenEdit(item)}
                            className="p-1.5 rounded-lg border border-stone-200 bg-white hover:bg-blue-50 text-blue-700 hover:border-blue-300 transition"
                            title={language === 'ar' ? 'تعديل السلعة والأسعار والصور' : 'Modifier'}
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          {/* 2. HIDE / SHOW TOGGLE BUTTON */}
                          <button
                            onClick={() => handleToggleHide(product.id, product.status)}
                            className={`p-1.5 rounded-lg border transition ${
                              isHidden
                                ? 'bg-amber-50 border-amber-300 text-amber-700 hover:bg-amber-100'
                                : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-100'
                            }`}
                            title={
                              isHidden
                                ? language === 'ar'
                                  ? 'إظهار السلعة في المتجر'
                                  : 'Afficher le produit'
                                : language === 'ar'
                                ? 'إخفاء السلعة من المتجر'
                                : 'Masquer le produit'
                            }
                          >
                            {isHidden ? (
                              <Eye className="w-3.5 h-3.5 text-emerald-700" />
                            ) : (
                              <EyeOff className="w-3.5 h-3.5" />
                            )}
                          </button>

                          {/* 3. DELETE BUTTON */}
                          <button
                            onClick={() => setDeletingItem(item)}
                            className="p-1.5 rounded-lg border border-red-200 bg-white hover:bg-red-50 text-red-600 hover:border-red-300 transition"
                            title={language === 'ar' ? 'حذف السلعة' : 'Supprimer'}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* STOCK MOVEMENTS AUDIT LOG (OPTIONAL EXPANDABLE SECTION) */}
      {showMovementsLog && (
        <div className="bg-white rounded-xl border border-stone-200 shadow-xs p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-stone-900 text-sm flex items-center gap-2">
              <History className="w-4 h-4 text-emerald-800" />
              <span>{language === 'ar' ? 'سجل حركات المخزون والمستودع' : 'Journal des Mouvements de Stock'}</span>
            </h3>
            <span className="text-xs text-stone-500">
              {stockMovements.length} {language === 'ar' ? 'حركات مسجلة' : 'mouvements'}
            </span>
          </div>

          <div className="overflow-x-auto rounded-lg border border-stone-200">
            <table className="w-full text-xs text-start">
              <thead className="bg-stone-50 text-stone-700 font-semibold border-b border-stone-200">
                <tr>
                  <th className="py-2.5 px-3 text-start">{language === 'ar' ? 'التاريخ' : 'Date'}</th>
                  <th className="py-2.5 px-3 text-start">{language === 'ar' ? 'السلعة' : 'Produit'}</th>
                  <th className="py-2.5 px-3 text-start">{language === 'ar' ? 'نوع الحركة' : 'Type'}</th>
                  <th className="py-2.5 px-3 text-start">{language === 'ar' ? 'الكمية بالحبة' : 'Quantité (UNIT)'}</th>
                  <th className="py-2.5 px-3 text-start">{language === 'ar' ? 'الرصيد بعد الحركة' : 'Nouveau Stock'}</th>
                  <th className="py-2.5 px-3 text-start">{language === 'ar' ? 'السبب / الملاحظة' : 'Motif'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {stockMovements.slice(0, 15).map((m) => (
                  <tr key={m.id} className="hover:bg-stone-50/60">
                    <td className="py-2 px-3 text-stone-500 font-mono text-[11px]">
                      {new Date(m.createdAt).toLocaleString(language === 'ar' ? 'ar-DZ' : 'fr-FR')}
                    </td>
                    <td className="py-2 px-3 font-semibold text-stone-900">
                      {m.productName} <span className="font-mono text-stone-400 font-normal">({m.sku})</span>
                    </td>
                    <td className="py-2 px-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          m.type === 'STOCK_ENTRY'
                            ? 'bg-emerald-100 text-emerald-800'
                            : m.type === 'SALE'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {m.type}
                      </span>
                    </td>
                    <td
                      className={`py-2 px-3 font-bold ${
                        m.unitsDelta > 0 ? 'text-emerald-700' : 'text-red-600'
                      }`}
                    >
                      {m.unitsDelta > 0 ? `+${m.unitsDelta}` : m.unitsDelta} UNIT
                    </td>
                    <td className="py-2 px-3 font-semibold text-stone-800">
                      {m.resultingTotalUnits} UNIT
                    </td>
                    <td className="py-2 px-3 text-stone-600 italic text-[11px]">
                      {m.reason}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* MODAL 1: ADD SINGLE PRODUCT WITH IMAGES               */}
      {/* ==================================================== */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-3xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto border border-stone-200 shadow-2xl">
            <div className="flex justify-between items-center pb-3 border-b border-stone-200">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-900 flex items-center justify-center">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-stone-900 text-lg">
                    {language === 'ar' ? 'إدراج سلعة جديدة مع الصور والأسعار' : 'Ajouter un Nouveau Produit'}
                  </h3>
                  <p className="text-xs text-stone-500">
                    {language === 'ar'
                      ? 'الأسعار هي سعر الحبة (Prix Unitaire)، وسعر الكرتون يُحسب آلياً'
                      : 'Les prix sont saisis à l’unité. Le prix carton est calculé automatiquement'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-stone-400 hover:text-stone-700 p-1.5 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSingleProduct} className="space-y-6 text-xs">
              {/* Product Identity */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    {language === 'ar' ? 'اسم السلعة بالعربية *' : 'Nom en Arabe *'}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: زيت المائدة الصافي سيفيتال 5 لتر"
                    value={addNameAr}
                    onChange={(e) => setAddNameAr(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2.5 text-xs text-stone-900 focus:outline-emerald-800"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    {language === 'ar' ? 'اسم السلعة بالفرنسية' : 'Nom en Français'}
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Huile de Table Cevital 5L"
                    value={addNameFr}
                    onChange={(e) => setAddNameFr(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2.5 text-xs text-stone-900 focus:outline-emerald-800"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    {language === 'ar' ? 'رمز SKU (اختياري)' : 'Code SKU'}
                  </label>
                  <input
                    type="text"
                    placeholder="مثال: SEL-OIL-5L"
                    value={addSku}
                    onChange={(e) => setAddSku(e.target.value.toUpperCase())}
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2.5 text-xs font-mono uppercase focus:outline-emerald-800"
                  />
                </div>
              </div>

              {/* Packaging & Initial Stock */}
              <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    {language === 'ar' ? 'التصنيف' : 'Catégorie'}
                  </label>
                  <select
                    value={addCategory}
                    onChange={(e) => setAddCategory(e.target.value)}
                    className="w-full bg-white border border-stone-300 rounded-lg p-2 text-xs font-semibold focus:outline-emerald-800"
                  >
                    <option value="cat-alimentaire">{language === 'ar' ? 'مواد غذائية وزيوت' : 'Alimentaire'}</option>
                    <option value="cat-conserves">{language === 'ar' ? 'معلبات ومصبرات' : 'Conserves'}</option>
                    <option value="cat-boissons">{language === 'ar' ? 'قهوة ومشروبات' : 'Boissons'}</option>
                    <option value="cat-entretien">{language === 'ar' ? 'مواد تنظيف وصابون' : 'Entretien'}</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    {language === 'ar' ? 'عدد الحبات في الكرتون (Colisage)' : 'Unités par Carton'}
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={addUnitsPerCarton}
                    onChange={(e) => setAddUnitsPerCarton(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full bg-white border border-stone-300 rounded-lg p-2 text-xs font-bold text-stone-900 focus:outline-emerald-800"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    {language === 'ar' ? 'عدد الكراتين المستلمة بالمستودع' : 'Cartons Reçus'}
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={addInitialCartons}
                    onChange={(e) => setAddInitialCartons(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full bg-white border border-stone-300 rounded-lg p-2 text-xs font-bold text-stone-900 focus:outline-emerald-800"
                  />
                  <div className="text-[11px] text-emerald-800 font-semibold mt-1">
                    = {addInitialCartons * addUnitsPerCarton} حبة (UNIT) في المخزون
                  </div>
                </div>
              </div>

              {/* THREE UNIT PRICES (DETAIL, DEMI GROS, GROS) */}
              <div className="border border-stone-200 rounded-xl p-4 bg-stone-50/50 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-black text-stone-900 text-xs">
                    {language === 'ar'
                      ? 'أسعار الحبة (Prix Unitaire) للفئات الثلاث — الأساس في الحساب'
                      : 'Barème des Prix Unitaires (Détail, Demi-Gros, Gros)'}
                  </h4>
                  <span className="text-[11px] text-stone-500 font-medium">
                    الكرتون = سعر الحبة × {addUnitsPerCarton}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* DETAIL */}
                  <div className="bg-white p-3 rounded-lg border border-stone-200 space-y-1">
                    <label className="block font-bold text-stone-800">
                      {language === 'ar' ? 'سعر الحبة تجزئة (DETAIL) *' : 'Prix Unitaire Détail *'}
                    </label>
                    <input
                      type="number"
                      min="1"
                      required
                      value={addDetailUnitPrice}
                      onChange={(e) => setAddDetailUnitPrice(parseFloat(e.target.value) || 0)}
                      className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 text-xs font-black text-stone-900 focus:outline-emerald-800"
                    />
                    <div className="text-[11px] text-stone-500">
                      سعر الكرتون:{' '}
                      <strong className="text-stone-800">
                        {addDetailUnitPrice * addUnitsPerCarton} {currency}
                      </strong>
                    </div>
                  </div>

                  {/* DEMI GROS */}
                  <div className="bg-amber-50/50 p-3 rounded-lg border border-amber-200 space-y-1">
                    <label className="block font-bold text-amber-900">
                      {language === 'ar' ? 'سعر الحبة نصف جملة (DEMI GROS)' : 'Prix Demi-Gros (Unité)'}
                    </label>
                    <input
                      type="number"
                      min="1"
                      required
                      value={addDemiGrosUnitPrice}
                      onChange={(e) => setAddDemiGrosUnitPrice(parseFloat(e.target.value) || 0)}
                      className="w-full bg-white border border-amber-300 rounded-lg p-2 text-xs font-black text-amber-900 focus:outline-emerald-800"
                    />
                    <div className="text-[11px] text-stone-500">
                      سعر الكرتون:{' '}
                      <strong className="text-amber-900">
                        {addDemiGrosUnitPrice * addUnitsPerCarton} {currency}
                      </strong>
                    </div>
                  </div>

                  {/* GROS */}
                  <div className="bg-emerald-50/50 p-3 rounded-lg border border-emerald-200 space-y-1">
                    <label className="block font-bold text-emerald-950">
                      {language === 'ar' ? 'سعر الحبة جملة (GROS)' : 'Prix Gros (Unité)'}
                    </label>
                    <input
                      type="number"
                      min="1"
                      required
                      value={addGrosUnitPrice}
                      onChange={(e) => setAddGrosUnitPrice(parseFloat(e.target.value) || 0)}
                      className="w-full bg-white border border-emerald-300 rounded-lg p-2 text-xs font-black text-emerald-950 focus:outline-emerald-800"
                    />
                    <div className="text-[11px] text-stone-500">
                      سعر الكرتون:{' '}
                      <strong className="text-emerald-900">
                        {addGrosUnitPrice * addUnitsPerCarton} {currency}
                      </strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* IMAGE SELECTION & UPLOAD */}
              <div className="border border-stone-200 rounded-xl p-4 bg-white space-y-3">
                <div className="flex justify-between items-center">
                  <label className="block font-bold text-stone-900">
                    {language === 'ar' ? 'صورة المنتج الرئيسية' : 'Photo Principale du Produit'}
                  </label>
                  <label className="cursor-pointer bg-stone-100 hover:bg-stone-200 text-stone-700 px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 border border-stone-200 transition">
                    <UploadCloud className="w-3.5 h-3.5" />
                    <span>{language === 'ar' ? 'رفع صورة من جهازك' : 'Téléverser photo'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleImageFileUpload(e, setAddImageUrl)}
                    />
                  </label>
                </div>

                <div className="flex gap-4 items-center">
                  <div className="w-20 h-20 rounded-xl bg-stone-100 border border-stone-300 overflow-hidden shrink-0">
                    <img
                      src={addImageUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as any).src =
                          'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80';
                      }}
                    />
                  </div>

                  <div className="flex-1 space-y-1">
                    <input
                      type="url"
                      placeholder="أدخل رابط صورة مباشر (URL)..."
                      value={addImageUrl}
                      onChange={(e) => setAddImageUrl(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 text-xs text-stone-900 focus:outline-emerald-800"
                    />
                    <p className="text-[11px] text-stone-400">
                      يمكنك لصق رابط صورة مباشر أو اختيار صورة من مكتبة المنتجات الجزائرية أدناه:
                    </p>
                  </div>
                </div>

                {/* Algerian staples presets */}
                <div className="pt-2">
                  <span className="text-[11px] font-bold text-stone-500 block mb-1.5">
                    {language === 'ar' ? 'مكتبة صور المواد الغذائية الجزائرية الأكثر طلباً:' : 'Présélections Produits:'}
                  </span>
                  <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                    {ALGERIAN_IMAGE_PRESETS.map((preset, idx) => (
                      <button
                        type="button"
                        key={idx}
                        onClick={() => setAddImageUrl(preset.url)}
                        className={`h-14 rounded-lg overflow-hidden border-2 transition relative ${
                          addImageUrl === preset.url
                            ? 'border-emerald-700 ring-2 ring-emerald-500/30'
                            : 'border-stone-200 hover:border-stone-400'
                        }`}
                        title={preset.name}
                      >
                        <img src={preset.url} alt={preset.name} className="w-full h-full object-cover" />
                        {addImageUrl === preset.url && (
                          <div className="absolute inset-0 bg-emerald-900/40 flex items-center justify-center">
                            <Check className="w-3.5 h-3.5 text-white" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Form Buttons */}
              <div className="flex justify-end gap-3 pt-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-stone-300 text-stone-700 font-semibold rounded-lg hover:bg-stone-50"
                >
                  {language === 'ar' ? 'إلغاء' : 'Annuler'}
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#0F392B] hover:bg-[#16543F] text-white font-black rounded-lg shadow-xs"
                >
                  {language === 'ar' ? 'إدراج السلعة في المستودع' : 'Enregistrer le produit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* MODAL 2: BULK EXCEL IMPORT (REQUIRED COLUMNS 1 TO 4)  */}
      {/* ==================================================== */}
      {showExcelModal && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-4xl w-full p-6 sm:p-8 space-y-6 max-h-[92vh] overflow-y-auto border border-stone-200 shadow-2xl">
            <div className="flex justify-between items-center pb-3 border-b border-stone-200">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-900 flex items-center justify-center">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-stone-900 text-lg">
                    {language === 'ar'
                      ? 'استيراد عدة سلع بواسطة ملف إكسل (Excel / CSV)'
                      : 'Importation Groupée via Fichier Excel'}
                  </h3>
                  <p className="text-xs text-stone-500">
                    {language === 'ar'
                      ? 'العمود 1: اسم السلعة | العمود 2: سعر detail | العمود 3: سعر demi gros | العمود 4: سعر gros'
                      : 'Col 1: Nom | Col 2: Prix Détail | Col 3: Prix Demi-Gros | Col 4: Prix Gros'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowExcelModal(false)}
                className="text-stone-400 hover:text-stone-700 p-1.5 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Instruction Banner & Download Template Button */}
            <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs">
              <div className="space-y-1">
                <div className="font-bold text-emerald-950 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-emerald-700" />
                  <span>تنسيق ملف الإكسل المعتمد والمطلوب:</span>
                </div>
                <div className="text-emerald-800 text-[11px] leading-relaxed">
                  • العمود 1: <strong>اسم السلعة</strong> (Nom du produit)<br />
                  • العمود 2: <strong>سعر detail</strong> (سعر الحبة تجزئة بالدينار)<br />
                  • العمود 3: <strong>سعر demi gros</strong> (سعر الحبة نصف جملة بالدينار)<br />
                  • العمود 4: <strong>سعر gros</strong> (سعر الحبة جملة بالدينار)
                </div>
              </div>

              {/* Template Download Button */}
              <button
                onClick={handleDownloadExcelTemplate}
                className="flex items-center gap-2 px-3.5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg font-bold shadow-xs shrink-0 transition"
              >
                <Download className="w-4 h-4" />
                <span>تحميل نموذج إكسل جاهز (.XLSX)</span>
              </button>
            </div>

            {/* File Upload Zone */}
            <div className="border-2 border-dashed border-stone-300 hover:border-emerald-600 rounded-2xl p-6 text-center space-y-3 bg-stone-50/60 transition">
              <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center mx-auto">
                <UploadCloud className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-stone-800">
                  {excelFileName
                    ? `الملف المختار: ${excelFileName}`
                    : 'اسحب ملف الإكسل هنا أو اضغط لاختياره من جهازك'}
                </p>
                <p className="text-[11px] text-stone-400 mt-0.5">
                  يدعم صيغ Microsoft Excel (.xlsx, .xls) وملفات القيم المفصولة (.csv)
                </p>
              </div>

              <label className="inline-block px-4 py-2 bg-white border border-stone-300 hover:bg-stone-100 text-stone-800 rounded-lg text-xs font-bold cursor-pointer transition shadow-2xs">
                <span>تصفح ملف من جهازك</span>
                <input
                  type="file"
                  accept=".xlsx, .xls, .csv"
                  className="hidden"
                  onChange={handleExcelUpload}
                />
              </label>
            </div>

            {/* Error banner */}
            {excelError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-800 rounded-xl text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{excelError}</span>
              </div>
            )}

            {/* Packaging Defaults for Imported Items */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-stone-50 p-4 rounded-xl border border-stone-200 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  عدد الحبات في الكرتون للسلع المستوردة
                </label>
                <input
                  type="number"
                  min="1"
                  value={defaultUnitsPerCarton}
                  onChange={(e) => setDefaultUnitsPerCarton(Math.max(1, parseInt(e.target.value) || 12))}
                  className="w-full bg-white border border-stone-300 rounded-lg p-2 text-xs font-bold focus:outline-emerald-800"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  المخزون الأولي المستلم (بالكرتون)
                </label>
                <input
                  type="number"
                  min="0"
                  value={defaultCartonsStock}
                  onChange={(e) => setDefaultCartonsStock(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full bg-white border border-stone-300 rounded-lg p-2 text-xs font-bold focus:outline-emerald-800"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  التصنيف الافتراضي للسلع
                </label>
                <select
                  value={defaultCategory}
                  onChange={(e) => setDefaultCategory(e.target.value)}
                  className="w-full bg-white border border-stone-300 rounded-lg p-2 text-xs font-semibold focus:outline-emerald-800"
                >
                  <option value="cat-alimentaire">مواد غذائية وزيوت</option>
                  <option value="cat-conserves">معلبات ومصبرات</option>
                  <option value="cat-boissons">قهوة ومشروبات وبسكويت</option>
                  <option value="cat-entretien">مواد تنظيف وصابون</option>
                </select>
              </div>
            </div>

            {/* Parsed Rows Live Preview Table */}
            {excelRows.length > 0 && (
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-stone-900">
                    معاينة السلع الجاهزة للاستيراد ({excelRows.length} سلعة مكتشفة):
                  </span>
                  <span className="text-[11px] text-emerald-800 font-semibold">
                    ✓ تم التحقق من الأعمدة الأربعة بنجاح
                  </span>
                </div>

                <div className="overflow-x-auto rounded-lg border border-stone-200 max-h-56 overflow-y-auto">
                  <table className="w-full text-xs text-start">
                    <thead className="bg-stone-50 text-stone-700 font-bold border-b border-stone-200 sticky top-0">
                      <tr>
                        <th className="py-2 px-3 text-start">#</th>
                        <th className="py-2 px-3 text-start">العمود 1: اسم السلعة</th>
                        <th className="py-2 px-3 text-start">العمود 2: سعر DETAIL (حبة)</th>
                        <th className="py-2 px-3 text-start">العمود 3: سعر DEMI GROS (حبة)</th>
                        <th className="py-2 px-3 text-start">العمود 4: سعر GROS (حبة)</th>
                        <th className="py-2 px-3 text-start">كرتون GROS (محسوب)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100 bg-white">
                      {excelRows.map((row, idx) => (
                        <tr key={idx} className="hover:bg-stone-50/70">
                          <td className="py-2 px-3 font-mono text-stone-400">{idx + 1}</td>
                          <td className="py-2 px-3 font-bold text-stone-900">{row.name}</td>
                          <td className="py-2 px-3 font-semibold text-stone-800">
                            {row.detailPrice} {currency}
                          </td>
                          <td className="py-2 px-3 font-semibold text-amber-900">
                            {row.demiGrosPrice} {currency}
                          </td>
                          <td className="py-2 px-3 font-black text-emerald-900">
                            {row.grosPrice} {currency}
                          </td>
                          <td className="py-2 px-3 text-stone-500 font-mono">
                            {row.grosPrice * defaultUnitsPerCarton} {currency}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Modal Actions */}
            <div className="flex justify-end gap-3 pt-3 border-t border-stone-200">
              <button
                type="button"
                onClick={() => setShowExcelModal(false)}
                className="px-4 py-2 border border-stone-300 text-stone-700 font-semibold rounded-lg hover:bg-stone-50"
              >
                إلغاء
              </button>
              <button
                type="button"
                disabled={excelRows.length === 0 || isImporting}
                onClick={handleExecuteBatchImport}
                className="px-6 py-2 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-stone-900 font-black rounded-lg shadow-xs transition"
              >
                {isImporting
                  ? 'جاري الاستيراد...'
                  : `تأكيد واستيراد (${excelRows.length}) سلعة إلى المستودع`}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* MODAL 3: EDIT PRODUCT (DETAILS, PRICES, IMAGES)       */}
      {/* ==================================================== */}
      {editingItem && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-3xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto border border-stone-200 shadow-2xl">
            <div className="flex justify-between items-center pb-3 border-b border-stone-200">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-900 flex items-center justify-center">
                  <Edit3 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-stone-900 text-lg">
                    {language === 'ar' ? 'تعديل السلعة والأسعار والصور' : 'Modifier le Produit'}
                  </h3>
                  <p className="text-xs text-stone-500 font-mono">
                    SKU: {editingItem.product.sku}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setEditingItem(null)}
                className="text-stone-400 hover:text-stone-700 p-1.5 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-6 text-xs">
              {/* Names and SKU */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    اسم السلعة بالعربية *
                  </label>
                  <input
                    type="text"
                    required
                    value={editNameAr}
                    onChange={(e) => setEditNameAr(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2.5 text-xs text-stone-900 focus:outline-emerald-800"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    اسم السلعة بالفرنسية
                  </label>
                  <input
                    type="text"
                    value={editNameFr}
                    onChange={(e) => setEditNameFr(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2.5 text-xs text-stone-900 focus:outline-emerald-800"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    رمز SKU
                  </label>
                  <input
                    type="text"
                    value={editSku}
                    onChange={(e) => setEditSku(e.target.value.toUpperCase())}
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2.5 text-xs font-mono uppercase focus:outline-emerald-800"
                  />
                </div>
              </div>

              {/* Packaging & Stock Adjustment */}
              <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    عدد الحبات في الكرتون
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={editUnitsPerCarton}
                    onChange={(e) => setEditUnitsPerCarton(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full bg-white border border-stone-300 rounded-lg p-2 text-xs font-bold text-stone-900 focus:outline-emerald-800"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    المخزون الحالي بالمستودع
                  </label>
                  <div className="p-2 bg-stone-200/80 rounded-lg text-xs font-bold text-stone-800">
                    {Math.floor(editingItem.product.totalUnitsInStock / editingItem.product.unitsPerCarton)} كرتون (
                    {editingItem.product.totalUnitsInStock} حبة)
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    إضافة كراتين جديدة للمستودع (+/-)
                  </label>
                  <input
                    type="number"
                    value={editAddCartons}
                    onChange={(e) => setEditAddCartons(parseInt(e.target.value) || 0)}
                    placeholder="0"
                    className="w-full bg-white border border-stone-300 rounded-lg p-2 text-xs font-bold text-emerald-800 focus:outline-emerald-800"
                  />
                  {editAddCartons !== 0 && (
                    <div className="text-[11px] text-emerald-800 font-semibold mt-0.5">
                      {editAddCartons > 0 ? '+' : ''}{editAddCartons * editUnitsPerCarton} حبة
                    </div>
                  )}
                </div>
              </div>

              {/* Unit Prices (Detail, Demi, Gros) */}
              <div className="border border-stone-200 rounded-xl p-4 bg-stone-50/50 space-y-3">
                <h4 className="font-black text-stone-900 text-xs">
                  تعديل أسعار الحبة (Prix Unitaire) للفئات الثلاث:
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Detail */}
                  <div className="bg-white p-3 rounded-lg border border-stone-200 space-y-1">
                    <label className="block font-bold text-stone-800">
                      سعر الحبة تجزئة (DETAIL)
                    </label>
                    <input
                      type="number"
                      min="1"
                      required
                      value={editDetailUnitPrice}
                      onChange={(e) => setEditDetailUnitPrice(parseFloat(e.target.value) || 0)}
                      className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 text-xs font-black text-stone-900 focus:outline-emerald-800"
                    />
                    <div className="text-[11px] text-stone-500">
                      الكرتون: {editDetailUnitPrice * editUnitsPerCarton} {currency}
                    </div>
                  </div>

                  {/* Demi */}
                  <div className="bg-amber-50/50 p-3 rounded-lg border border-amber-200 space-y-1">
                    <label className="block font-bold text-amber-900">
                      سعر الحبة نصف جملة (DEMI GROS)
                    </label>
                    <input
                      type="number"
                      min="1"
                      required
                      value={editDemiGrosUnitPrice}
                      onChange={(e) => setEditDemiGrosUnitPrice(parseFloat(e.target.value) || 0)}
                      className="w-full bg-white border border-amber-300 rounded-lg p-2 text-xs font-black text-amber-900 focus:outline-emerald-800"
                    />
                    <div className="text-[11px] text-stone-500">
                      الكرتون: {editDemiGrosUnitPrice * editUnitsPerCarton} {currency}
                    </div>
                  </div>

                  {/* Gros */}
                  <div className="bg-emerald-50/50 p-3 rounded-lg border border-emerald-200 space-y-1">
                    <label className="block font-bold text-emerald-950">
                      سعر الحبة جملة (GROS)
                    </label>
                    <input
                      type="number"
                      min="1"
                      required
                      value={editGrosUnitPrice}
                      onChange={(e) => setEditGrosUnitPrice(parseFloat(e.target.value) || 0)}
                      className="w-full bg-white border border-emerald-300 rounded-lg p-2 text-xs font-black text-emerald-950 focus:outline-emerald-800"
                    />
                    <div className="text-[11px] text-stone-500">
                      الكرتون: {editGrosUnitPrice * editUnitsPerCarton} {currency}
                    </div>
                  </div>
                </div>
              </div>

              {/* Edit Image and Photo Selection */}
              <div className="border border-stone-200 rounded-xl p-4 bg-white space-y-3">
                <div className="flex justify-between items-center">
                  <label className="block font-bold text-stone-900">
                    تعديل صورة السلعة
                  </label>
                  <label className="cursor-pointer bg-stone-100 hover:bg-stone-200 text-stone-700 px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 border border-stone-200 transition">
                    <UploadCloud className="w-3.5 h-3.5" />
                    <span>تغيير الصورة من جهازك</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleImageFileUpload(e, setEditImageUrl)}
                    />
                  </label>
                </div>

                <div className="flex gap-4 items-center">
                  <div className="w-20 h-20 rounded-xl bg-stone-100 border border-stone-300 overflow-hidden shrink-0">
                    <img
                      src={editImageUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 space-y-1">
                    <input
                      type="url"
                      placeholder="رابط الصورة..."
                      value={editImageUrl}
                      onChange={(e) => setEditImageUrl(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 text-xs text-stone-900 focus:outline-emerald-800"
                    />
                  </div>
                </div>

                {/* Preset quick picker */}
                <div className="pt-1">
                  <span className="text-[11px] font-bold text-stone-500 block mb-1">
                    أو اختر صورة جاهزة بنقرة واحدة:
                  </span>
                  <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                    {ALGERIAN_IMAGE_PRESETS.map((preset, idx) => (
                      <button
                        type="button"
                        key={idx}
                        onClick={() => setEditImageUrl(preset.url)}
                        className={`h-12 rounded-lg overflow-hidden border-2 transition relative ${
                          editImageUrl === preset.url
                            ? 'border-emerald-700 ring-2 ring-emerald-500/30'
                            : 'border-stone-200 hover:border-stone-400'
                        }`}
                        title={preset.name}
                      >
                        <img src={preset.url} alt={preset.name} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2 border border-stone-300 text-stone-700 font-semibold rounded-lg hover:bg-stone-50"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-700 hover:bg-blue-800 text-white font-black rounded-lg shadow-xs"
                >
                  حفظ التعديلات
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* MODAL 4: DELETE CONFIRMATION                         */}
      {/* ==================================================== */}
      {deletingItem && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 border border-stone-200 shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-700 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-base font-bold text-stone-900">
                هل أنت متأكد من حذف هذه السلعة؟
              </h3>
              <p className="text-xs text-stone-600 font-semibold">
                "{deletingItem.product.nameAr}" ({deletingItem.product.sku})
              </p>
              <p className="text-[11px] text-stone-400">
                سيتم حذف السلعة منطقياً (Soft Delete) وإخفاؤها من الكتالوج والمتجر.
              </p>
            </div>

            <div className="flex justify-center gap-3 pt-3">
              <button
                type="button"
                onClick={() => setDeletingItem(null)}
                className="px-4 py-2 border border-stone-300 text-stone-700 text-xs font-semibold rounded-lg hover:bg-stone-50"
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-black rounded-lg shadow-xs"
              >
                تأكيد الحذف
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
