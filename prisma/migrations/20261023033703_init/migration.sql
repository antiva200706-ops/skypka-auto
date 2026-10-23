-- CreateTable
CREATE TABLE "Lead" (
    "id" SERIAL NOT NULL,
    "brand" TEXT NOT NULL,
    "year" TEXT NOT NULL,
    "mileage" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "isRunning" TEXT NOT NULL,
    "docs" TEXT NOT NULL,
    "isDamaged" TEXT NOT NULL,
    "priceMin" INTEGER NOT NULL,
    "priceMax" INTEGER NOT NULL,
    "isPinned" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Lead_pkey" PRIMARY KEY ("id")
);
