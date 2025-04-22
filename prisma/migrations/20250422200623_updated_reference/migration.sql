-- DropForeignKey
ALTER TABLE "images" DROP CONSTRAINT "images_artistId_fkey";

-- DropForeignKey
ALTER TABLE "tracks" DROP CONSTRAINT "tracks_artistId_fkey";

-- AlterTable
ALTER TABLE "images" ALTER COLUMN "artistId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "tracks" ALTER COLUMN "artistId" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "images" ADD CONSTRAINT "images_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "artists"("artistId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tracks" ADD CONSTRAINT "tracks_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "artists"("artistId") ON DELETE RESTRICT ON UPDATE CASCADE;
