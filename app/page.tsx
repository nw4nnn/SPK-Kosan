import Link from "next/link";
import {
  Building2,
  Calculator,
  Settings,
  History,
  ArrowRight,
  CheckCircle,
  BarChart3,
  ChevronRight,
  Database,
  Target,
  Award,
  BookOpen,
} from "lucide-react";

const menuItems = [
  {
    icon: Building2,
    title: "Data Kos",
    description: "Kelola data alternatif kos-kosan dengan informasi lengkap.",
    href: "/alternatif",
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-100",
  },
  {
    icon: Settings,
    title: "Kriteria & Bobot",
    description: "Atur kriteria penilaian dan bobot kepentingan masing-masing.",
    href: "/kriteria",
    color: "text-indigo-600",
    bg: "bg-indigo-50",
    border: "border-indigo-100",
  },
  {
    icon: Calculator,
    title: "Perhitungan SAW",
    description: "Hitung normalisasi dan skor preferensi secara otomatis.",
    href: "/perhitungan",
    color: "text-cyan-600",
    bg: "bg-cyan-50",
    border: "border-cyan-100",
  },
  {
    icon: History,
    title: "Riwayat",
    description: "Lihat semua hasil perhitungan yang telah tersimpan.",
    href: "/riwayat",
    color: "text-violet-600",
    bg: "bg-violet-50",
    border: "border-violet-100",
  },
];

const staticStats = [
  {
    label: "Total Alternatif",
    value: "Kos-kosan",
    icon: Building2,
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    label: "Total Kriteria",
    value: "5 Kriteria",
    icon: Target,
    color: "text-indigo-600",
    bg: "bg-indigo-50",
  },
  {
    label: "Metode",
    value: "SAW",
    icon: Calculator,
    color: "text-cyan-600",
    bg: "bg-cyan-50",
  },
  {
    label: "Status Sistem",
    value: "Aktif",
    icon: CheckCircle,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
];

const kriteria = [
  { kode: "C1", nama: "Harga Sewa", tipe: "Cost", bobot: "30%", desc: "Biaya sewa per bulan (Rp)" },
  { kode: "C2", nama: "Jarak ke Kampus", tipe: "Cost", bobot: "25%", desc: "Jarak dalam kilometer" },
  { kode: "C3", nama: "Fasilitas", tipe: "Benefit", bobot: "20%", desc: "Kelengkapan fasilitas (1-5)" },
  { kode: "C4", nama: "Keamanan", tipe: "Benefit", bobot: "15%", desc: "Tingkat keamanan lingkungan (1-5)" },
  { kode: "C5", nama: "Kebersihan", tipe: "Benefit", bobot: "10%", desc: "Kebersihan kos dan lingkungan (1-5)" },
];

export default function HomePage() {
  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Page Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-medium text-primary-600 uppercase tracking-wide mb-2">
                <BookOpen className="w-3.5 h-3.5" />
                Sistem Informasi Akademik
              </div>
              <h1 className="text-2xl font-bold text-slate-900 leading-tight">
                Sistem Pendukung Keputusan
                <br />
                <span className="text-primary-600">Pemilihan Kos-Kosan</span>
              </h1>
              <p className="text-slate-500 text-sm mt-2">
                Metode Simple Additive Weighting (SAW) — Tugas Akhir / Skripsi
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/perhitungan"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-primary-600 text-white text-sm font-semibold hover:bg-primary-700 transition-colors shadow-sm"
              >
                <Calculator className="w-4 h-4" />
                Mulai Perhitungan
              </Link>
              <Link
                href="/alternatif"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-white border border-slate-200 text-slate-700 text-sm font-semibold hover:bg-slate-50 transition-colors shadow-sm"
              >
                <Building2 className="w-4 h-4" />
                Kelola Data Kos
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {staticStats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="bg-white rounded-lg border border-slate-200 shadow-sm p-4 flex items-center gap-3"
              >
                <div className={`w-9 h-9 rounded-lg ${stat.bg} flex items-center justify-center flex-shrink-0`}>
                  <Icon className={`w-4 h-4 ${stat.color}`} />
                </div>
                <div className="min-w-0">
                  <div className="text-xs text-slate-500 font-medium leading-tight">
                    {stat.label}
                  </div>
                  <div className={`text-sm font-bold ${stat.color} leading-tight mt-0.5`}>
                    {stat.value}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Menu Navigasi */}
        <div>
          <h2 className="text-base font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-primary-600" />
            Menu Sistem
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`bg-white rounded-lg border ${item.border} shadow-sm p-5 hover:shadow-md transition-all duration-150 group`}
                >
                  <div className={`w-10 h-10 rounded-lg ${item.bg} flex items-center justify-center mb-3`}>
                    <Icon className={`w-5 h-5 ${item.color}`} />
                  </div>
                  <h3 className="text-slate-900 font-semibold text-sm mb-1">
                    {item.title}
                  </h3>
                  <p className="text-slate-500 text-xs leading-relaxed">
                    {item.description}
                  </p>
                  <div className={`flex items-center gap-1 mt-3 text-xs font-semibold ${item.color}`}>
                    Buka <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Kriteria Penilaian */}
          <div className="lg:col-span-2 bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-200 flex items-center gap-2">
              <Database className="w-4 h-4 text-primary-600" />
              <h2 className="text-sm font-semibold text-slate-900">
                Kriteria Penilaian
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full table-pro">
                <thead>
                  <tr>
                    <th>Kode</th>
                    <th>Nama Kriteria</th>
                    <th>Tipe</th>
                    <th>Bobot</th>
                    <th>Keterangan</th>
                  </tr>
                </thead>
                <tbody>
                  {kriteria.map((k) => (
                    <tr key={k.kode}>
                      <td>
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-primary-50 text-primary-700 border border-primary-100">
                          {k.kode}
                        </span>
                      </td>
                      <td className="font-medium text-slate-800">{k.nama}</td>
                      <td>
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold border ${
                            k.tipe === "Benefit"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : "bg-red-50 text-red-700 border-red-200"
                          }`}
                        >
                          {k.tipe}
                        </span>
                      </td>
                      <td className="font-semibold text-primary-600">
                        {k.bobot}
                      </td>
                      <td className="text-slate-500">{k.desc}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={3} className="text-slate-600 font-semibold text-xs">
                      Total Bobot
                    </td>
                    <td className="font-bold text-primary-600">100%</td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Metode SAW */}
          <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-200 flex items-center gap-2">
              <Award className="w-4 h-4 text-primary-600" />
              <h2 className="text-sm font-semibold text-slate-900">
                Metode SAW
              </h2>
            </div>
            <div className="p-5 space-y-4">
              <p className="text-slate-600 text-xs leading-relaxed">
                <strong className="text-slate-800">Simple Additive Weighting (SAW)</strong>{" "}
                adalah metode MADM yang menghitung skor preferensi melalui penjumlahan bobot nilai yang dinormalisasi.
              </p>

              <div className="space-y-3">
                <div className="bg-emerald-50 rounded-lg p-3 border border-emerald-100">
                  <p className="text-xs font-semibold text-emerald-700 mb-1">
                    Normalisasi Benefit:
                  </p>
                  <code className="text-sm font-mono text-emerald-800 font-bold">
                    r&#7522;&#11785; = x&#7522;&#11785; / max(x&#7522;&#11785;)
                  </code>
                </div>
                <div className="bg-amber-50 rounded-lg p-3 border border-amber-100">
                  <p className="text-xs font-semibold text-amber-700 mb-1">
                    Normalisasi Cost:
                  </p>
                  <code className="text-sm font-mono text-amber-800 font-bold">
                    r&#7522;&#11785; = min(x&#7522;&#11785;) / x&#7522;&#11785;
                  </code>
                </div>
                <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
                  <p className="text-xs font-semibold text-blue-700 mb-1">
                    Skor Preferensi:
                  </p>
                  <code className="text-sm font-mono text-blue-800 font-bold">
                    V&#7522; = &Sigma;(w&#11785; &times; r&#7522;&#11785;)
                  </code>
                </div>
              </div>

              <div className="space-y-2 pt-1">
                {[
                  "Susun matriks keputusan",
                  "Normalisasi nilai kriteria",
                  "Pembobotan sesuai kepentingan",
                  "Ranking skor tertinggi",
                ].map((step, i) => (
                  <div key={step} className="flex items-center gap-2 text-xs text-slate-600">
                    <div className="w-5 h-5 rounded-full bg-primary-100 text-primary-700 font-bold flex items-center justify-center text-xs flex-shrink-0">
                      {i + 1}
                    </div>
                    {step}
                  </div>
                ))}
              </div>

              <Link
                href="/perhitungan"
                className="mt-2 flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-lg bg-primary-600 text-white text-sm font-semibold hover:bg-primary-700 transition-colors"
              >
                <Calculator className="w-4 h-4" />
                Hitung Sekarang
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
            <p className="text-slate-500 text-xs">
              &copy; 2024 SPK Pemilihan Kos-Kosan — Metode Simple Additive Weighting (SAW)
            </p>
            <p className="text-slate-400 text-xs">
              Sistem Pendukung Keputusan &middot; Tugas Akhir
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
