import React, { useState } from 'react';
import { Printer, Download, X, FileText, Truck, ShieldCheck, Check } from 'lucide-react';
import { Order } from '../../types';

interface OrderInvoiceModalProps {
  order: Order | null;
  onClose: () => void;
}

// Convert numbers into French words (e.g. 79270 -> soixante-dix-neuf mille deux cent soixante-dix)
const numberToFrenchWords = (num: number): string => {
  const units = ['', 'un', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf'];
  const teens = [
    'dix',
    'onze',
    'douze',
    'treize',
    'quatorze',
    'quinze',
    'seize',
    'dix-sept',
    'dix-huit',
    'dix-neuf',
  ];
  const tens = ['', 'dix', 'vingt', 'trente', 'quarante', 'cinquante', 'soixante', 'soixante-dix', 'quatre-vingts', 'quatre-vingt-dix'];

  if (num === 0) return 'zéro';
  if (num < 10) return units[num];
  if (num < 20) return teens[num - 10];
  if (num < 100) {
    const ten = Math.floor(num / 10);
    const unit = num % 10;
    if (ten === 7) return `soixante-${teens[unit]}`;
    if (ten === 9) return `quatre-vingt-${teens[unit]}`;
    return unit === 0 ? tens[ten] : `${tens[ten]}-${units[unit]}`;
  }
  if (num < 1000) {
    const hundred = Math.floor(num / 100);
    const rest = num % 100;
    const hStr = hundred === 1 ? 'cent' : `${units[hundred]} cents`;
    return rest === 0 ? hStr : `${hStr} ${numberToFrenchWords(rest)}`;
  }
  if (num < 1000000) {
    const thousand = Math.floor(num / 1000);
    const rest = num % 1000;
    const tStr = thousand === 1 ? 'mille' : `${numberToFrenchWords(thousand)} mille`;
    return rest === 0 ? tStr : `${tStr} ${numberToFrenchWords(rest)}`;
  }
  return `${num.toLocaleString()} Dinars Algériens`;
};

export const OrderInvoiceModal: React.FC<OrderInvoiceModalProps> = ({ order, onClose }) => {
  const [docType, setDocType] = useState<'FACTURE' | 'BON_LIVRAISON'>('FACTURE');

  if (!order) return null;

  const invoiceNumber = `FACT-${order.orderNumber.replace('SEL-', '')}`;
  const blNumber = `BL-${order.orderNumber.replace('SEL-', '')}`;
  const orderDate = new Date(order.createdAt).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  const totalCartons = order.items.reduce((s, i) => s + i.cartonsQuantity, 0);
  const totalUnits = order.items.reduce((s, i) => s + i.unitsQuantity, 0);
  const totalPieces = order.items.reduce((s, i) => s + i.totalUnits, 0);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto print:p-0 print:bg-white print:static">
      <div className="bg-white rounded-2xl max-w-4xl w-full p-6 sm:p-8 space-y-6 max-h-[95vh] overflow-y-auto border border-stone-200 shadow-2xl print:max-w-none print:max-h-none print:border-none print:shadow-none print:p-0">
        {/* Modal Controls (Hidden in Print) */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-4 border-b border-stone-200 print:hidden">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setDocType('FACTURE')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                docType === 'FACTURE'
                  ? 'bg-[#0F392B] text-white shadow-xs'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Facture Commerciale (FACTURE)</span>
            </button>
            <button
              onClick={() => setDocType('BON_LIVRAISON')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                docType === 'BON_LIVRAISON'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              <Truck className="w-3.5 h-3.5" />
              <span>Bon de Livraison (BL)</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-bold flex items-center gap-2 shadow-xs transition"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimer le document (A4 / PDF)</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PRINTABLE A4 INVOICE / DELIVERY SLIP CONTENT (100% FRENCH) */}
        <div className="bg-white text-stone-900 p-6 sm:p-10 border border-stone-200 rounded-xl space-y-8 font-sans print:border-none print:p-0 print:space-y-6">
          {/* Header & Company Brand Info */}
          <div className="flex justify-between items-start gap-6 pb-6 border-b-2 border-stone-900">
            <div className="space-y-1.5">
              <div className="text-2xl sm:text-3xl font-black tracking-tight text-[#0F392B]">
                SELSABIL DELIVERY SARL
              </div>
              <div className="text-xs font-bold text-stone-700">
                Société de Commerce de Gros & Demi-gros de Produits Alimentaires & Marchandises
              </div>
              <div className="text-[11px] text-stone-500 leading-tight space-y-0.5 pt-1">
                <p>Zone Industrielle Oued Smar, Lot N° 45, Alger, Algérie</p>
                <p>
                  <strong>RC :</strong> 16/00-1234567B26 • <strong>NIF :</strong> 002616012345678 •{' '}
                  <strong>NIS :</strong> 0016123400098 • <strong>ART :</strong> 16012345678
                </p>
                <p>
                  <strong>Tél :</strong> +213 (0) 23 45 67 89 • <strong>Mobile :</strong> +213 (0) 550 12 34 56
                </p>
                <p>
                  <strong>Email :</strong> contact@selsabil-delivery.dz •{' '}
                  <strong>Plateforme :</strong> www.selsabil-delivery.dz
                </p>
              </div>
            </div>

            {/* Document Badge */}
            <div className="text-end shrink-0 space-y-2">
              <div className="inline-block px-4 py-2 bg-stone-900 text-white text-sm font-black tracking-wider uppercase rounded">
                {docType === 'FACTURE' ? 'FACTURE COMMERCIALE' : 'BON DE LIVRAISON'}
              </div>
              <div className="font-mono text-xs font-bold text-stone-800">
                N° : {docType === 'FACTURE' ? invoiceNumber : blNumber}
              </div>
              <div className="text-[11px] text-stone-500">
                Date : <strong>{orderDate}</strong>
              </div>
              <div className="text-[11px] text-stone-500">
                Réf. Commande : <strong className="font-mono">{order.orderNumber}</strong>
              </div>
            </div>
          </div>

          {/* Client & Shipping Details */}
          <div className="grid grid-cols-2 gap-6 bg-stone-50 p-4 rounded-xl border border-stone-200 text-xs">
            {/* Facturé à / Livré à */}
            <div className="space-y-1">
              <span className="font-bold text-stone-400 uppercase tracking-wider text-[10px] block">
                {docType === 'FACTURE' ? 'DOIT / FACTURÉ À :' : 'DESTINATAIRE / LIVRÉ À :'}
              </span>
              <div className="font-black text-stone-900 text-sm">
                {order.customerInfo.storeName}
              </div>
              <div className="font-semibold text-stone-700">
                Contact : {order.customerInfo.fullName}
              </div>
              <div className="text-stone-600 font-mono">
                Tél : {order.customerInfo.phone}
              </div>
              <div className="text-stone-600">
                Adresse : {order.shippingAddress.detailedAddress}
              </div>
              <div className="font-bold text-stone-800">
                {order.shippingAddress.communeName.fr}, Wilaya de {order.shippingAddress.wilayaName.fr} ({order.shippingAddress.wilayaCode})
              </div>
            </div>

            {/* Commercial & Terms */}
            <div className="space-y-1 text-end">
              <span className="font-bold text-stone-400 uppercase tracking-wider text-[10px] block">
                PARAMÈTRES COMMERCIAUX :
              </span>
              <div className="text-stone-700">
                Code Commercial :{' '}
                <strong className="font-mono bg-stone-200 px-2 py-0.5 rounded text-stone-900">
                  {order.commercialCode || 'D01'}
                </strong>
              </div>
              <div className="text-stone-700">
                Barème Client :{' '}
                <strong className="text-emerald-900 font-black">
                  {order.customerInfo.priceTier}
                </strong>
              </div>
              <div className="text-stone-700">
                Mode de Règlement :{' '}
                <strong className="text-amber-900 font-bold">
                  Espèces à la Livraison (COD)
                </strong>
              </div>
              <div className="text-stone-700">
                Statut Document :{' '}
                <strong className="uppercase font-bold text-stone-900">
                  {order.status}
                </strong>
              </div>
            </div>
          </div>

          {/* ARTICLES TABLE (100% FRENCH PRODUCT NAMES) */}
          <div className="border border-stone-300 rounded-lg overflow-hidden">
            <table className="w-full text-xs text-start">
              <thead className="bg-stone-100 text-stone-800 font-bold border-b border-stone-300">
                <tr>
                  <th className="py-2.5 px-3 text-start w-10">N°</th>
                  <th className="py-2.5 px-3 text-start w-24">Réf. SKU</th>
                  <th className="py-2.5 px-3 text-start">Désignation des Marchandises</th>
                  <th className="py-2.5 px-3 text-center">Colisage</th>
                  <th className="py-2.5 px-3 text-center">Quantité</th>
                  <th className="py-2.5 px-3 text-end">Prix Unit. HT</th>
                  <th className="py-2.5 px-3 text-end">Prix Ctn. HT</th>
                  <th className="py-2.5 px-3 text-end">Montant Total HT</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {order.items.map((item, idx) => (
                  <tr key={idx} className="hover:bg-stone-50/50">
                    <td className="py-2.5 px-3 text-stone-400 font-mono text-[11px]">{idx + 1}</td>
                    <td className="py-2.5 px-3 font-mono font-bold text-stone-700">{item.sku}</td>
                    <td className="py-2.5 px-3 font-bold text-stone-900">
                      {item.nameFr}
                    </td>
                    <td className="py-2.5 px-3 text-center text-stone-600 font-medium">
                      {item.unitsPerCarton} U / Ctn
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span className="font-bold text-stone-900">
                        {item.cartonsQuantity} Ctn
                      </span>
                      {item.unitsQuantity > 0 && (
                        <span className="text-stone-500 text-[11px]"> + {item.unitsQuantity} U</span>
                      )}
                      <div className="text-[10px] text-stone-400">({item.totalUnits} U)</div>
                    </td>
                    <td className="py-2.5 px-3 text-end font-semibold text-stone-800">
                      {item.unitPriceApplied.toLocaleString()} DA
                    </td>
                    <td className="py-2.5 px-3 text-end text-stone-600">
                      {item.cartonPriceApplied.toLocaleString()} DA
                    </td>
                    <td className="py-2.5 px-3 text-end font-black text-stone-900">
                      {item.lineTotal.toLocaleString()} DA
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* TOTALS & SUMMARY SECTION */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
            <div className="space-y-3">
              {/* French Words Certification */}
              <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-200 text-xs text-stone-700 space-y-1">
                <span className="font-bold text-stone-900 block">
                  Arrêtée la présente facture à la somme de :
                </span>
                <p className="italic text-stone-800 font-medium capitalize">
                  {numberToFrenchWords(order.totalAmount)} Dinars Algériens.
                </p>
              </div>

              {/* Special COD Cash Collection Alert on Delivery Slip */}
              {docType === 'BON_LIVRAISON' && (
                <div className="bg-amber-100 border-2 border-amber-400 p-3.5 rounded-xl text-xs text-amber-950 font-bold space-y-1">
                  <div className="flex items-center gap-1.5 uppercase tracking-wide">
                    <Truck className="w-4 h-4 text-amber-800" />
                    <span>CONSIGNE LIVREUR — ENCAISSEMENT ESPÈCES (COD) :</span>
                  </div>
                  <div className="text-lg font-black text-amber-950">
                    MONTANT À ENCAISSER : {order.totalAmount.toLocaleString()} DZD
                  </div>
                </div>
              )}

              {order.customerNotes && (
                <div className="text-xs text-stone-600 bg-stone-50 p-2.5 rounded-lg border border-stone-200">
                  <strong className="text-stone-800">Note du Client :</strong> {order.customerNotes}
                </div>
              )}
            </div>

            {/* Financial Breakdown Table */}
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1.5 px-3 bg-stone-50 rounded border border-stone-200 text-stone-700">
                <span>Total Marchandises Hors Taxes (HT) :</span>
                <span className="font-bold text-stone-900">{order.subtotal.toLocaleString()} DA</span>
              </div>
              <div className="flex justify-between py-1.5 px-3 bg-stone-50 rounded border border-stone-200 text-stone-700">
                <span>Frais de Transport & Livraison Wilaya :</span>
                <span className="font-bold text-stone-900">{order.deliveryFee.toLocaleString()} DA</span>
              </div>
              <div className="flex justify-between py-1.5 px-3 bg-stone-50 rounded border border-stone-200 text-stone-700">
                <span>Droit de Timbre Fiscal (Espèces) :</span>
                <span className="font-bold text-stone-500">Inclus (0.00 DA)</span>
              </div>
              <div className="flex justify-between py-2.5 px-3 bg-[#0F392B] text-white rounded text-sm font-black shadow-xs">
                <span>NET À PAYER EN ESPÈCES (TTC) :</span>
                <span className="text-amber-300">{order.totalAmount.toLocaleString()} DZD</span>
              </div>
              <div className="text-[11px] text-stone-400 text-end">
                Total Colis : {totalCartons} Cartons + {totalUnits} Unités ({totalPieces} Pièces)
              </div>
            </div>
          </div>

          {/* SIGNATURE & STAMP BOXES */}
          <div className="grid grid-cols-2 gap-8 pt-8 border-t-2 border-stone-300 text-xs">
            <div className="border border-stone-300 rounded-xl p-4 text-center h-32 flex flex-col justify-between">
              <span className="font-bold text-stone-700">
                Cachet & Signature du Client (Bon pour Accord) :
              </span>
              <span className="text-[10px] text-stone-400">Reçu conforme en bon état</span>
            </div>

            <div className="border border-stone-300 rounded-xl p-4 text-center h-32 flex flex-col justify-between">
              <span className="font-bold text-stone-700">
                Direction Commerciale SELSABIL DELIVERY :
              </span>
              <div className="w-20 h-10 border-2 border-emerald-800/40 rounded mx-auto flex items-center justify-center text-[10px] font-bold text-emerald-800 uppercase tracking-widest">
                SELSABIL SARL
              </div>
            </div>
          </div>

          {/* Footer Notice */}
          <div className="text-center text-[10px] text-stone-400 pt-4 border-t border-stone-200">
            SELSABIL DELIVERY — Plateforme E-commerce B2B & B2C Algérie • Facturation certifiée conforme au Code de Commerce Algérien.
          </div>
        </div>
      </div>
    </div>
  );
};
