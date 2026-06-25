export interface AlternativeData {
  id: number;
  namaKos: string;
  lokasi: string;
  harga: number;
  jarak: number;
  fasilitas: number;
  keamanan: number;
  kebersihan: number;
}

export interface CriteriaData {
  id: number;
  nama: string;
  bobot: number;
  tipe: string;
  kode: string;
}

export interface NormalizedRow {
  id: number;
  namaKos: string;
  values: Record<string, number>;
}

export interface RankingRow {
  id: number;
  namaKos: string;
  lokasi: string;
  skor: number;
  rank: number;
}

export interface SAWResult {
  decisionMatrix: Record<string, number | string>[];
  normalizedMatrix: NormalizedRow[];
  rankings: RankingRow[];
  terbaik: RankingRow;
}

export function calculateSAW(
  alternatives: AlternativeData[],
  criteria: CriteriaData[]
): SAWResult {
  const criteriaKeys: Record<string, keyof AlternativeData> = {
    C1: "harga",
    C2: "jarak",
    C3: "fasilitas",
    C4: "keamanan",
    C5: "kebersihan",
  };

  // Build decision matrix
  const decisionMatrix = alternatives.map((alt) => {
    const row: Record<string, number | string> = { namaKos: alt.namaKos };
    criteria.forEach((c) => {
      const key = criteriaKeys[c.kode];
      if (key) row[c.kode] = alt[key] as number;
    });
    return row;
  });

  // Find max/min for each criteria
  const maxMin: Record<string, { max: number; min: number }> = {};
  criteria.forEach((c) => {
    const values = alternatives.map(
      (alt) => alt[criteriaKeys[c.kode]] as number
    );
    maxMin[c.kode] = {
      max: Math.max(...values),
      min: Math.min(...values),
    };
  });

  // Normalization
  const normalizedMatrix: NormalizedRow[] = alternatives.map((alt) => {
    const values: Record<string, number> = {};
    criteria.forEach((c) => {
      const key = criteriaKeys[c.kode];
      const xij = alt[key] as number;
      if (c.tipe === "benefit") {
        values[c.kode] = xij / maxMin[c.kode].max;
      } else {
        values[c.kode] = maxMin[c.kode].min / xij;
      }
    });
    return { id: alt.id, namaKos: alt.namaKos, values };
  });

  // Calculate preference score
  const rankings: RankingRow[] = normalizedMatrix
    .map((row, idx) => {
      let skor = 0;
      criteria.forEach((c) => {
        skor += c.bobot * row.values[c.kode];
      });
      return {
        id: row.id,
        namaKos: row.namaKos,
        lokasi: alternatives[idx].lokasi,
        skor: parseFloat(skor.toFixed(4)),
        rank: 0,
      };
    })
    .sort((a, b) => b.skor - a.skor)
    .map((item, idx) => ({ ...item, rank: idx + 1 }));

  return {
    decisionMatrix,
    normalizedMatrix,
    rankings,
    terbaik: rankings[0],
  };
}
