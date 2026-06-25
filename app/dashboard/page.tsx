"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import {
  Building2,
  Settings,
  History,
  Trophy,
  Calculator,
  ArrowRight,
  RefreshCw,
  Database,
  BarChart3,
  Activity,
  TrendingUp,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import StatCard from "@/components/StatCard";
import LoadingSpinner from "@/components/LoadingSpinner";
import AlertMessage from "@/components/AlertMessage";
import PageHeader from "@/components/PageHeader";

interface DashboardStats {
  totalAlternatif: number;
  totalKriteria: number;
  totalHistory: number;
  hasilTerbaikTerakhir: string | null;
  skorTerakhir: number | null;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [seeding, setSeeding] = useState(false);
  const [seedMsg, setSeedMsg] = useState("");

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/dashboard");
      setStats(res.data.data);
    } catch {
      setError("Gagal memuat statistik dashboard");
    } finally {
      setLoading(false);
    }
  };

  const handleSeed = async () => {
    if (
      !confirm(
        "Reset semua data dan isi ulang dengan data dummy? Semua data saat ini akan dihapus.",
      )
    )
      return;
    try {
      setSeeding(true);
      const res = await axios.post("/api/seed");
      setSeedMsg(res.data.message);
      fetchStats();
    } catch {
      setSeedMsg("Gagal menjalankan seed data");
    } finally {
      setSeeding(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const quickLinks = [
    {
      href: "/alternatif",
      icon: Building2,
      label: "Kelola Data Kos",
      desc: "Tambah, edit, atau hapus data kos-kosan",
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      href: "/kriteria",
      icon: Settings,
      label: "Atur Kriteria",
      desc: "Sesuaikan bobot dan tipe kriteria",
      color: "text-indigo-600",
      bg: "bg-indigo-50",
    },
    {
      href: "/perhitungan",
      icon: Calculator,
      label: "Hitung SAW",
      desc: "Jalankan perhitungan dan lihat hasil",
      color: "text-cyan-600",
      bg: "bg-cyan-50",
    },
    {
      href: "/riwayat",
      icon: History,
      label: "Lihat Riwayat",
      desc: "Riwayat semua hasil perhitungan",
      color: "text-violet-600",
      bg: "bg-violet-50",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <PageHeader
        title="Dashboard"
        description="Ringkasan statistik sistem pendukung keputusan kos-kosan"
        icon={BarChart3}
        action={
          <div className="flex gap-2">
            <button
              onClick={handleSeed}
              disabled={seeding}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-600 text-sm font-medium hover:bg-amber-50 hover:border-amber-300 hover:text-amber-700 transition-all disabled:opacity-50 shadow-sm"
            >
              <Database className="w-4 h-4" />
              {seeding ? "Loading..." : "Seed Data"}
            </button>
            <button
              onClick={fetchStats}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-600 text-sm font-medium hover:bg-primary-50 hover:border-primary-300 hover:text-primary-700 transition-all shadow-sm"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>
        }
      />

      {seedMsg && (
        <div className="mb-5">
          <AlertMessage
            type={seedMsg.includes("berhasil") ? "success" : "error"}
            message={seedMsg}
            onClose={() => setSeedMsg("")}
          />
        </div>
      )}

      {error && (
        <div className="mb-5">
          <AlertMessage
            type="error"
            message={error}
            onClose={() => setError("")}
          />
        </div>
      )}

      {loading ? (
        <LoadingSpinner text="Memuat statistik..." />
      ) : stats ? (
        <div className="space-y-6">
          {/* Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Total Kos"
              value={stats.totalAlternatif}
              subtitle="Alternatif kos-kosan"
              icon={Building2}
              color="blue"
            />
            <StatCard
              title="Total Kriteria"
              value={stats.totalKriteria}
              subtitle="Kriteria penilaian"
              icon={Settings}
              color="indigo"
            />
            <StatCard
              title="Total Riwayat"
              value={stats.totalHistory}
              subtitle="Perhitungan tersimpan"
              icon={History}
              color="cyan"
            />
            <StatCard
              title="Kos Terbaik"
              value={stats.hasilTerbaikTerakhir ?? "-"}
              subtitle={
                stats.skorTerakhir != null
                  ? `Skor: ${stats.skorTerakhir.toFixed(4)}`
                  : "Belum ada perhitungan"
              }
              icon={Trophy}
              color="violet"
            />
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Quick Access */}
            <div className="lg:col-span-2 bg-white rounded-lg border border-slate-200 shadow-sm">
              <div className="px-5 py-4 border-b border-slate-200 flex items-center gap-2">
                <Activity className="w-4 h-4 text-primary-600" />
                <h2 className="text-sm font-semibold text-slate-900">
                  Akses Cepat
                </h2>
              </div>
              <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {quickLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:border-primary-200 hover:bg-primary-50 transition-all duration-150 group"
                    >
                      <div
                        className={`w-9 h-9 rounded-lg ${link.bg} flex items-center justify-center flex-shrink-0`}
                      >
                        <Icon className={`w-4 h-4 ${link.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-slate-900 text-sm">
                          {link.label}
                        </div>
                        <div className="text-slate-500 text-xs truncate">
                          {link.desc}
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-primary-600 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Status Sistem */}
            <div className="bg-white rounded-lg border border-slate-200 shadow-sm">
              <div className="px-5 py-4 border-b border-slate-200 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-primary-600" />
                <h2 className="text-sm font-semibold text-slate-900">
                  Status Sistem
                </h2>
              </div>
              <div className="p-5 space-y-3">
                <div className="flex items-center justify-between py-2 border-b border-slate-100">
                  <span className="text-xs text-slate-500">Alternatif Aktif</span>
                  <span className="text-sm font-bold text-slate-900">
                    {stats.totalAlternatif}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-slate-100">
                  <span className="text-xs text-slate-500">Kriteria Aktif</span>
                  <span className="text-sm font-bold text-slate-900">
                    {stats.totalKriteria}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-slate-100">
                  <span className="text-xs text-slate-500">Total Perhitungan</span>
                  <span className="text-sm font-bold text-slate-900">
                    {stats.totalHistory}
                  </span>
                </div>
                <div className="flex items-start gap-2 pt-1">
                  {stats.hasilTerbaikTerakhir ? (
                    <div className="flex items-start gap-2 w-full p-3 rounded-lg bg-emerald-50 border border-emerald-200">
                      <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-semibold text-emerald-800">
                          Kos Terbaik Terakhir
                        </p>
                        <p className="text-xs text-emerald-700 mt-0.5">
                          {stats.hasilTerbaikTerakhir}
                        </p>
                        {stats.skorTerakhir != null && (
                          <p className="text-xs text-emerald-600 font-mono font-bold mt-1">
                            Skor: {stats.skorTerakhir.toFixed(4)}
                          </p>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start gap-2 w-full p-3 rounded-lg bg-amber-50 border border-amber-200">
                      <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-semibold text-amber-800">
                          Belum Ada Perhitungan
                        </p>
                        <p className="text-xs text-amber-700 mt-0.5">
                          Jalankan perhitungan SAW untuk mendapatkan rekomendasi.
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <Link
                  href="/perhitungan"
                  className="mt-2 flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-lg bg-primary-600 text-white text-sm font-semibold hover:bg-primary-700 transition-colors"
                >
                  <Calculator className="w-4 h-4" />
                  Hitung SAW
                </Link>
              </div>
            </div>
          </div>

          {/* Tentang Metode SAW */}
          <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-200 flex items-center gap-2">
              <Calculator className="w-4 h-4 text-primary-600" />
              <h2 className="text-sm font-semibold text-slate-900">
                Rumus Metode SAW
              </h2>
            </div>
            <div className="p-5">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-100">
                  <div className="text-xs font-semibold text-emerald-700 mb-2">
                    Normalisasi Benefit
                  </div>
                  <code className="text-sm font-mono text-emerald-800 font-bold block mb-2">
                    r&#7522;&#11785; = x&#7522;&#11785; / max(x&#7522;&#11785;)
                  </code>
                  <p className="text-emerald-700 text-xs">
                    Kriteria yang semakin besar nilainya semakin baik (fasilitas, keamanan, kebersihan)
                  </p>
                </div>
                <div className="bg-amber-50 rounded-lg p-4 border border-amber-100">
                  <div className="text-xs font-semibold text-amber-700 mb-2">
                    Normalisasi Cost
                  </div>
                  <code className="text-sm font-mono text-amber-800 font-bold block mb-2">
                    r&#7522;&#11785; = min(x&#7522;&#11785;) / x&#7522;&#11785;
                  </code>
                  <p className="text-amber-700 text-xs">
                    Kriteria yang semakin kecil nilainya semakin baik (harga, jarak)
                  </p>
                </div>
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                  <div className="text-xs font-semibold text-blue-700 mb-2">
                    Skor Preferensi
                  </div>
                  <code className="text-sm font-mono text-blue-800 font-bold block mb-2">
                    V&#7522; = &Sigma;(w&#11785; &times; r&#7522;&#11785;)
                  </code>
                  <p className="text-blue-700 text-xs">
                    Jumlah perkalian bobot dengan nilai normalisasi setiap kriteria
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
