import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, message: "ID tidak valid" },
        { status: 400 }
      );
    }
    await prisma.history.delete({ where: { id } });
    return NextResponse.json({
      success: true,
      message: "Riwayat berhasil dihapus",
    });
  } catch {
    return NextResponse.json(
      { success: false, message: "Gagal menghapus riwayat" },
      { status: 500 }
    );
  }
}
