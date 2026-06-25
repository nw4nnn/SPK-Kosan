import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST() {
  try {
    // Reset data
    await prisma.history.deleteMany();
    await prisma.alternative.deleteMany();
    await prisma.criteria.deleteMany();

    // Seed criteria
    await prisma.criteria.createMany({
      data: [
        { kode: "C1", nama: "Harga Sewa (Rp/Bulan)", bobot: 0.30, tipe: "cost" },
        { kode: "C2", nama: "Jarak ke Kampus (km)", bobot: 0.25, tipe: "cost" },
        { kode: "C3", nama: "Fasilitas", bobot: 0.20, tipe: "benefit" },
        { kode: "C4", nama: "Keamanan", bobot: 0.15, tipe: "benefit" },
        { kode: "C5", nama: "Kebersihan", bobot: 0.10, tipe: "benefit" },
      ],
    });

    // Seed alternatives (kos-kosan)
    await prisma.alternative.createMany({
      data: [
        {
          namaKos: "Kos Melati Indah",
          lokasi: "Jl. Melati No. 12, Bandung",
          harga: 800000,
          jarak: 1.5,
          fasilitas: 4,
          keamanan: 5,
          kebersihan: 4,
        },
        {
          namaKos: "Kos Mawar Sejahtera",
          lokasi: "Jl. Mawar No. 7, Bandung",
          harga: 650000,
          jarak: 2.0,
          fasilitas: 3,
          keamanan: 4,
          kebersihan: 4,
        },
        {
          namaKos: "Kos Anggrek Residence",
          lokasi: "Jl. Anggrek No. 3, Bandung",
          harga: 1200000,
          jarak: 0.5,
          fasilitas: 5,
          keamanan: 5,
          kebersihan: 5,
        },
        {
          namaKos: "Kos Dahlia Asri",
          lokasi: "Jl. Dahlia No. 20, Bandung",
          harga: 500000,
          jarak: 3.0,
          fasilitas: 2,
          keamanan: 3,
          kebersihan: 3,
        },
        {
          namaKos: "Kos Kenanga Permai",
          lokasi: "Jl. Kenanga No. 15, Bandung",
          harga: 950000,
          jarak: 1.0,
          fasilitas: 4,
          keamanan: 4,
          kebersihan: 5,
        },
        {
          namaKos: "Kos Bougenville Jaya",
          lokasi: "Jl. Bougenville No. 8, Bandung",
          harga: 750000,
          jarak: 1.8,
          fasilitas: 3,
          keamanan: 4,
          kebersihan: 4,
        },
        {
          namaKos: "Kos Tulip Mandiri",
          lokasi: "Jl. Tulip No. 5, Bandung",
          harga: 600000,
          jarak: 2.5,
          fasilitas: 3,
          keamanan: 3,
          kebersihan: 3,
        },
      ],
    });

    return NextResponse.json({
      success: true,
      message: "Data seed berhasil ditambahkan! 7 kos dan 5 kriteria.",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Gagal menjalankan seed data" },
      { status: 500 }
    );
  }
}
