import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    const newLead = await prisma.lead.create({
      data: {
        brand: body.brand,
        year: String(body.year),
        mileage: String(body.mileage),
        phone: body.phone,
        isRunning: body.isRunning,
        docs: body.docs,
        isDamaged: body.isDamaged,
        priceMin: Number(body.priceMin),
        priceMax: Number(body.priceMax),
      },
    });

    return NextResponse.json(newLead, { status: 201 });
  } catch (error) {
    console.error("ОШИБКА ПРИ СОЗДАНИИ:", error);
    return NextResponse.json({ error: "Ошибка при сохранении" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const leads = await prisma.lead.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(leads);
  } catch (error) {
    console.error("ОШИБКА ПРИ ЗАГРУЗКЕ:", error);
    return NextResponse.json({ error: "Ошибка при загрузке" }, { status: 500 });
  }
}