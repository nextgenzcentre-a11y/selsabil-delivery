import { Product, ProductPrices } from '../types';

export interface ProductWithPrices {
  product: Product;
  prices: ProductPrices;
}

export const SAMPLE_PRODUCTS: ProductWithPrices[] = [
  {
    product: {
      id: 'prod-001',
      sku: 'SEL-OIL-5L',
      nameAr: 'زيت المائدة الصافي سيفيتال 5 لتر',
      nameFr: 'Huile de Table Raffinée Cevital 5L',
      descriptionAr: 'زيت نباتي مكرر ممتاز 100%، مناسب للقلي والطبخ اليومي، كرتون يحتوي على 4 قارورات سعة 5 لتر.',
      descriptionFr: 'Huile végétale raffinée de qualité supérieure, conditionnée en carton de 4 bidons de 5 litres.',
      categoryId: 'cat-alimentaire',
      mainImage: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=800&q=80',
      gallery: [
        'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80',
      ],
      unitsPerCarton: 4,
      totalUnitsInStock: 240, // 60 Cartons
      status: 'active',
      isDeleted: false,
      createdAt: '2026-11-01T10:00:00Z',
      updatedAt: '2026-11-10T12:00:00Z',
    },
    prices: {
      productId: 'prod-001',
      // Primary Unit Prices
      grosUnitPrice: 700, // DA per unit
      grosCartonPrice: 700 * 4, // 2800 DA
      demiGrosUnitPrice: 730,
      demiGrosCartonPrice: 730 * 4, // 2920 DA
      detailUnitPrice: 780,
      detailCartonPrice: 780 * 4, // 3120 DA
      updatedAt: '2026-11-10T12:00:00Z',
    },
  },
  {
    product: {
      id: 'prod-002',
      sku: 'SEL-TOM-800G',
      nameAr: 'طماطم مصبرة كاب مضاعفة التركيز 800غ',
      nameFr: 'Double Concentré de Tomate CAB 800g',
      descriptionAr: 'طماطم جزائرية طبيعية 100%، تركيز 28-30% عالي الجودة، كرتون يحتوي على 12 علبة معدنية.',
      descriptionFr: 'Double concentré de tomates algériennes 28-30%, carton de 12 boîtes métalliques de 800g.',
      categoryId: 'cat-conserves',
      mainImage: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80',
      gallery: [
        'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80',
      ],
      unitsPerCarton: 12,
      totalUnitsInStock: 155, // 12 cartons + 11 units
      status: 'active',
      isDeleted: false,
      createdAt: '2026-11-02T10:00:00Z',
      updatedAt: '2026-11-10T12:00:00Z',
    },
    prices: {
      productId: 'prod-002',
      grosUnitPrice: 245,
      grosCartonPrice: 245 * 12, // 2940 DA
      demiGrosUnitPrice: 260,
      demiGrosCartonPrice: 260 * 12, // 3120 DA
      detailUnitPrice: 290,
      detailCartonPrice: 290 * 12, // 3480 DA
      updatedAt: '2026-11-10T12:00:00Z',
    },
  },
  {
    product: {
      id: 'prod-003',
      sku: 'SEL-COF-250G',
      nameAr: 'قهوة مطحونة فاكتو بريميوم 250غ',
      nameFr: 'Café Moulu Tradition Facto 250g',
      descriptionAr: 'بن محمص ممتاز، نكهة قوية أصيلة، تعبئة مفرغة من الهواء للحفاظ على الرائحة، كرتون من 24 علبة.',
      descriptionFr: 'Café pur torréfié et moulu, emballage sous vide, carton de 24 paquets de 250g.',
      categoryId: 'cat-boissons',
      mainImage: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=800&q=80',
      gallery: [
        'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=800&q=80',
      ],
      unitsPerCarton: 24,
      totalUnitsInStock: 480, // 20 cartons
      status: 'active',
      isDeleted: false,
      createdAt: '2026-11-03T10:00:00Z',
      updatedAt: '2026-11-10T12:00:00Z',
    },
    prices: {
      productId: 'prod-003',
      grosUnitPrice: 195,
      grosCartonPrice: 195 * 24, // 4680 DA
      demiGrosUnitPrice: 215,
      demiGrosCartonPrice: 215 * 24, // 5160 DA
      detailUnitPrice: 240,
      detailCartonPrice: 240 * 24, // 5760 DA
      updatedAt: '2026-11-10T12:00:00Z',
    },
  },
  {
    product: {
      id: 'prod-004',
      sku: 'SEL-DET-3KG',
      nameAr: 'مسحوق غسيل أوتوماتيك إيزي كلين 3 كغ',
      nameFr: 'Lessive Poudre Machine Iziclean 3kg',
      descriptionAr: 'مسحوق عالي الفعالية للغسالات الأوتوماتيكية مع انتعاش دائم وإزالة البقع، كرتون يحتوي على 6 أكياس.',
      descriptionFr: 'Lessive en poudre haute performance avec parfum longue durée, carton de 6 sacs de 3kg.',
      categoryId: 'cat-entretien',
      mainImage: 'https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?auto=format&fit=crop&w=800&q=80',
      gallery: [
        'https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?auto=format&fit=crop&w=800&q=80',
      ],
      unitsPerCarton: 6,
      totalUnitsInStock: 90, // 15 cartons
      status: 'active',
      isDeleted: false,
      createdAt: '2026-11-04T10:00:00Z',
      updatedAt: '2026-11-10T12:00:00Z',
    },
    prices: {
      productId: 'prod-004',
      grosUnitPrice: 680,
      grosCartonPrice: 680 * 6, // 4080 DA
      demiGrosUnitPrice: 720,
      demiGrosCartonPrice: 720 * 6, // 4320 DA
      detailUnitPrice: 790,
      detailCartonPrice: 790 * 6, // 4740 DA
      updatedAt: '2026-11-10T12:00:00Z',
    },
  },
  {
    product: {
      id: 'prod-005',
      sku: 'SEL-PAS-500G',
      nameAr: 'عجائن غذائية سباغيتي إكسترا بن حمادي 500غ',
      nameFr: 'Spaghetti Supérieurs Extra Benhamadi 500g',
      descriptionAr: 'عجائن مصنوعة من القمح الصلب الممتاز 100%، سريعة الطهي ومقاومة، كرتون يحتوي على 20 كيس.',
      descriptionFr: 'Pâtes alimentaires 100% semoule de blé dur de qualité supérieure, carton de 20 paquets de 500g.',
      categoryId: 'cat-alimentaire',
      mainImage: 'https://images.unsplash.com/photo-1551462147-ff29053bfc14?auto=format&fit=crop&w=800&q=80',
      gallery: [
        'https://images.unsplash.com/photo-1551462147-ff29053bfc14?auto=format&fit=crop&w=800&q=80',
      ],
      unitsPerCarton: 20,
      totalUnitsInStock: 300, // 15 cartons
      status: 'active',
      isDeleted: false,
      createdAt: '2026-11-05T10:00:00Z',
      updatedAt: '2026-11-10T12:00:00Z',
    },
    prices: {
      productId: 'prod-005',
      grosUnitPrice: 68,
      grosCartonPrice: 68 * 20, // 1360 DA
      demiGrosUnitPrice: 75,
      demiGrosCartonPrice: 75 * 20, // 1500 DA
      detailUnitPrice: 85,
      detailCartonPrice: 85 * 20, // 1700 DA
      updatedAt: '2026-11-10T12:00:00Z',
    },
  },
  {
    product: {
      id: 'prod-006',
      sku: 'SEL-BIS-CHO',
      nameAr: 'بسكويت محشو بالشكولاطة بيمبو كرانش (علبة 12)',
      nameFr: 'Biscuits Fourrés Chocolat Bimo Crunch (Boîte 12)',
      descriptionAr: 'بسكويت شوكولاتة لذيذ مقرمش للأطفال والعائلات، علبة كرتونية تحتوي على 24 قطعة مغلفة.',
      descriptionFr: 'Biscuits croustillants fourrés au cacao, carton de 24 étuis individuels.',
      categoryId: 'cat-boissons',
      mainImage: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=800&q=80',
      gallery: [
        'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=800&q=80',
      ],
      unitsPerCarton: 24,
      totalUnitsInStock: 240, // 10 cartons
      status: 'active',
      isDeleted: false,
      createdAt: '2026-11-06T10:00:00Z',
      updatedAt: '2026-11-10T12:00:00Z',
    },
    prices: {
      productId: 'prod-006',
      grosUnitPrice: 42,
      grosCartonPrice: 42 * 24, // 1008 DA
      demiGrosUnitPrice: 48,
      demiGrosCartonPrice: 48 * 24, // 1152 DA
      detailUnitPrice: 55,
      detailCartonPrice: 55 * 24, // 1320 DA
      updatedAt: '2026-11-10T12:00:00Z',
    },
  },
  {
    product: {
      id: 'prod-007',
      sku: 'SEL-THO-160G',
      nameAr: 'تونة بالزيت النباتي مارمارا 160غ',
      nameFr: 'Thon Entier à l’Huile Végétale Marmara 160g',
      descriptionAr: 'قطع تونة بيضاء فاخرة في الزيت النباتي، كرتون يحتوي على 24 علبة دائرية سهلة الفتح.',
      descriptionFr: 'Morceaux de thon de premier choix à l’huile végétale, carton de 24 boîtes à ouverture facile.',
      categoryId: 'cat-conserves',
      mainImage: 'https://images.unsplash.com/photo-1534483509719-3feaee7c30da?auto=format&fit=crop&w=800&q=80',
      gallery: [
        'https://images.unsplash.com/photo-1534483509719-3feaee7c30da?auto=format&fit=crop&w=800&q=80',
      ],
      unitsPerCarton: 24,
      totalUnitsInStock: 360, // 15 cartons
      status: 'active',
      isDeleted: false,
      createdAt: '2026-11-07T10:00:00Z',
      updatedAt: '2026-11-10T12:00:00Z',
    },
    prices: {
      productId: 'prod-007',
      grosUnitPrice: 165,
      grosCartonPrice: 165 * 24, // 3960 DA
      demiGrosUnitPrice: 180,
      demiGrosCartonPrice: 180 * 24, // 4320 DA
      detailUnitPrice: 200,
      detailCartonPrice: 200 * 24, // 4800 DA
      updatedAt: '2026-11-10T12:00:00Z',
    },
  },
  {
    product: {
      id: 'prod-008',
      sku: 'SEL-SOAP-125G',
      nameAr: 'صابون معقم لليدين والوجه كليوباترا 125غ',
      nameFr: 'Savon de Toilette Parfumé Cléopâtre 125g',
      descriptionAr: 'صابون مرطب مع خلاصة الزيوت الطبيعية، تنظيف عميق للبشرة، كرتون يحتوي على 48 قطعة.',
      descriptionFr: 'Savonnette hydratante aux huiles naturelles, carton de 48 pièces emballées individuellement.',
      categoryId: 'cat-entretien',
      mainImage: 'https://images.unsplash.com/photo-1607006314642-1e905d496e57?auto=format&fit=crop&w=800&q=80',
      gallery: [
        'https://images.unsplash.com/photo-1607006314642-1e905d496e57?auto=format&fit=crop&w=800&q=80',
      ],
      unitsPerCarton: 48,
      totalUnitsInStock: 480, // 10 cartons
      status: 'active',
      isDeleted: false,
      createdAt: '2026-11-08T10:00:00Z',
      updatedAt: '2026-11-10T12:00:00Z',
    },
    prices: {
      productId: 'prod-008',
      grosUnitPrice: 65,
      grosCartonPrice: 65 * 48, // 3120 DA
      demiGrosUnitPrice: 75,
      demiGrosCartonPrice: 75 * 48, // 3600 DA
      detailUnitPrice: 85,
      detailCartonPrice: 85 * 48, // 4080 DA
      updatedAt: '2026-11-10T12:00:00Z',
    },
  },
];
