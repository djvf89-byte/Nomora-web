/*
  Warnings:

  - You are about to drop the column `ciudad` on the `direcciones` table. All the data in the column will be lost.
  - Added the required column `departamento` to the `direcciones` table without a default value. This is not possible if the table is not empty.
  - Added the required column `provincia` to the `direcciones` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "direcciones" DROP COLUMN "ciudad",
ADD COLUMN     "departamento" TEXT NOT NULL,
ADD COLUMN     "provincia" TEXT NOT NULL;
