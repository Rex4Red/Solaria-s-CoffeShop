'use client';

import { useState, useEffect } from 'react';
import { QrCode, Download, Printer, RefreshCw, Check, Loader2, Globe } from 'lucide-react';
import QRCodeLib from 'qrcode';
import api from '@/lib/api';
import toast from 'react-hot-toast';

interface TableInfo {
  id: string;
  tableNumber: number;
  qrToken: string;
  isActive: boolean;
}

interface TableQR extends TableInfo {
  qrDataUrl: string;
}

function getBaseUrl(): string {
  // Priority: env var → current browser origin
  const envUrl = process.env.NEXT_PUBLIC_ORDER_URL;
  if (envUrl) return envUrl;
  if (typeof window !== 'undefined') return window.location.origin;
  return 'http://localhost:3000';
}

export default function AdminTablesPage() {
  const [tables, setTables] = useState<TableQR[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTables, setSelectedTables] = useState<number[]>([]);
  const [baseUrl, setBaseUrl] = useState('');
  const [editingUrl, setEditingUrl] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  useEffect(() => {
    setBaseUrl(getBaseUrl());
  }, []);

  useEffect(() => {
    if (baseUrl) fetchAndGenerateQr();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [baseUrl]);

  const fetchAndGenerateQr = async () => {
    setLoading(true);
    try {
      const data = await api.tables.getAll();
      const withQr = await Promise.all(
        data.map(async (table: TableInfo) => {
          const orderUrl = `${baseUrl}/order?table=${table.qrToken}`;
          const qrDataUrl = await QRCodeLib.toDataURL(orderUrl, {
            margin: 2,
            width: 400,
            color: { dark: '#3D2B1F', light: '#FFFFFF' },
          });
          return { ...table, qrDataUrl };
        })
      );
      setTables(withQr);
    } catch {
      toast.error('Gagal memuat data meja');
    } finally {
      setLoading(false);
    }
  };

  const toggleSelect = (num: number) => {
    setSelectedTables((prev) =>
      prev.includes(num) ? prev.filter((n) => n !== num) : [...prev, num]
    );
  };

  const selectAll = () => {
    if (selectedTables.length === tables.length) {
      setSelectedTables([]);
    } else {
      setSelectedTables(tables.map((t) => t.tableNumber));
    }
  };

  const downloadQr = (t: TableQR) => {
    const link = document.createElement('a');
    link.download = `QR-Meja-${t.tableNumber}.png`;
    link.href = t.qrDataUrl;
    link.click();
  };

  const downloadSelected = () => {
    const toDl = tables.filter((t) => selectedTables.includes(t.tableNumber));
    toDl.forEach((t, i) => setTimeout(() => downloadQr(t), i * 300));
    toast.success(`Mengunduh ${toDl.length} QR code`);
  };

  const printSelected = () => {
    const toPrint = tables.filter((t) =>
      selectedTables.length === 0 ? true : selectedTables.includes(t.tableNumber)
    );

    const printWindow = window.open('', '_blank');
    if (!printWindow) { toast.error('Pop-up diblokir browser'); return; }

    printWindow.document.write(`<!DOCTYPE html><html><head>
      <title>QR Code Meja — Solaria's CoffeeShop</title>
      <style>
        *{margin:0;padding:0;box-sizing:border-box}
        body{font-family:'Segoe UI',system-ui,sans-serif}
        .page{display:grid;grid-template-columns:repeat(2,1fr);gap:24px;padding:24px;page-break-inside:avoid}
        .card{border:2px solid #e8e0d8;border-radius:16px;padding:24px;text-align:center;page-break-inside:avoid}
        .card img{width:200px;height:200px;margin:0 auto 12px;display:block}
        .card h2{font-size:22px;color:#3D2B1F;margin-bottom:4px}
        .card p{font-size:12px;color:#8C7B6F}
        .brand{font-size:14px;font-weight:600;color:#6F5B4B;margin-bottom:8px}
        .instruction{background:#FAF7F4;border-radius:8px;padding:8px 12px;margin-top:12px;font-size:11px;color:#6F5B4B}
        @media print{.page{padding:12px;gap:16px}.card{padding:16px}.card img{width:180px;height:180px}}
      </style></head><body><div class="page">
      ${toPrint.map((t) => `
        <div class="card">
          <div class="brand">☕ Solaria's CoffeeShop</div>
          <img src="${t.qrDataUrl}" alt="QR Meja ${t.tableNumber}" />
          <h2>Meja ${t.tableNumber}</h2>
          <p>Scan QR untuk pesan</p>
          <div class="instruction">Buka kamera HP → Arahkan ke QR code → Pilih menu & pesan langsung</div>
        </div>`).join('')}
      </div></body></html>`);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => printWindow.print(), 500);
  };

  const startEditUrl = () => {
    setUrlInput(baseUrl);
    setEditingUrl(true);
  };

  const saveUrl = () => {
    const cleaned = urlInput.trim().replace(/\/+$/, '');
    if (cleaned) {
      setBaseUrl(cleaned);
      toast.success('URL diperbarui — QR code akan di-regenerate');
    }
    setEditingUrl(false);
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div>
          <h1 className="font-sans font-bold text-2xl text-on-surface">Meja & QR Code</h1>
          <p className="text-sm text-on-surface-variant">
            {tables.length} meja aktif — cetak atau unduh QR code untuk setiap meja
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchAndGenerateQr}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-vanilla-mist text-on-surface-variant font-medium text-sm hover:bg-oat-milk active:scale-95 transition-all"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
          {selectedTables.length > 0 && (
            <>
              <button
                onClick={downloadSelected}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-info-blue/10 text-info-blue font-medium text-sm hover:bg-info-blue/15 active:scale-95 transition-all"
              >
                <Download size={16} />
                Unduh ({selectedTables.length})
              </button>
              <button
                onClick={printSelected}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-on-primary font-medium text-sm hover:bg-mocha-dark active:scale-95 transition-all"
              >
                <Printer size={16} />
                Cetak ({selectedTables.length})
              </button>
            </>
          )}
        </div>
      </div>

      {/* URL Config Banner */}
      <div className="bg-vanilla-mist border border-oat-milk rounded-xl px-4 py-3 mb-4" style={{ position: 'relative', zIndex: 10 }}>
        {editingUrl ? (
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="flex items-center gap-2 flex-grow">
              <Globe size={16} className="text-primary shrink-0" />
              <input
                type="text"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && saveUrl()}
                autoFocus
                placeholder="http://192.168.1.x:3000"
                className="flex-grow px-3 py-1.5 rounded-lg border border-primary/30 bg-white text-sm font-mono text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <div className="flex gap-2 shrink-0">
              <button
                type="button"
                onClick={saveUrl}
                className="px-4 py-1.5 rounded-lg bg-primary text-on-primary text-xs font-semibold hover:bg-mocha-dark active:scale-95 transition-all"
              >
                Simpan
              </button>
              <button
                type="button"
                onClick={() => setEditingUrl(false)}
                className="px-4 py-1.5 rounded-lg bg-white border border-outline-variant text-on-surface-variant text-xs font-semibold hover:bg-oat-milk active:scale-95 transition-all"
              >
                Batal
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Globe size={16} className="text-primary shrink-0" />
            <span className="text-on-surface-variant text-sm shrink-0">URL QR:</span>
            <code className="text-xs text-primary font-mono bg-white/50 px-2 py-0.5 rounded overflow-hidden text-ellipsis whitespace-nowrap flex-grow" style={{ maxWidth: '60%' }}>
              {baseUrl}/order?table=...
            </code>
            <button
              type="button"
              onClick={startEditUrl}
              className="shrink-0 ml-auto px-3 py-1.5 rounded-lg bg-primary text-on-primary text-xs font-semibold hover:bg-mocha-dark active:scale-95 transition-all cursor-pointer"
            >
              Ubah URL
            </button>
          </div>
        )}
      </div>

      {/* Select All / Print All */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={selectAll}
          className="flex items-center gap-2 text-sm font-medium text-primary hover:text-mocha-dark transition-colors"
        >
          <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
            selectedTables.length === tables.length && tables.length > 0 ? 'bg-primary border-primary' : 'border-outline-variant'
          }`}>
            {selectedTables.length === tables.length && tables.length > 0 && <Check size={14} className="text-white" />}
          </div>
          Pilih Semua
        </button>
        {selectedTables.length === 0 && tables.length > 0 && (
          <button
            onClick={printSelected}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-on-primary font-medium text-sm hover:bg-mocha-dark active:scale-95 transition-all"
          >
            <Printer size={16} />
            Cetak Semua
          </button>
        )}
      </div>

      {/* QR Code Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 size={32} className="text-primary animate-spin mb-3" />
          <p className="text-sm text-on-surface-variant">Generating QR codes...</p>
        </div>
      ) : tables.length === 0 ? (
        <div className="text-center py-20">
          <QrCode size={48} className="text-outline-variant mx-auto mb-4" />
          <p className="font-sans font-semibold text-on-surface-variant">Belum ada meja</p>
          <p className="text-sm text-outline mt-1">Tambahkan meja melalui database</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {tables.map((t) => {
            const selected = selectedTables.includes(t.tableNumber);
            return (
              <div
                key={t.tableNumber}
                onClick={() => toggleSelect(t.tableNumber)}
                className={`relative bg-surface-bright border rounded-xl p-4 cursor-pointer transition-all hover:shadow-md group ${
                  selected ? 'border-primary ring-2 ring-primary/20' : 'border-oat-milk hover:border-primary/40'
                }`}
              >
                {/* Checkbox */}
                <div className={`absolute top-3 right-3 w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                  selected ? 'bg-primary border-primary' : 'border-outline-variant group-hover:border-primary/50'
                }`}>
                  {selected && <Check size={14} className="text-white" />}
                </div>

                {/* QR Code */}
                <div className="flex justify-center mb-3">
                  <img
                    src={t.qrDataUrl}
                    alt={`QR Meja ${t.tableNumber}`}
                    className="w-full max-w-[160px] aspect-square rounded-lg"
                  />
                </div>

                {/* Label */}
                <div className="text-center">
                  <p className="font-sans font-bold text-lg text-primary">Meja {t.tableNumber}</p>
                  <p className="text-[11px] text-on-surface-variant mt-0.5">Scan untuk pesan</p>
                </div>

                {/* Download */}
                <button
                  onClick={(e) => { e.stopPropagation(); downloadQr(t); }}
                  className="mt-3 w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-vanilla-mist text-on-surface-variant text-xs font-medium hover:bg-oat-milk active:scale-95 transition-all"
                >
                  <Download size={12} /> Unduh
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Info Section */}
      <div className="mt-8 bg-vanilla-mist border border-oat-milk rounded-xl p-5">
        <h3 className="font-sans font-semibold text-sm text-primary mb-2">ℹ️ Cara Menggunakan QR Code</h3>
        <ol className="text-sm text-on-surface-variant space-y-1.5 list-decimal list-inside">
          <li><strong>Atur URL</strong> — Klik "Ubah URL" di atas, masukkan IP komputer kamu (misal <code className="text-xs bg-white/50 px-1 rounded">http://192.168.1.x:3000</code>)</li>
          <li>Cetak atau unduh QR code untuk setiap meja</li>
          <li>Tempelkan QR code di meja pelanggan (bisa di akrilik atau stiker)</li>
          <li>Pelanggan scan QR → otomatis buka halaman menu → pilih pesanan → bayar</li>
          <li>Pesanan masuk ke panel kasir untuk dikonfirmasi</li>
        </ol>
      </div>
    </div>
  );
}
