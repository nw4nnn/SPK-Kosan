import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const criteria = await prisma.criteria.findMany({
      orderBy: { kode: "asc" },
    });
    return NextResponse.json({ success: true, data: criteria });
  } catch {
    return NextResponse.json(
      { success: false, message: "Gagal mengambil data kriteria" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nama, bobot, tipe, kode } = body;

    if (!nama || !bobot || !tipe || !kode) {
      return NextResponse.json(
        { success: false, message: "Semua field harus diisi" },
        { status: 400 },
      );
    }

    const criteria = await prisma.criteria.create({
      data: { nama, bobot: parseFloat(bobot), tipe, kode },
    });

    return NextResponse.json(
      { success: true, data: criteria },
      { status: 201 },
    );
  } catch {
    return NextResponse.json(
      { success: false, message: "Gagal menambah kriteria" },
      { status: 500 },
    );
  }
}
