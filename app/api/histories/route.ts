import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const histories = await prisma.history.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, data: histories });
  } catch {
    return NextResponse.json(
      { success: false, message: "Gagal mengambil riwayat" },
      { status: 500 },
    );
  }
}

export async function DELETE() {
  try {
    await prisma.history.deleteMany();
    return NextResponse.json({
      success: true,
      message: "Semua riwayat berhasil dihapus",
    });
  } catch {
    return NextResponse.json(
      { success: false, message: "Gagal menghapus riwayat" },
      { status: 500 },
    );
  }
}
