"use client";
import { useState } from "react";
import axios from "axios";
import Link from "next/link";
import {
  Calculator,
  RefreshCw,
  Save,
  ChevronUp,
  ChevronDown,
  Trophy,
  Building2,
  Star,
  CheckCircle,
  ArrowRight,
} from "lucide-react";
import PageHeader from "@/components/PageHeader";
import LoadingSpinner from "@/components/LoadingSpinner";
import AlertMessage from "@/components/AlertMessage";

interface CriteriaData {
  kode: string;
  nama: string;
  bobot: number;
  tipe: string;
}

interface NormalizedRow {
  id: number;
  namaKos: string;
  values: Record<string, number>;
}

interface RankingRow {
  id: number;
  namaKos: string;
  lokasi: string;
  skor: number;
  rank: number;
}

interface SAWResult {
  criteria: CriteriaData[];
  decisionMatrix: Record<string, string | number>[];
  normalizedMatrix: NormalizedRow[];
  rankings: RankingRow[];
  terbaik: { namaKos: string; lokasi: string; skor: number };
}

export default function PerhitunganPage() {
  const [result, setResult] = useState<SAWResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showMatrix, setShowMatrix] = useState(true);
  const [showNormal, setShowNormal] = useState(true);

  const handleCalculate = async () => {
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await axios.get("/api/calculation");
      setResult(res.data.data);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Gagal menghitung SAW");
      } else {
        setError("Gagal menghitung SAW");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      await axios.post("/api/calculation");
      setSuccess("Hasil perhitungan berhasil disimpan ke riwayat!");
    } catch {
      setError("Gagal menyimpan hasil perhitungan");
    } finally {
      setSaving(false);
    }
  };

  const getRankMedal = (rank: number) => {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return `#${rank}`;
  };

  const getRankBg = (rank: number) => {
    if (rank === 1) return "bg-amber-50 border-amber-300 text-amber-700";
    if (rank === 2) return "bg-slate-100 border-slate-300 text-slate-600";
    if (rank === 3) return "bg-orange-50 border-orange-300 text-orange-600";
    return "bg-slate-50 border-slate-200 text-slate-500";
  };

  const formatHarga = (v: number | string, kode: string) => {
    if (kode === "C1" && typeof v === "number") {
      return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
      }).format(v);
    }
    if (kode === "C2" && typeof v === "number") return `${v} km`;
    return String(v);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <PageHeader
        title="Perhitungan SAW"
        description="Simple Additive Weighting untuk pemilihan kos-kosan terbaik"
        icon={Calculator}
        action={
          <div className="flex gap-2">
            <button
              onClick={handleCalculate}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-600 text-white text-sm font-semibold hover:bg-primary-700 transition-colors shadow-sm disabled:opacity-60"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              {loading ? "Menghitung..." : "Hitung SAW"}
            </button>
            {result && (
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-slate-200 text-slate-700 text-sm font-semibold hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-700 transition-all shadow-sm disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {saving ? "Menyimpan..." : "Simpan Hasil"}
              </button>
            )}
          </div>
        }
      />

      {error && (
        <div className="mb-5">
          <AlertMessage type="error" message={error} onClose={() => setError("")} />
        </div>
      )}
      {success && (
        <div className="mb-5">
          <AlertMessage type="success" message={success} onClose={() => setSuccess("")} />
        </div>
      )}

      {/* Empty State */}
      {!result && !loading && (
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-10 text-center">
          <div className="w-16 h-16 rounded-xl bg-primary-50 flex items-center justify-center mx-auto mb-5">
            <Calculator className="w-8 h-8 text-primary-600" />
          </div>
          <h3 className="text-slate-900 font-bold text-lg mb-2">
            Siap Menghitung
          </h3>
          <p className="text-slate-500 text-sm max-w-md mx-auto mb-6 leading-relaxed">
            Klik tombol{" "}
            <strong className="text-primary-600">Hitung SAW</strong> untuk
            menjalankan perhitungan Simple Additive Weighting berdasarkan data
            kos dan kriteria yang sudah diinputkan.
          </p>

          <div className="flex flex-wrap gap-3 justify-center text-sm text-slate-500 mb-6">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 rounded-lg border border-slate-200">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
              Pastikan data kos sudah diinput
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 rounded-lg border border-slate-200">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
              Total bobot kriteria harus = 100%
            </div>
          </div>

          <div className="flex gap-2 justify-center mb-6">
            <Link
              href="/alternatif"
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition-colors"
            >
              <Building2 className="w-4 h-4" />
              Data Kos
            </Link>
            <Link
              href="/kriteria"
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition-colors"
            >
              <Star className="w-4 h-4" />
              Kriteria
            </Link>
          </div>

          <button
            onClick={handleCalculate}
            disabled={loading}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-primary-600 text-white text-sm font-semibold hover:bg-primary-700 transition-colors shadow-sm"
          >
            <Calculator className="w-4 h-4" />
            Mulai Perhitungan
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {loading && <LoadingSpinner text="Menghitung SAW..." />}

      {result && (
        <div className="space-y-5 animate-fade-in">
          {/* WINNER CARD */}
          <div className="bg-amber-50 rounded-lg border border-amber-200 shadow-sm p-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex-shrink-0">
                <div className="w-14 h-14 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center">
                  <Trophy className="w-7 h-7 text-amber-600" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-amber-600 uppercase tracking-wide mb-1">
                  Rekomendasi Terbaik — Metode SAW
                </p>
                <h2 className="text-xl font-bold text-slate-900 truncate">
                  {result.terbaik.namaKos}
                </h2>
                <p className="text-slate-500 text-sm">{result.terbaik.lokasi}</p>
              </div>
              <div className="flex gap-4 flex-shrink-0">
                <div className="text-center px-4 py-2 bg-white rounded-lg border border-amber-200">
                  <div className="text-2xl font-black text-primary-600 font-mono">
                    {result.terbaik.skor.toFixed(4)}
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">Skor SAW</div>
                </div>
                <div className="text-center px-4 py-2 bg-white rounded-lg border border-amber-200">
                  <div className="text-2xl font-black text-amber-600">#1</div>
                  <div className="text-xs text-slate-500 mt-0.5">Ranking</div>
                </div>
                <div className="text-center px-4 py-2 bg-white rounded-lg border border-amber-200">
                  <div className="text-2xl font-black text-blue-600">
                    {result.rankings.length}
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">Total Kos</div>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 1: Matriks Keputusan */}
          <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
            <button
              className="w-full px-5 py-4 border-b border-slate-200 flex items-center justify-between hover:bg-slate-50 transition-colors text-left"
              onClick={() => setShowMatrix(!showMatrix)}
            >
              <div className="flex items-center gap-3">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary-100 text-primary-700 text-xs font-bold">
                  1
                </span>
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">
                    Matriks Keputusan
                  </h3>
                  <p className="text-xs text-slate-500">
                    Nilai asli setiap alternatif kos
                  </p>
                </div>
              </div>
              {showMatrix ? (
                <ChevronUp className="w-4 h-4 text-slate-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-slate-400" />
              )}
            </button>
            {showMatrix && (
              <div className="overflow-x-auto">
                <table className="w-full table-pro">
                  <thead>
                    <tr>
                      <th>Nama Kos</th>
                      {result.criteria.map((c) => (
                        <th key={c.kode}>
                          <div className="font-bold">{c.kode}</div>
                          <div className="text-xs font-normal text-slate-400 normal-case">
                            {c.nama}
                          </div>
                          <div className="mt-0.5">
                            <span
                              className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium normal-case ${
                                c.tipe === "benefit"
                                  ? "bg-emerald-50 text-emerald-700"
                                  : "bg-red-50 text-red-700"
                              }`}
                            >
                              {c.tipe}
                            </span>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {result.decisionMatrix.map((row, idx) => (
                      <tr key={idx}>
                        <td className="font-semibold text-slate-900">
                          {row.namaKos as string}
                        </td>
                        {result.criteria.map((c) => (
                          <td key={c.kode} className="font-mono text-slate-700">
                            {formatHarga(row[c.kode], c.kode)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* SECTION 2: Normalisasi */}
          <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
            <button
              className="w-full px-5 py-4 border-b border-slate-200 flex items-center justify-between hover:bg-slate-50 transition-colors text-left"
              onClick={() => setShowNormal(!showNormal)}
            >
              <div className="flex items-center gap-3">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary-100 text-primary-700 text-xs font-bold">
                  2
                </span>
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">
                    Matriks Normalisasi (R)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Nilai setelah dinormalisasi menggunakan rumus SAW
                  </p>
                </div>
              </div>
              {showNormal ? (
                <ChevronUp className="w-4 h-4 text-slate-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-slate-400" />
              )}
            </button>
            {showNormal && (
              <div className="overflow-x-auto">
                <table className="w-full table-pro">
                  <thead>
                    <tr>
                      <th>Nama Kos</th>
                      {result.criteria.map((c) => (
                        <th key={c.kode}>
                          <div>r({c.kode})</div>
                          <div className="text-xs font-normal text-slate-400 normal-case">
                            w = {c.bobot}
                          </div>
                        </th>
                      ))}
                      <th>Skor (Vi)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.normalizedMatrix.map((row) => {
                      const ranking = result.rankings.find(
                        (r) => r.id === row.id
                      );
                      return (
                        <tr
                          key={row.id}
                          className={ranking?.rank === 1 ? "bg-amber-50" : ""}
                        >
                          <td className="font-semibold text-slate-900">
                            {row.namaKos}
                            {ranking?.rank === 1 && (
                              <span className="ml-2 text-xs text-amber-600 font-medium">
                                🥇 Terbaik
                              </span>
                            )}
                          </td>
                          {result.criteria.map((c) => (
                            <td
                              key={c.kode}
                              className="font-mono text-emerald-700 font-medium"
                            >
                              {row.values[c.kode]?.toFixed(4) ?? "-"}
                            </td>
                          ))}
                          <td className="font-mono font-bold text-primary-600">
                            {ranking?.skor.toFixed(4)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td className="text-slate-500 text-xs font-semibold">
                        Bobot (wj)
                      </td>
                      {result.criteria.map((c) => (
                        <td
                          key={c.kode}
                          className="font-mono font-bold text-primary-600 text-sm"
                        >
                          {c.bobot}
                        </td>
                      ))}
                      <td className="font-mono font-bold text-primary-600">
                        {result.criteria
                          .reduce((s, c) => s + c.bobot, 0)
                          .toFixed(2)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}
          </div>

          {/* SECTION 3: Ranking */}
          <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-200 flex items-center gap-3">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary-100 text-primary-700 text-xs font-bold">
                3
              </span>
              <div>
                <h3 className="text-sm font-semibold text-slate-900">
                  Hasil Ranking Akhir
                </h3>
                <p className="text-xs text-slate-500">
                  Diurutkan dari skor SAW tertinggi ke terendah
                </p>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full table-pro">
                <thead>
                  <tr>
                    <th className="w-20 text-center">Rank</th>
                    <th>Nama Kos</th>
                    <th>Lokasi</th>
                    <th>Skor SAW</th>
                    <th>Persentase</th>
                  </tr>
                </thead>
                <tbody>
                  {result.rankings.map((row) => (
                    <tr
                      key={row.id}
                      className={row.rank === 1 ? "bg-amber-50" : ""}
                    >
                      <td className="text-center">
                        <span
                          className={`inline-flex items-center justify-center w-9 h-9 rounded-lg border text-sm font-bold ${getRankBg(row.rank)}`}
                        >
                          {getRankMedal(row.rank)}
                        </span>
                      </td>
                      <td>
                        <div className="font-semibold text-slate-900">
                          {row.namaKos}
                        </div>
                        {row.rank === 1 && (
                          <span className="text-xs text-amber-600 font-medium">
                            Rekomendasi Terbaik
                          </span>
                        )}
                      </td>
                      <td className="text-slate-500 text-sm">{row.lokasi}</td>
                      <td>
                        <span className="font-mono font-bold text-primary-600 text-sm">
                          {row.skor.toFixed(4)}
                        </span>
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-slate-100 rounded-full h-2 min-w-[60px]">
                            <div
                              className="h-2 rounded-full bg-primary-500 transition-all"
                              style={{
                                width: `${(row.skor / result.rankings[0].skor) * 100}%`,
                              }}
                            />
                          </div>
                          <span className="text-slate-500 text-xs font-medium w-10 text-right">
                            {((row.skor / result.rankings[0].skor) * 100).toFixed(1)}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Save Section */}
          <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">
                Simpan Hasil Perhitungan
              </h3>
              <p className="text-slate-500 text-xs mt-1">
                Simpan hasil ini ke riwayat untuk referensi di kemudian hari.
              </p>
            </div>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition-colors shadow-sm disabled:opacity-50 flex-shrink-0"
            >
              <Save className="w-4 h-4" />
              {saving ? "Menyimpan..." : "Simpan ke Riwayat"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
