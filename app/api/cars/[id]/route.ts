import { NextResponse } from "next/server";
import { prisma } from "../../db";

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const leadId = parseInt(id);

    await prisma.carModel.delete({
      where: { id: leadId },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("ОШИБКА API DELETE CARS:", error);
    return NextResponse.json({ error: "Ошибка при удалении" }, { status: 500 });
  }
}