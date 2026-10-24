import { NextResponse } from "next/server";
import { prisma } from "../db";

export async function GET() {
  try {
    const cars = await prisma.carModel.findMany({
      orderBy: { brand: "asc" },
    });
    return NextResponse.json(cars);
  } catch (error) {
    console.error("ОШИБКА API GET CARS:", error);
    return NextResponse.json({ error: "Ошибка базы данных" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const newCar = await prisma.carModel.create({
      data: {
        brand: body.brand,
        model: body.model,
        years: body.years,
        marketPrice: Number(body.marketPrice),
      },
    });
    return NextResponse.json(newCar, { status: 201 });
  } catch (error) {
    console.error("ОШИБКА API POST CARS:", error);
    return NextResponse.json({ error: "Ошибка базы данных" }, { status: 500 });
  }
}