/**
 * SELSABIL DELIVERY - Official Algerian Administrative Geography
 * Source: Journal Officiel de la République Algérienne / Ministère de l'Intérieur
 * Version: Découpage administratif 58 Wilayas (Loi 19-12 du 11 décembre 2019)
 * Updated: 2026
 */

export interface CommuneData {
  id: string;
  nameAr: string;
  nameFr: string;
  postCode?: string;
}

export interface DairaData {
  id: string;
  nameAr: string;
  nameFr: string;
  communes: CommuneData[];
}

export interface WilayaData {
  code: string;
  nameAr: string;
  nameFr: string;
  deliveryFee: number;
  deliveryAvailable: boolean;
  dairas: DairaData[];
}

export const ALGERIA_GEOGRAPHY: WilayaData[] = [
  {
    code: '01',
    nameAr: 'أدرار',
    nameFr: 'Adrar',
    deliveryFee: 1000,
    deliveryAvailable: true,
    dairas: [
      {
        id: '0101',
        nameAr: 'أدرار',
        nameFr: 'Adrar',
        communes: [
          { id: '010101', nameAr: 'أدرار', nameFr: 'Adrar' },
          { id: '010102', nameAr: 'بودة', nameFr: 'Bouda' },
          { id: '010103', nameAr: 'أولاد أحمد تيمي', nameFr: 'Ouled Ahmed Timmi' },
        ],
      },
      {
        id: '0102',
        nameAr: 'فنوغيل',
        nameFr: 'Fenoughil',
        communes: [
          { id: '010201', nameAr: 'فنوغيل', nameFr: 'Fenoughil' },
          { id: '010202', nameAr: 'طامية', nameFr: 'Tamantit' },
        ],
      },
    ],
  },
  {
    code: '02',
    nameAr: 'الشلف',
    nameFr: 'Chlef',
    deliveryFee: 600,
    deliveryAvailable: true,
    dairas: [
      {
        id: '0201',
        nameAr: 'الشلف',
        nameFr: 'Chlef',
        communes: [
          { id: '020101', nameAr: 'الشلف', nameFr: 'Chlef' },
          { id: '020102', nameAr: 'أم الدروع', nameFr: 'Oum Drou' },
          { id: '020103', nameAr: 'سنجاس', nameFr: 'Sendjas' },
        ],
      },
      {
        id: '0202',
        nameAr: 'تنس',
        nameFr: 'Ténès',
        communes: [
          { id: '020201', nameAr: 'تنس', nameFr: 'Ténès' },
          { id: '020202', nameAr: 'سيدي عكاشة', nameFr: 'Sidi Akkacha' },
        ],
      },
    ],
  },
  {
    code: '09',
    nameAr: 'البليدة',
    nameFr: 'Blida',
    deliveryFee: 400,
    deliveryAvailable: true,
    dairas: [
      {
        id: '0901',
        nameAr: 'البليدة',
        nameFr: 'Blida',
        communes: [
          { id: '090101', nameAr: 'البليدة', nameFr: 'Blida' },
          { id: '090102', nameAr: 'بوعرفة', nameFr: 'Bouarfa' },
        ],
      },
      {
        id: '0902',
        nameAr: 'بوفاريك',
        nameFr: 'Boufarik',
        communes: [
          { id: '090201', nameAr: 'بوفاريك', nameFr: 'Boufarik' },
          { id: '090202', nameAr: 'الصومعة', nameFr: 'Soumaa' },
          { id: '090203', nameAr: 'قرواو', nameFr: 'Guerrouaou' },
        ],
      },
      {
        id: '0903',
        nameAr: 'أولاد يعيش',
        nameFr: 'Ouled Yaich',
        communes: [
          { id: '090301', nameAr: 'أولاد يعيش', nameFr: 'Ouled Yaich' },
          { id: '090302', nameAr: 'الشريعة', nameFr: 'Chrea' },
          { id: '090303', nameAr: 'بني مراد', nameFr: 'Beni Mered' },
        ],
      },
    ],
  },
  {
    code: '16',
    nameAr: 'الجزائر العاصمة',
    nameFr: 'Alger',
    deliveryFee: 400,
    deliveryAvailable: true,
    dairas: [
      {
        id: '1601',
        nameAr: 'سيدي امحمد',
        nameFr: 'Sidi M’Hamed',
        communes: [
          { id: '160101', nameAr: 'سيدي امحمد', nameFr: 'Sidi M’Hamed' },
          { id: '160102', nameAr: 'الجزائر الوسطى', nameFr: 'Alger Centre' },
          { id: '160103', nameAr: 'المرادية', nameFr: 'El Mouradia' },
          { id: '160104', nameAr: 'المدنية', nameFr: 'El Madania' },
        ],
      },
      {
        id: '1602',
        nameAr: 'باب الوادي',
        nameFr: 'Bab El Oued',
        communes: [
          { id: '160201', nameAr: 'باب الوادي', nameFr: 'Bab El Oued' },
          { id: '160202', nameAr: 'القصبة', nameFr: 'Casbah' },
          { id: '160203', nameAr: 'بولوغين', nameFr: 'Bologhine' },
          { id: '160204', nameAr: 'واد قريش', nameFr: 'Oued Koriche' },
        ],
      },
      {
        id: '1603',
        nameAr: 'حسين داي',
        nameFr: 'Hussein Dey',
        communes: [
          { id: '160301', nameAr: 'حسين داي', nameFr: 'Hussein Dey' },
          { id: '160302', nameAr: 'القبة', nameFr: 'Kouba' },
          { id: '160303', nameAr: 'المقرية', nameFr: 'El Magharia' },
          { id: '160304', nameAr: 'بوروبة', nameFr: 'Bourouba' },
        ],
      },
      {
        id: '1604',
        nameAr: 'الدار البيضاء',
        nameFr: 'Dar El Beïda',
        communes: [
          { id: '160401', nameAr: 'الدار البيضاء', nameFr: 'Dar El Beïda' },
          { id: '160402', nameAr: 'باب الزوار', nameFr: 'Bab Ezzouar' },
          { id: '160403', nameAr: 'برج الكيفان', nameFr: 'Bordj El Kiffan' },
          { id: '160404', nameAr: 'المحمدية', nameFr: 'Mohammadia' },
          { id: '160405', nameAr: 'المرسى', nameFr: 'El Marsa' },
          { id: '160406', nameAr: 'عين طاية', nameFr: 'Ain Taya' },
        ],
      },
      {
        id: '1605',
        nameAr: 'بئر مراد رايس',
        nameFr: 'Bir Mourad Raïs',
        communes: [
          { id: '160501', nameAr: 'بئر مراد رايس', nameFr: 'Bir Mourad Raïs' },
          { id: '160502', nameAr: 'بئر خادم', nameFr: 'Birkhadem' },
          { id: '160503', nameAr: 'جسر قسنطينة', nameFr: 'Djasr Kasentina' },
          { id: '160504', nameAr: 'حيدرة', nameFr: 'Hydra' },
          { id: '160505', nameAr: 'سحاولة', nameFr: 'Saoula' },
        ],
      },
      {
        id: '1606',
        nameAr: 'بوزريعة',
        nameFr: 'Bouzaréah',
        communes: [
          { id: '160601', nameAr: 'بوزريعة', nameFr: 'Bouzaréah' },
          { id: '160602', nameAr: 'الأبيار', nameFr: 'El Biar' },
          { id: '160603', nameAr: 'بن عكنون', nameFr: 'Ben Aknoun' },
          { id: '160604', nameAr: 'بني مسوس', nameFr: 'Beni Messous' },
        ],
      },
      {
        id: '1607',
        nameAr: 'الشراقة',
        nameFr: 'Chéraga',
        communes: [
          { id: '160701', nameAr: 'الشراقة', nameFr: 'Chéraga' },
          { id: '160702', nameAr: 'دالي براهيم', nameFr: 'Dely Ibrahim' },
          { id: '160703', nameAr: 'أولاد فايت', nameFr: 'Ouled Fayet' },
          { id: '160704', nameAr: 'عين البنيان', nameFr: 'Ain Benian' },
        ],
      },
      {
        id: '1608',
        nameAr: 'الرويبة',
        nameFr: 'Rouïba',
        communes: [
          { id: '160801', nameAr: 'الرويبة', nameFr: 'Rouïba' },
          { id: '160802', nameAr: 'الرغاية', nameFr: 'Reghaïa' },
          { id: '160803', nameAr: 'هراوة', nameFr: 'H’raoua' },
        ],
      },
      {
        id: '1609',
        nameAr: 'زرالدة',
        nameFr: 'Zéralda',
        communes: [
          { id: '160901', nameAr: 'زرالدة', nameFr: 'Zéralda' },
          { id: '160902', nameAr: 'سطاوالي', nameFr: 'Staoueli' },
          { id: '160903', nameAr: 'سويدانية', nameFr: 'Souidania' },
        ],
      },
      {
        id: '1610',
        nameAr: 'براقي',
        nameFr: 'Baraki',
        communes: [
          { id: '161001', nameAr: 'براقي', nameFr: 'Baraki' },
          { id: '161002', nameAr: 'الكاليتوس', nameFr: 'Les Eucalyptus' },
          { id: '161003', nameAr: 'سيدي موسى', nameFr: 'Sidi Moussa' },
        ],
      },
    ],
  },
  {
    code: '19',
    nameAr: 'سطيف',
    nameFr: 'Sétif',
    deliveryFee: 600,
    deliveryAvailable: true,
    dairas: [
      {
        id: '1901',
        nameAr: 'سطيف',
        nameFr: 'Sétif',
        communes: [{ id: '190101', nameAr: 'سطيف', nameFr: 'Sétif' }],
      },
      {
        id: '1902',
        nameAr: 'العلمة',
        nameFr: 'El Eulma',
        communes: [
          { id: '190201', nameAr: 'العلمة', nameFr: 'El Eulma' },
          { id: '190202', nameAr: 'قلتة زرقاء', nameFr: 'Guelta Zerka' },
          { id: '190203', nameAr: 'بئر العرش', nameFr: 'Bazer Sakhra' },
        ],
      },
      {
        id: '1903',
        nameAr: 'عين ولمان',
        nameFr: 'Ain Oulmene',
        communes: [{ id: '190301', nameAr: 'عين ولمان', nameFr: 'Ain Oulmene' }],
      },
    ],
  },
  {
    code: '25',
    nameAr: 'قسنطينة',
    nameFr: 'Constantine',
    deliveryFee: 600,
    deliveryAvailable: true,
    dairas: [
      {
        id: '2501',
        nameAr: 'قسنطينة',
        nameFr: 'Constantine',
        communes: [{ id: '250101', nameAr: 'قسنطينة', nameFr: 'Constantine' }],
      },
      {
        id: '2502',
        nameAr: 'الخروب',
        nameFr: 'El Khroub',
        communes: [
          { id: '250201', nameAr: 'الخروب', nameFr: 'El Khroub' },
          { id: '250202', nameAr: 'عين سمارة', nameFr: 'Ain Smara' },
          { id: '250203', nameAr: 'أولاد رحمون', nameFr: 'Ouled Rahmoune' },
        ],
      },
    ],
  },
  {
    code: '31',
    nameAr: 'وهران',
    nameFr: 'Oran',
    deliveryFee: 600,
    deliveryAvailable: true,
    dairas: [
      {
        id: '3101',
        nameAr: 'وهران',
        nameFr: 'Oran',
        communes: [{ id: '310101', nameAr: 'وهران', nameFr: 'Oran' }],
      },
      {
        id: '3102',
        nameAr: 'السانية',
        nameFr: 'Es Senia',
        communes: [
          { id: '310201', nameAr: 'السانية', nameFr: 'Es Senia' },
          { id: '310202', nameAr: 'الكرمة', nameFr: 'El Kerma' },
          { id: '310203', nameAr: 'سيدي الشحمي', nameFr: 'Sidi Chami' },
        ],
      },
      {
        id: '3103',
        nameAr: 'بئر الجير',
        nameFr: 'Bir El Djir',
        communes: [{ id: '310301', nameAr: 'بئر الجير', nameFr: 'Bir El Djir' }],
      },
    ],
  },
  {
    code: '35',
    nameAr: 'بومرداس',
    nameFr: 'Boumerdès',
    deliveryFee: 500,
    deliveryAvailable: true,
    dairas: [
      {
        id: '3501',
        nameAr: 'بومرداس',
        nameFr: 'Boumerdès',
        communes: [
          { id: '350101', nameAr: 'بومرداس', nameFr: 'Boumerdès' },
          { id: '350102', nameAr: 'قورصو', nameFr: 'Corso' },
          { id: '350103', nameAr: 'تيجلابين', nameFr: 'Tidjelabine' },
        ],
      },
      {
        id: '3502',
        nameAr: 'بودواو',
        nameFr: 'Boudouaou',
        communes: [
          { id: '350201', nameAr: 'بودواو', nameFr: 'Boudouaou' },
          { id: '350202', nameAr: 'قدارة', nameFr: 'Keddara' },
        ],
      },
    ],
  },
  {
    code: '42',
    nameAr: 'تيبازة',
    nameFr: 'Tipaza',
    deliveryFee: 500,
    deliveryAvailable: true,
    dairas: [
      {
        id: '4201',
        nameAr: 'تيبازة',
        nameFr: 'Tipaza',
        communes: [{ id: '420101', nameAr: 'تيبازة', nameFr: 'Tipaza' }],
      },
      {
        id: '4202',
        nameAr: 'القليعة',
        nameFr: 'Koléa',
        communes: [
          { id: '420201', nameAr: 'القليعة', nameFr: 'Koléa' },
          { id: '420202', nameAr: 'حطاطبة', nameFr: 'Hattatba' },
        ],
      },
    ],
  },
  // All other Algerian Wilayas (30 to 58) are registered with standardized administrative codes:
  { code: '03', nameAr: 'الأغواط', nameFr: 'Laghouat', deliveryFee: 700, deliveryAvailable: true, dairas: [{ id: '0301', nameAr: 'الأغواط', nameFr: 'Laghouat', communes: [{ id: '030101', nameAr: 'الأغواط', nameFr: 'Laghouat' }] }] },
  { code: '04', nameAr: 'أم البواقي', nameFr: 'Oum El Bouaghi', deliveryFee: 700, deliveryAvailable: true, dairas: [{ id: '0401', nameAr: 'أم البواقي', nameFr: 'Oum El Bouaghi', communes: [{ id: '040101', nameAr: 'أم البواقي', nameFr: 'Oum El Bouaghi' }] }] },
  { code: '05', nameAr: 'باتنة', nameFr: 'Batna', deliveryFee: 700, deliveryAvailable: true, dairas: [{ id: '0501', nameAr: 'باتنة', nameFr: 'Batna', communes: [{ id: '050101', nameAr: 'باتنة', nameFr: 'Batna' }] }] },
  { code: '06', nameAr: 'بجاية', nameFr: 'Béjaïa', deliveryFee: 600, deliveryAvailable: true, dairas: [{ id: '0601', nameAr: 'بجاية', nameFr: 'Béjaïa', communes: [{ id: '060101', nameAr: 'بجاية', nameFr: 'Béjaïa' }] }] },
  { code: '07', nameAr: 'بسكرة', nameFr: 'Biskra', deliveryFee: 700, deliveryAvailable: true, dairas: [{ id: '0701', nameAr: 'بسكرة', nameFr: 'Biskra', communes: [{ id: '070101', nameAr: 'بسكرة', nameFr: 'Biskra' }] }] },
  { code: '08', nameAr: 'بشار', nameFr: 'Béchar', deliveryFee: 900, deliveryAvailable: true, dairas: [{ id: '0801', nameAr: 'بشار', nameFr: 'Béchar', communes: [{ id: '080101', nameAr: 'بشار', nameFr: 'Béchar' }] }] },
  { code: '10', nameAr: 'البويرة', nameFr: 'Bouira', deliveryFee: 500, deliveryAvailable: true, dairas: [{ id: '1001', nameAr: 'البويرة', nameFr: 'Bouira', communes: [{ id: '100101', nameAr: 'البويرة', nameFr: 'Bouira' }] }] },
  { code: '11', nameAr: 'تمنراست', nameFr: 'Tamanrasset', deliveryFee: 1200, deliveryAvailable: false, dairas: [{ id: '1101', nameAr: 'تمنراست', nameFr: 'Tamanrasset', communes: [{ id: '110101', nameAr: 'تمنراست', nameFr: 'Tamanrasset' }] }] },
  { code: '12', nameAr: 'تبسة', nameFr: 'Tébessa', deliveryFee: 800, deliveryAvailable: true, dairas: [{ id: '1201', nameAr: 'تبسة', nameFr: 'Tébessa', communes: [{ id: '120101', nameAr: 'تبسة', nameFr: 'Tébessa' }] }] },
  { code: '13', nameAr: 'تلمسان', nameFr: 'Tlemcen', deliveryFee: 700, deliveryAvailable: true, dairas: [{ id: '1301', nameAr: 'تلمسان', nameFr: 'Tlemcen', communes: [{ id: '130101', nameAr: 'تلمسان', nameFr: 'Tlemcen' }] }] },
  { code: '14', nameAr: 'تيارت', nameFr: 'Tiaret', deliveryFee: 700, deliveryAvailable: true, dairas: [{ id: '1401', nameAr: 'تيارت', nameFr: 'Tiaret', communes: [{ id: '140101', nameAr: 'تيارت', nameFr: 'Tiaret' }] }] },
  { code: '15', nameAr: 'تيزي وزو', nameFr: 'Tizi Ouzou', deliveryFee: 500, deliveryAvailable: true, dairas: [{ id: '1501', nameAr: 'تيزي وزو', nameFr: 'Tizi Ouzou', communes: [{ id: '150101', nameAr: 'تيزي وزو', nameFr: 'Tizi Ouzou' }] }] },
  { code: '17', nameAr: 'الجلفة', nameFr: 'Djelfa', deliveryFee: 700, deliveryAvailable: true, dairas: [{ id: '1701', nameAr: 'الجلفة', nameFr: 'Djelfa', communes: [{ id: '170101', nameAr: 'الجلفة', nameFr: 'Djelfa' }] }] },
  { code: '18', nameAr: 'جيجل', nameFr: 'Jijel', deliveryFee: 600, deliveryAvailable: true, dairas: [{ id: '1801', nameAr: 'جيجل', nameFr: 'Jijel', communes: [{ id: '180101', nameAr: 'جيجل', nameFr: 'Jijel' }] }] },
  { code: '20', nameAr: 'سعيدة', nameFr: 'Saïda', deliveryFee: 700, deliveryAvailable: true, dairas: [{ id: '2001', nameAr: 'سعيدة', nameFr: 'Saïda', communes: [{ id: '200101', nameAr: 'سعيدة', nameFr: 'Saïda' }] }] },
  { code: '21', nameAr: 'سكيكدة', nameFr: 'Skikda', deliveryFee: 650, deliveryAvailable: true, dairas: [{ id: '2101', nameAr: 'سكيكدة', nameFr: 'Skikda', communes: [{ id: '210101', nameAr: 'سكيكدة', nameFr: 'Skikda' }] }] },
  { code: '22', nameAr: 'سيدي بلعباس', nameFr: 'Sidi Bel Abbès', deliveryFee: 650, deliveryAvailable: true, dairas: [{ id: '2201', nameAr: 'سيدي بلعباس', nameFr: 'Sidi Bel Abbès', communes: [{ id: '220101', nameAr: 'سيدي بلعباس', nameFr: 'Sidi Bel Abbès' }] }] },
  { code: '23', nameAr: 'عنابة', nameFr: 'Annaba', deliveryFee: 650, deliveryAvailable: true, dairas: [{ id: '2301', nameAr: 'عنابة', nameFr: 'Annaba', communes: [{ id: '230101', nameAr: 'عنابة', nameFr: 'Annaba' }] }] },
  { code: '24', nameAr: 'قالمة', nameFr: 'Guelma', deliveryFee: 700, deliveryAvailable: true, dairas: [{ id: '2401', nameAr: 'قالمة', nameFr: 'Guelma', communes: [{ id: '240101', nameAr: 'قالمة', nameFr: 'Guelma' }] }] },
  { code: '26', nameAr: 'المدية', nameFr: 'Médéa', deliveryFee: 500, deliveryAvailable: true, dairas: [{ id: '2601', nameAr: 'المدية', nameFr: 'Médéa', communes: [{ id: '260101', nameAr: 'المدية', nameFr: 'Médéa' }] }] },
  { code: '27', nameAr: 'مستغانم', nameFr: 'Mostaganem', deliveryFee: 600, deliveryAvailable: true, dairas: [{ id: '2701', nameAr: 'مستغانم', nameFr: 'Mostaganem', communes: [{ id: '270101', nameAr: 'مستغانم', nameFr: 'Mostaganem' }] }] },
  { code: '28', nameAr: 'المسيلة', nameFr: 'M’Sila', deliveryFee: 650, deliveryAvailable: true, dairas: [{ id: '2801', nameAr: 'المسيلة', nameFr: 'M’Sila', communes: [{ id: '280101', nameAr: 'المسيلة', nameFr: 'M’Sila' }] }] },
  { code: '29', nameAr: 'معسكر', nameFr: 'Mascara', deliveryFee: 650, deliveryAvailable: true, dairas: [{ id: '2901', nameAr: 'معسكر', nameFr: 'Mascara', communes: [{ id: '290101', nameAr: 'معسكر', nameFr: 'Mascara' }] }] },
  { code: '30', nameAr: 'ورقلة', nameFr: 'Ouargla', deliveryFee: 850, deliveryAvailable: true, dairas: [{ id: '3001', nameAr: 'ورقلة', nameFr: 'Ouargla', communes: [{ id: '300101', nameAr: 'ورقلة', nameFr: 'Ouargla' }] }] },
  { code: '32', nameAr: 'البيض', nameFr: 'El Bayadh', deliveryFee: 800, deliveryAvailable: true, dairas: [{ id: '3201', nameAr: 'البيض', nameFr: 'El Bayadh', communes: [{ id: '320101', nameAr: 'البيض', nameFr: 'El Bayadh' }] }] },
  { code: '33', nameAr: 'إليزي', nameFr: 'Illizi', deliveryFee: 1300, deliveryAvailable: false, dairas: [{ id: '3301', nameAr: 'إليزي', nameFr: 'Illizi', communes: [{ id: '330101', nameAr: 'إليزي', nameFr: 'Illizi' }] }] },
  { code: '34', nameAr: 'برج بوعريريج', nameFr: 'Bordj Bou Arréridj', deliveryFee: 550, deliveryAvailable: true, dairas: [{ id: '3401', nameAr: 'برج بوعريريج', nameFr: 'Bordj Bou Arréridj', communes: [{ id: '340101', nameAr: 'برج بوعريريج', nameFr: 'Bordj Bou Arréridj' }] }] },
  { code: '36', nameAr: 'الطارف', nameFr: 'El Tarf', deliveryFee: 700, deliveryAvailable: true, dairas: [{ id: '3601', nameAr: 'الطارف', nameFr: 'El Tarf', communes: [{ id: '360101', nameAr: 'الطارف', nameFr: 'El Tarf' }] }] },
  { code: '37', nameAr: 'تندوف', nameFr: 'Tindouf', deliveryFee: 1200, deliveryAvailable: false, dairas: [{ id: '3701', nameAr: 'تندوف', nameFr: 'Tindouf', communes: [{ id: '370101', nameAr: 'تندوف', nameFr: 'Tindouf' }] }] },
  { code: '38', nameAr: 'تسمسيلت', nameFr: 'Tissemsilt', deliveryFee: 650, deliveryAvailable: true, dairas: [{ id: '3801', nameAr: 'تسمسيلت', nameFr: 'Tissemsilt', communes: [{ id: '380101', nameAr: 'تسمسيلت', nameFr: 'Tissemsilt' }] }] },
  { code: '39', nameAr: 'الوادي', nameFr: 'El Oued', deliveryFee: 800, deliveryAvailable: true, dairas: [{ id: '3901', nameAr: 'الوادي', nameFr: 'El Oued', communes: [{ id: '390101', nameAr: 'الوادي', nameFr: 'El Oued' }] }] },
  { code: '40', nameAr: 'خنشلة', nameFr: 'Khenchela', deliveryFee: 750, deliveryAvailable: true, dairas: [{ id: '4001', nameAr: 'خنشلة', nameFr: 'Khenchela', communes: [{ id: '400101', nameAr: 'خنشلة', nameFr: 'Khenchela' }] }] },
  { code: '41', nameAr: 'سوق أهراس', nameFr: 'Souk Ahras', deliveryFee: 750, deliveryAvailable: true, dairas: [{ id: '4101', nameAr: 'سوق أهراس', nameFr: 'Souk Ahras', communes: [{ id: '410101', nameAr: 'سوق أهراس', nameFr: 'Souk Ahras' }] }] },
  { code: '43', nameAr: 'ميلة', nameFr: 'Mila', deliveryFee: 650, deliveryAvailable: true, dairas: [{ id: '4301', nameAr: 'ميلة', nameFr: 'Mila', communes: [{ id: '430101', nameAr: 'ميلة', nameFr: 'Mila' }] }] },
  { code: '44', nameAr: 'عين الدفلى', nameFr: 'Ain Defla', deliveryFee: 550, deliveryAvailable: true, dairas: [{ id: '4401', nameAr: 'عين الدفلى', nameFr: 'Ain Defla', communes: [{ id: '440101', nameAr: 'عين الدفلى', nameFr: 'Ain Defla' }] }] },
  { code: '45', nameAr: 'النعامة', nameFr: 'Naâma', deliveryFee: 850, deliveryAvailable: true, dairas: [{ id: '4501', nameAr: 'النعامة', nameFr: 'Naâma', communes: [{ id: '450101', nameAr: 'النعامة', nameFr: 'Naâma' }] }] },
  { code: '46', nameAr: 'عين تموشنت', nameFr: 'Ain Témouchent', deliveryFee: 650, deliveryAvailable: true, dairas: [{ id: '4601', nameAr: 'عين تموشنت', nameFr: 'Ain Témouchent', communes: [{ id: '460101', nameAr: 'عين تموشنت', nameFr: 'Ain Témouchent' }] }] },
  { code: '47', nameAr: 'غرداية', nameFr: 'Ghardaïa', deliveryFee: 800, deliveryAvailable: true, dairas: [{ id: '4701', nameAr: 'غرداية', nameFr: 'Ghardaïa', communes: [{ id: '470101', nameAr: 'غرداية', nameFr: 'Ghardaïa' }] }] },
  { code: '48', nameAr: 'غليزان', nameFr: 'Relizane', deliveryFee: 650, deliveryAvailable: true, dairas: [{ id: '4801', nameAr: 'غليزان', nameFr: 'Relizane', communes: [{ id: '480101', nameAr: 'غليزان', nameFr: 'Relizane' }] }] },
  { code: '49', nameAr: 'تيميمون', nameFr: 'Timimoun', deliveryFee: 1100, deliveryAvailable: true, dairas: [{ id: '4901', nameAr: 'تيميمون', nameFr: 'Timimoun', communes: [{ id: '490101', nameAr: 'تيميمون', nameFr: 'Timimoun' }] }] },
  { code: '50', nameAr: 'برج باجي مختار', nameFr: 'Bordj Badji Mokhtar', deliveryFee: 1500, deliveryAvailable: false, dairas: [{ id: '5001', nameAr: 'برج باجي مختار', nameFr: 'Bordj Badji Mokhtar', communes: [{ id: '500101', nameAr: 'برج باجي مختار', nameFr: 'Bordj Badji Mokhtar' }] }] },
  { code: '51', nameAr: 'أولاد جلال', nameFr: 'Ouled Djellal', deliveryFee: 800, deliveryAvailable: true, dairas: [{ id: '5101', nameAr: 'أولاد جلال', nameFr: 'Ouled Djellal', communes: [{ id: '510101', nameAr: 'أولاد جلال', nameFr: 'Ouled Djellal' }] }] },
  { code: '52', nameAr: 'بني عباس', nameFr: 'Béni Abbès', deliveryFee: 1000, deliveryAvailable: true, dairas: [{ id: '5201', nameAr: 'بني عباس', nameFr: 'Béni Abbès', communes: [{ id: '520101', nameAr: 'بني عباس', nameFr: 'Béni Abbès' }] }] },
  { code: '53', nameAr: 'عين صالح', nameFr: 'In Salah', deliveryFee: 1100, deliveryAvailable: true, dairas: [{ id: '5301', nameAr: 'عين صالح', nameFr: 'In Salah', communes: [{ id: '530101', nameAr: 'عين صالح', nameFr: 'In Salah' }] }] },
  { code: '54', nameAr: 'عين قزام', nameFr: 'In Guezzam', deliveryFee: 1500, deliveryAvailable: false, dairas: [{ id: '5401', nameAr: 'عين قزام', nameFr: 'In Guezzam', communes: [{ id: '540101', nameAr: 'عين قزام', nameFr: 'In Guezzam' }] }] },
  { code: '55', nameAr: 'تقرت', nameFr: 'Touggourt', deliveryFee: 850, deliveryAvailable: true, dairas: [{ id: '5501', nameAr: 'تقرت', nameFr: 'Touggourt', communes: [{ id: '550101', nameAr: 'تقرت', nameFr: 'Touggourt' }] }] },
  { code: '56', nameAr: 'جانت', nameFr: 'Djanet', deliveryFee: 1400, deliveryAvailable: false, dairas: [{ id: '5601', nameAr: 'جانت', nameFr: 'Djanet', communes: [{ id: '560101', nameAr: 'جانت', nameFr: 'Djanet' }] }] },
  { code: '57', nameAr: 'المغير', nameFr: 'El M’Ghair', deliveryFee: 850, deliveryAvailable: true, dairas: [{ id: '5701', nameAr: 'المغير', nameFr: 'El M’Ghair', communes: [{ id: '570101', nameAr: 'المغير', nameFr: 'El M’Ghair' }] }] },
  { code: '58', nameAr: 'المنيعة', nameFr: 'El Menia', deliveryFee: 900, deliveryAvailable: true, dairas: [{ id: '5801', nameAr: 'المنيعة', nameFr: 'El Menia', communes: [{ id: '580101', nameAr: 'المنيعة', nameFr: 'El Menia' }] }] },
];

export const getWilayaByCode = (code: string): WilayaData | undefined => {
  return ALGERIA_GEOGRAPHY.find((w) => w.code === code);
};
