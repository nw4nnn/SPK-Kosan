import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { calculateSAW } from "@/lib/saw";

export async function GET() {
  try {
    const alternatives = await prisma.alternative.findMany();
    const criteria = await prisma.criteria.findMany({
      orderBy: { kode: "asc" },
    });

    if (alternatives.length === 0) {
      return NextResponse.json(
        { success: false, message: "Belum ada data alternatif kos" },
        { status: 400 },
      );
    }

    if (criteria.length === 0) {
      return NextResponse.json(
        { success: false, message: "Belum ada data kriteria" },
        { status: 400 },
      );
    }

    const totalBobot = criteria.reduce((sum, c) => sum + c.bobot, 0);
    if (Math.abs(totalBobot - 1) > 0.01) {
      return NextResponse.json(
        {
          success: false,
          message: `Total bobot kriteria harus 1 (saat ini: ${totalBobot.toFixed(2)})`,
        },
        { status: 400 },
      );
    }

    const result = calculateSAW(alternatives, criteria);

    return NextResponse.json({
      success: true,
      data: {
        ...result,
        criteria,
        alternatives,
      },
    });
  } catch {
    return NextResponse.json(
      { success: false, message: "Gagal melakukan perhitungan SAW" },
      { status: 500 },
    );
  }
}

export async function POST() {
  try {
    const alternatives = await prisma.alternative.findMany();
    const criteria = await prisma.criteria.findMany({
      orderBy: { kode: "asc" },
    });

    if (alternatives.length === 0 || criteria.length === 0) {
      return NextResponse.json(
        { success: false, message: "Data alternatif atau kriteria belum ada" },
        { status: 400 },
      );
    }

    const result = calculateSAW(alternatives, criteria);

    const history = await prisma.history.create({
      data: {
        hasilTerbaik: result.terbaik.namaKos,
        skor: result.terbaik.skor,
        jumlahAlternatif: alternatives.length,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Perhitungan berhasil disimpan",
      data: { ...result, history },
    });
  } catch {
    return NextResponse.json(
      { success: false, message: "Gagal menyimpan perhitungan" },
      { status: 500 },
    );
  }
}
