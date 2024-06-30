-- CreateTable
CREATE TABLE "Beverage" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Beverage_pkey" PRIMARY KEY ("id")
);
