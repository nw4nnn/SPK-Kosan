import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const alternatives = await prisma.alternative.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, data: alternatives });
  } catch {
    return NextResponse.json(
      { success: false, message: "Gagal mengambil data alternatif" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { namaKos, lokasi, harga, jarak, fasilitas, keamanan, kebersihan } =
      body;

    if (
      !namaKos ||
      !lokasi ||
      !harga ||
      !jarak ||
      !fasilitas ||
      !keamanan ||
      !kebersihan
    ) {
      return NextResponse.json(
        { success: false, message: "Semua field harus diisi" },
        { status: 400 },
      );
    }

    const alternative = await prisma.alternative.create({
      data: {
        namaKos,
        lokasi,
        harga: parseFloat(harga),
        jarak: parseFloat(jarak),
        fasilitas: parseInt(fasilitas),
        keamanan: parseInt(keamanan),
        kebersihan: parseInt(kebersihan),
      },
    });

    return NextResponse.json(
      { success: true, data: alternative },
      { status: 201 },
    );
  } catch {
    return NextResponse.json(
      { success: false, message: "Gagal menambah data alternatif" },
      { status: 500 },
    );
  }
}
