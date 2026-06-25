export interface Alternative {
  id: number;
  namaKos: string;
  lokasi: string;
  harga: number;
  jarak: number;
  fasilitas: number;
  keamanan: number;
  kebersihan: number;
  createdAt: string;
  updatedAt: string;
}

export interface Criteria {
  id: number;
  nama: string;
  bobot: number;
  tipe: string;
  kode: string;
}

export interface History {
  id: number;
  hasilTerbaik: string;
  skor: number;
  jumlahAlternatif: number;
  createdAt: string;
}

export interface SAWResult {
  decisionMatrix: Record<string, number | string>[];
  normalizedMatrix: {
    id: number;
    namaKos: string;
    values: Record<string, number>;
  }[];
  rankings: {
    id: number;
    namaKos: string;
    lokasi: string;
    skor: number;
    rank: number;
  }[];
  terbaik: {
    id: number;
    namaKos: string;
    lokasi: string;
    skor: number;
    rank: number;
  };
}

export interface DashboardStats {
  totalAlternatif: number;
  totalKriteria: number;
  totalHistory: number;
  hasilTerbaikTerakhir: string | null;
  skorTerakhir: number | null;
}
