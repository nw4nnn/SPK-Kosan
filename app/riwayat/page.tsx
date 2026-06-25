"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  History,
  Trash2,
  Trophy,
  Calendar,
  Building2,
  TrendingUp,
} from "lucide-react";
import PageHeader from "@/components/PageHeader";
import LoadingSpinner from "@/components/LoadingSpinner";
import EmptyState from "@/components/EmptyState";
import AlertMessage from "@/components/AlertMessage";

interface HistoryItem {
  id: number;
  hasilTerbaik: string;
  skor: number;
  jumlahAlternatif: number;
  createdAt: string;
}

export default function RiwayatPage() {
  const [histories, setHistories] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchHistories = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/histories");
      setHistories(res.data.data);
    } catch {
      setError("Gagal memuat riwayat perhitungan");
    } finally {
      setLoading(false);
    }
  };

  const handleClearAll = async () => {
    if (
      !confirm(
        "Hapus semua riwayat perhitungan? Tindakan ini tidak bisa dibatalkan.",
      )
    )
      return;
    try {
      await axios.delete("/api/histories");
      setSuccess("Semua riwayat berhasil dihapus");
      setHistories([]);
    } catch {
      setError("Gagal menghapus riwayat");
    }
  };

  const handleDeleteOne = async (id: number) => {
    if (!confirm("Hapus riwayat ini?")) return;
    try {
      await axios.delete(`/api/histories/${id}`);
      setSuccess("Riwayat berhasil dihapus");
      fetchHistories();
    } catch {
      setError("Gagal menghapus riwayat");
    }
  };

  useEffect(() => {
    fetchHistories();
  }, []);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <PageHeader
        title="Riwayat Perhitungan"
        description="Semua hasil perhitungan SAW yang pernah disimpan"
        icon={History}
        action={
          histories.length > 0 ? (
            <button
              onClick={handleClearAll}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-600 text-sm font-medium hover:bg-red-50 hover:border-red-300 hover:text-red-700 transition-all shadow-sm"
            >
              <Trash2 className="w-4 h-4" />
              Hapus Semua
            </button>
          ) : undefined
        }
      />

      {error && (
        <div className="mb-4">
          <AlertMessage type="error" message={error} onClose={() => setError("")} />
        </div>
      )}
      {success && (
        <div className="mb-4">
          <AlertMessage type="success" message={success} onClose={() => setSuccess("")} />
        </div>
      )}

      {loading ? (
        <LoadingSpinner text="Memuat riwayat..." />
      ) : histories.length === 0 ? (
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm">
          <EmptyState
            icon={History}
            title="Belum Ada Riwayat"
            description="Jalankan perhitungan SAW dan simpan hasilnya untuk melihat riwayat di sini."
          />
        </div>
      ) : (
        <div className="space-y-5">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                <History className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <div className="text-xs text-slate-500 font-medium">Total Perhitungan</div>
                <div className="text-xl font-bold text-slate-900">{histories.length}</div>
              </div>
            </div>
            <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center flex-shrink-0">
                <Trophy className="w-4 h-4 text-amber-600" />
              </div>
              <div className="min-w-0">
                <div className="text-xs text-slate-500 font-medium">Hasil Terbaik Terakhir</div>
                <div className="text-sm font-bold text-slate-900 truncate">
                  {histories[0]?.hasilTerbaik ?? "-"}
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
              </div>
              <div>
                <div className="text-xs text-slate-500 font-medium">Skor Tertinggi Terakhir</div>
                <div className="text-xl font-bold text-slate-900 font-mono">
                  {histories[0]?.skor?.toFixed(4) ?? "-"}
                </div>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-900">
                Daftar Riwayat Perhitungan
              </h2>
              <span className="text-xs text-slate-500">
                {histories.length} perhitungan tersimpan
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full table-pro">
                <thead>
                  <tr>
                    <th className="w-10">No</th>
                    <th>Tanggal & Waktu</th>
                    <th className="text-center">Jml. Alternatif</th>
                    <th>Alternatif Terbaik</th>
                    <th>Skor SAW</th>
                    <th className="text-center w-24">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {histories.map((item, idx) => (
                    <tr key={item.id} className={idx === 0 ? "bg-amber-50/50" : ""}>
                      <td className="text-slate-400 text-center font-medium">
                        {idx + 1}
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                          <span className="text-slate-700 text-sm">
                            {formatDate(item.createdAt)}
                          </span>
                        </div>
                        {idx === 0 && (
                          <span className="text-xs text-amber-600 font-medium">
                            Terbaru
                          </span>
                        )}
                      </td>
                      <td className="text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <Building2 className="w-3.5 h-3.5 text-slate-400" />
                          <span className="font-semibold text-slate-900">
                            {item.jumlahAlternatif}
                          </span>
                        </div>
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          <Trophy className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                          <span className="font-semibold text-slate-900">
                            {item.hasilTerbaik}
                          </span>
                        </div>
                      </td>
                      <td>
                        <div className="flex items-center gap-1.5">
                          <TrendingUp className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                          <span className="font-mono font-bold text-primary-600">
                            {item.skor.toFixed(4)}
                          </span>
                        </div>
                      </td>
                      <td className="text-center">
                        <button
                          onClick={() => handleDeleteOne(item.id)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-600 text-xs font-medium hover:border-red-300 hover:text-red-700 hover:bg-red-50 transition-colors"
                        >
                          <Trash2 className="w-3 h-3" />
                          Hapus
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>


        </div>
      )}
    </div>
  );
}
