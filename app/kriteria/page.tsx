"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  Settings,
  Plus,
  Pencil,
  Trash2,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import PageHeader from "@/components/PageHeader";
import Modal from "@/components/Modal";
import LoadingSpinner from "@/components/LoadingSpinner";
import AlertMessage from "@/components/AlertMessage";

interface Criteria {
  id: number;
  nama: string;
  bobot: number;
  tipe: string;
  kode: string;
}

const defaultForm = {
  kode: "",
  nama: "",
  bobot: "",
  tipe: "benefit",
};

export default function KriteriaPage() {
  const [criteria, setCriteria] = useState<Criteria[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState<Criteria | null>(null);
  const [form, setForm] = useState(defaultForm);
  const [saving, setSaving] = useState(false);

  const fetchCriteria = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/criteria");
      setCriteria(res.data.data);
    } catch {
      setError("Gagal memuat data kriteria");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCriteria();
  }, []);

  const totalBobot = criteria.reduce((sum, c) => sum + c.bobot, 0);
  const isValidBobot = Math.abs(totalBobot - 1) <= 0.01;

  const openAdd = () => {
    setEditData(null);
    setForm(defaultForm);
    setModalOpen(true);
  };

  const openEdit = (c: Criteria) => {
    setEditData(c);
    setForm({
      kode: c.kode,
      nama: c.nama,
      bobot: String(c.bobot),
      tipe: c.tipe,
    });
    setModalOpen(true);
  };

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const bobotVal = parseFloat(form.bobot);
    if (isNaN(bobotVal) || bobotVal <= 0 || bobotVal > 1) {
      setError("Bobot harus antara 0 dan 1 (contoh: 0.30)");
      return;
    }
    setSaving(true);
    try {
      if (editData) {
        await axios.put(`/api/criteria/${editData.id}`, form);
        setSuccess("Kriteria berhasil diperbarui");
      } else {
        await axios.post("/api/criteria", form);
        setSuccess("Kriteria berhasil ditambahkan");
      }
      setModalOpen(false);
      fetchCriteria();
    } catch {
      setError("Gagal menyimpan kriteria");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number, nama: string) => {
    if (!confirm(`Hapus kriteria "${nama}"?`)) return;
    try {
      await axios.delete(`/api/criteria/${id}`);
      setSuccess(`Kriteria "${nama}" berhasil dihapus`);
      fetchCriteria();
    } catch {
      setError("Gagal menghapus kriteria");
    }
  };

  const getBobotPercent = (bobot: number) => `${(bobot * 100).toFixed(0)}%`;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <PageHeader
        title="Kriteria Penilaian"
        description="Kelola kriteria dan bobot untuk perhitungan SAW kos-kosan"
        icon={Settings}
        action={
          <button
            onClick={openAdd}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-600 text-white text-sm font-semibold hover:bg-primary-700 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Tambah Kriteria
          </button>
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

      {/* Bobot Validation Banner */}
      {!loading && criteria.length > 0 && (
        <div
          className={`mb-5 flex items-start gap-3 p-4 rounded-lg border ${
            isValidBobot
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : "bg-amber-50 border-amber-200 text-amber-800"
          }`}
        >
          {isValidBobot ? (
            <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
          )}
          <div>
            <p className="text-sm font-semibold">
              Total Bobot: {(totalBobot * 100).toFixed(0)}%{" "}
              {isValidBobot ? "— Valid ✓" : "— Harus berjumlah 100%"}
            </p>
            <p className="text-xs mt-0.5 opacity-80">
              {isValidBobot
                ? "Bobot kriteria sudah valid. Anda dapat menjalankan perhitungan SAW."
                : "Sesuaikan bobot kriteria agar totalnya = 100% sebelum menghitung SAW."}
            </p>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <LoadingSpinner text="Memuat kriteria..." />
        ) : criteria.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
            <div className="w-14 h-14 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center">
              <Settings className="w-7 h-7 text-slate-400" />
            </div>
            <div>
              <h3 className="text-slate-700 font-semibold text-base">Belum Ada Kriteria</h3>
              <p className="text-slate-500 text-sm mt-1">Tambahkan kriteria penilaian untuk kos-kosan.</p>
            </div>
            <button
              onClick={openAdd}
              className="mt-2 flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-600 text-white text-sm font-semibold hover:bg-primary-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Tambah Kriteria Pertama
            </button>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full table-pro">
                <thead>
                  <tr>
                    <th className="w-10">No</th>
                    <th className="w-20">Kode</th>
                    <th>Nama Kriteria</th>
                    <th className="w-28">Tipe</th>
                    <th className="w-24">Bobot</th>
                    <th>Progress</th>
                    <th className="w-28 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {criteria.map((c, idx) => (
                    <tr key={c.id}>
                      <td className="text-slate-400 text-center font-medium">
                        {idx + 1}
                      </td>
                      <td>
                        <span className="inline-flex items-center px-2.5 py-1 rounded bg-primary-50 text-primary-700 font-bold text-xs border border-primary-100">
                          {c.kode}
                        </span>
                      </td>
                      <td>
                        <div className="font-semibold text-slate-900">{c.nama}</div>
                        <div className="text-xs text-slate-500 mt-0.5">
                          {c.tipe === "benefit"
                            ? "Semakin besar semakin baik"
                            : "Semakin kecil semakin baik"}
                        </div>
                      </td>
                      <td>
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border capitalize ${
                            c.tipe === "benefit"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : "bg-red-50 text-red-700 border-red-200"
                          }`}
                        >
                          {c.tipe}
                        </span>
                      </td>
                      <td>
                        <span className="font-bold text-primary-600 text-sm">
                          {getBobotPercent(c.bobot)}
                        </span>
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-slate-100 rounded-full h-2 min-w-[60px]">
                            <div
                              className="h-2 rounded-full bg-primary-500 transition-all"
                              style={{ width: `${c.bobot * 100}%` }}
                            />
                          </div>
                          <span className="text-xs text-slate-400 w-8 text-right">
                            {(c.bobot * 100).toFixed(0)}%
                          </span>
                        </div>
                      </td>
                      <td>
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => openEdit(c)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-600 text-xs font-medium hover:border-primary-300 hover:text-primary-700 hover:bg-primary-50 transition-colors"
                          >
                            <Pencil className="w-3 h-3" />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(c.id, c.nama)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-600 text-xs font-medium hover:border-red-300 hover:text-red-700 hover:bg-red-50 transition-colors"
                          >
                            <Trash2 className="w-3 h-3" />
                            Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={4} className="text-slate-600 font-semibold text-xs">
                      Total Bobot Semua Kriteria
                    </td>
                    <td colSpan={3}>
                      <span
                        className={`font-bold text-base ${
                          isValidBobot ? "text-emerald-600" : "text-amber-600"
                        }`}
                      >
                        {(totalBobot * 100).toFixed(0)}%
                        {isValidBobot ? " ✓" : " ✗"}
                      </span>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </>
        )}
      </div>

      {/* Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editData ? "Edit Kriteria" : "Tambah Kriteria"}
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Kode Kriteria <span className="text-red-500">*</span>
              </label>
              <input
                name="kode"
                value={form.kode}
                onChange={handleFormChange}
                required
                placeholder="C1"
                disabled={!!editData}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors bg-white disabled:bg-slate-50 disabled:text-slate-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Bobot (0.01 - 1.00) <span className="text-red-500">*</span>
              </label>
              <input
                name="bobot"
                type="number"
                step="0.01"
                min="0.01"
                max="1"
                value={form.bobot}
                onChange={handleFormChange}
                required
                placeholder="0.30"
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Nama Kriteria <span className="text-red-500">*</span>
            </label>
            <input
              name="nama"
              value={form.nama}
              onChange={handleFormChange}
              required
              placeholder="Harga Sewa (Rp/Bulan)"
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors bg-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Tipe Kriteria <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              {["benefit", "cost"].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setForm((prev) => ({ ...prev, tipe: t }))}
                  className={`py-3 rounded-lg border text-sm font-medium transition-all ${
                    form.tipe === t
                      ? t === "benefit"
                        ? "bg-emerald-50 border-emerald-400 text-emerald-800"
                        : "bg-red-50 border-red-400 text-red-800"
                      : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                  }`}
                >
                  <div className="font-semibold capitalize">{t}</div>
                  <div className="text-xs opacity-70 mt-0.5">
                    {t === "benefit"
                      ? "Semakin besar semakin baik"
                      : "Semakin kecil semakin baik"}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="flex-1 py-2.5 rounded-lg border border-slate-200 text-slate-700 text-sm font-medium hover:bg-slate-50 transition-colors bg-white"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-2.5 rounded-lg bg-primary-600 text-white text-sm font-semibold hover:bg-primary-700 transition-colors disabled:opacity-50"
            >
              {saving ? "Menyimpan..." : editData ? "Perbarui" : "Tambahkan"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
