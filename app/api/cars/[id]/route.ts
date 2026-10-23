import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    await prisma.carModel.delete({
      where: { id: parseInt(id) },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Ошибка удаления" }, { status: 500 });
  }
}