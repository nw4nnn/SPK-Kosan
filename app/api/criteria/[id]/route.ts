import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const body = await request.json();
    const { nama, bobot, tipe, kode } = body;

    const criteria = await prisma.criteria.update({
      where: { id: parseInt(params.id) },
      data: { nama, bobot: parseFloat(bobot), tipe, kode },
    });

    return NextResponse.json({ success: true, data: criteria });
  } catch {
    return NextResponse.json(
      { success: false, message: "Gagal mengupdate kriteria" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    await prisma.criteria.delete({
      where: { id: parseInt(params.id) },
    });
    return NextResponse.json({
      success: true,
      message: "Kriteria berhasil dihapus",
    });
  } catch {
    return NextResponse.json(
      { success: false, message: "Gagal menghapus kriteria" },
      { status: 500 },
    );
  }
}
