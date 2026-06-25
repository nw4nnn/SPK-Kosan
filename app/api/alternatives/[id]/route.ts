import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const alternative = await prisma.alternative.findUnique({
      where: { id: parseInt(params.id) },
    });
    if (!alternative) {
      return NextResponse.json(
        { success: false, message: "Data tidak ditemukan" },
        { status: 404 },
      );
    }
    return NextResponse.json({ success: true, data: alternative });
  } catch {
    return NextResponse.json(
      { success: false, message: "Gagal mengambil data" },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const body = await request.json();
    const { namaKos, lokasi, harga, jarak, fasilitas, keamanan, kebersihan } =
      body;

    const alternative = await prisma.alternative.update({
      where: { id: parseInt(params.id) },
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

    return NextResponse.json({ success: true, data: alternative });
  } catch {
    return NextResponse.json(
      { success: false, message: "Gagal mengupdate data" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    await prisma.alternative.delete({
      where: { id: parseInt(params.id) },
    });
    return NextResponse.json({
      success: true,
      message: "Data berhasil dihapus",
    });
  } catch {
    return NextResponse.json(
      { success: false, message: "Gagal menghapus data" },
      { status: 500 },
    );
  }
}
