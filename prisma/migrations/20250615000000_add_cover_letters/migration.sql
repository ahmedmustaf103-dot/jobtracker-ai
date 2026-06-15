-- CreateTable
CREATE TABLE "cover_letters" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "jobDescription" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cover_letters_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "cover_letters_userId_idx" ON "cover_letters"("userId");

-- AddForeignKey
ALTER TABLE "cover_letters" ADD CONSTRAINT "cover_letters_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
