import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> } // В новых версиях Next.js params - это Promise
) {
  try {
    const { id } = await context.params;
    const leadId = parseInt(id);

    await prisma.lead.delete({
      where: { id: leadId },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("ОШИБКА ПРИ УДАЛЕНИИ:", error);
    return NextResponse.json({ error: "Ошибка при удалении" }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const leadId = parseInt(id);
    const body = await req.json();
    
    const updatedLead = await prisma.lead.update({
      where: { id: leadId },
      data: { isPinned: body.isPinned },
    });
    return NextResponse.json(updatedLead);
  } catch (error) {
    console.error("ОШИБКА ПРИ ОБНОВЛЕНИИ:", error);
    return NextResponse.json({ error: "Ошибка при обновлении" }, { status: 500 });
  }
}