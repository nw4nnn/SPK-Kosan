import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const [totalAlternatif, totalKriteria, totalHistory, lastHistory] =
      await Promise.all([
        prisma.alternative.count(),
        prisma.criteria.count(),
        prisma.history.count(),
        prisma.history.findFirst({ orderBy: { createdAt: "desc" } }),
      ]);

    return NextResponse.json({
      success: true,
      data: {
        totalAlternatif,
        totalKriteria,
        totalHistory,
        hasilTerbaikTerakhir: lastHistory?.hasilTerbaik ?? null,
        skorTerakhir: lastHistory?.skor ?? null,
      },
    });
  } catch {
    return NextResponse.json(
      { success: false, message: "Gagal mengambil statistik dashboard" },
      { status: 500 },
    );
  }
}
