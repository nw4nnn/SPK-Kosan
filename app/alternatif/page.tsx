"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  Building2,
  Plus,
  Pencil,
  Trash2,
  Search,
  MapPin,
  DollarSign,
} from "lucide-react";
import PageHeader from "@/components/PageHeader";
import Modal from "@/components/Modal";
import LoadingSpinner from "@/components/LoadingSpinner";
import EmptyState from "@/components/EmptyState";
import AlertMessage from "@/components/AlertMessage";

interface Alternative {
  id: number;
  namaKos: string;
  lokasi: string;
  harga: number;
  jarak: number;
  fasilitas: number;
  keamanan: number;
  kebersihan: number;
  createdAt: string;
}

const defaultForm = {
  namaKos: "",
  lokasi: "",
  harga: "",
  jarak: "",
  fasilitas: "3",
  keamanan: "3",
  kebersihan: "3",
};

const ratingLabels = ["", "Sangat Buruk", "Buruk", "Cukup", "Baik", "Sangat Baik"];

function RatingInput({
  label,
  name,
  value,
  onChange,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (name: string, val: string) => void;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1.5">
        {label}
      </label>
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((v) => (
          <button
            key={v}
            type="button"
            onClick={() => onChange(name, String(v))}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold border transition-all ${
              String(v) === value
                ? "bg-primary-600 border-primary-600 text-white"
                : "bg-white border-slate-200 text-slate-600 hover:border-primary-400 hover:text-primary-600"
            }`}
          >
            {v}
          </button>
        ))}
      </div>
      <p className="text-xs text-slate-500 mt-1">
        {ratingLabels[parseInt(value)]}
      </p>
    </div>
  );
}

const getRatingBadge = (v: number) => {
  if (v >= 5) return "bg-emerald-50 text-emerald-700 border-emerald-200";
  if (v >= 4) return "bg-blue-50 text-blue-700 border-blue-200";
  if (v >= 3) return "bg-amber-50 text-amber-700 border-amber-200";
  return "bg-red-50 text-red-700 border-red-200";
};

export default function AlternatifPage() {
  const [alternatives, setAlternatives] = useState<Alternative[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState<Alternative | null>(null);
  const [form, setForm] = useState(defaultForm);
  const [saving, setSaving] = useState(false);

  const fetchAlternatives = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/alternatives");
      setAlternatives(res.data.data);
    } catch {
      setError("Gagal memuat data kos-kosan");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlternatives();
  }, []);

  const openAdd = () => {
    setEditData(null);
    setForm(defaultForm);
    setModalOpen(true);
  };

  const openEdit = (alt: Alternative) => {
    setEditData(alt);
    setForm({
      namaKos: alt.namaKos,
      lokasi: alt.lokasi,
      harga: String(alt.harga),
      jarak: String(alt.jarak),
      fasilitas: String(alt.fasilitas),
      keamanan: String(alt.keamanan),
      kebersihan: String(alt.kebersihan),
    });
    setModalOpen(true);
  };

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleRatingChange = (name: string, val: string) => {
    setForm((prev) => ({ ...prev, [name]: val }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editData) {
        await axios.put(`/api/alternatives/${editData.id}`, form);
        setSuccess("Data kos berhasil diperbarui");
      } else {
        await axios.post("/api/alternatives", form);
        setSuccess("Data kos berhasil ditambahkan");
      }
      setModalOpen(false);
      fetchAlternatives();
    } catch {
      setError("Gagal menyimpan data kos");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number, nama: string) => {
    if (!confirm(`Hapus "${nama}"? Tindakan ini tidak bisa dibatalkan.`)) return;
    try {
      await axios.delete(`/api/alternatives/${id}`);
      setSuccess(`"${nama}" berhasil dihapus`);
      fetchAlternatives();
    } catch {
      setError("Gagal menghapus data kos");
    }
  };

  const filtered = alternatives.filter(
    (a) =>
      a.namaKos.toLowerCase().includes(search.toLowerCase()) ||
      a.lokasi.toLowerCase().includes(search.toLowerCase())
  );

  const formatHarga = (h: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(h);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <PageHeader
        title="Data Kos-Kosan"
        description="Kelola data alternatif kos-kosan untuk penilaian SAW"
        icon={Building2}
        action={
          <button
            onClick={openAdd}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-600 text-white text-sm font-semibold hover:bg-primary-700 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Tambah Kos
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

      {/* Table Card */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="px-5 py-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Cari nama kos atau lokasi..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 rounded-lg border border-slate-200 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors w-full sm:w-72 bg-white"
            />
          </div>
          <span className="text-sm text-slate-500">
            {filtered.length} dari {alternatives.length} kos
          </span>
        </div>

        {/* Table */}
        {loading ? (
          <LoadingSpinner text="Memuat data kos..." />
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={Building2}
            title="Belum Ada Data Kos"
            description="Tambahkan data kos-kosan untuk memulai perhitungan SAW."
            action={
              <button
                onClick={openAdd}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-600 text-white text-sm font-semibold hover:bg-primary-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Tambah Kos Pertama
              </button>
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full table-pro">
              <thead>
                <tr>
                  <th className="w-10">No</th>
                  <th>Nama Kos</th>
                  <th>Alamat</th>
                  <th>Harga/Bulan</th>
                  <th>Jarak</th>
                  <th className="text-center">Fasilitas</th>
                  <th className="text-center">Keamanan</th>
                  <th className="text-center">Kebersihan</th>
                  <th className="text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((alt, idx) => (
                  <tr key={alt.id}>
                    <td className="text-slate-400 text-center font-medium">
                      {idx + 1}
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-primary-50 flex items-center justify-center flex-shrink-0">
                          <Building2 className="w-3.5 h-3.5 text-primary-600" />
                        </div>
                        <span className="font-semibold text-slate-900">
                          {alt.namaKos}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-1 text-slate-500">
                        <MapPin className="w-3 h-3 flex-shrink-0" />
                        <span className="truncate max-w-[180px]">{alt.lokasi}</span>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-1 text-slate-700 font-medium">
                        <DollarSign className="w-3 h-3 text-slate-400" />
                        {formatHarga(alt.harga)}
                      </div>
                    </td>
                    <td>
                      <span className="text-slate-700 font-medium">
                        {alt.jarak} km
                      </span>
                    </td>
                    <td className="text-center">
                      <span
                        className={`inline-flex items-center justify-center w-8 h-8 rounded-lg border text-sm font-bold ${getRatingBadge(alt.fasilitas)}`}
                      >
                        {alt.fasilitas}
                      </span>
                    </td>
                    <td className="text-center">
                      <span
                        className={`inline-flex items-center justify-center w-8 h-8 rounded-lg border text-sm font-bold ${getRatingBadge(alt.keamanan)}`}
                      >
                        {alt.keamanan}
                      </span>
                    </td>
                    <td className="text-center">
                      <span
                        className={`inline-flex items-center justify-center w-8 h-8 rounded-lg border text-sm font-bold ${getRatingBadge(alt.kebersihan)}`}
                      >
                        {alt.kebersihan}
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => openEdit(alt)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-600 text-xs font-medium hover:border-primary-300 hover:text-primary-700 hover:bg-primary-50 transition-colors"
                        >
                          <Pencil className="w-3 h-3" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(alt.id, alt.namaKos)}
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
            </table>
          </div>
        )}
      </div>

      {/* Modal Form */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editData ? "Edit Data Kos" : "Tambah Data Kos"}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Nama Kos <span className="text-red-500">*</span>
              </label>
              <input
                name="namaKos"
                value={form.namaKos}
                onChange={handleFormChange}
                required
                placeholder="Kos Melati Indah"
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors bg-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Lokasi / Alamat <span className="text-red-500">*</span>
              </label>
              <input
                name="lokasi"
                value={form.lokasi}
                onChange={handleFormChange}
                required
                placeholder="Jl. Merdeka No. 10, Bandung"
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Harga Sewa/Bulan (Rp) <span className="text-red-500">*</span>
              </label>
              <input
                name="harga"
                type="number"
                value={form.harga}
                onChange={handleFormChange}
                required
                placeholder="750000"
                min="0"
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors bg-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Jarak ke Kampus (km) <span className="text-red-500">*</span>
              </label>
              <input
                name="jarak"
                type="number"
                step="0.1"
                value={form.jarak}
                onChange={handleFormChange}
                required
                placeholder="1.5"
                min="0"
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors bg-white"
              />
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-4">
            <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
              Penilaian (1 = Sangat Buruk, 5 = Sangat Baik)
            </p>
            <RatingInput
              label="Fasilitas"
              name="fasilitas"
              value={form.fasilitas}
              onChange={handleRatingChange}
            />
            <RatingInput
              label="Keamanan"
              name="keamanan"
              value={form.keamanan}
              onChange={handleRatingChange}
            />
            <RatingInput
              label="Kebersihan"
              name="kebersihan"
              value={form.kebersihan}
              onChange={handleRatingChange}
            />
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
              {saving ? "Menyimpan..." : editData ? "Perbarui Data" : "Tambahkan"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
