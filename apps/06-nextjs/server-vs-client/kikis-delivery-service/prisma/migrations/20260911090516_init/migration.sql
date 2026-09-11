-- CreateEnum
CREATE TYPE "DeliveryStatus" AS ENUM ('ACTIVE', 'ACCEPTED', 'DENIED', 'FULFILLED');

-- CreateTable
CREATE TABLE "Delivery" (
    "id" TEXT NOT NULL,
    "pickup" TEXT NOT NULL,
    "destination" TEXT NOT NULL,
    "status" "DeliveryStatus" NOT NULL DEFAULT 'ACTIVE',

    CONSTRAINT "Delivery_pkey" PRIMARY KEY ("id")
);
