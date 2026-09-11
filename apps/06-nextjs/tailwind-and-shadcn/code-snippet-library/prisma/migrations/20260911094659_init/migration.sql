-- CreateEnum
CREATE TYPE "ProgrammingLanguage" AS ENUM ('CSS', 'JAVASCRIPT', 'TYPESCRIPT');

-- CreateTable
CREATE TABLE "Snippet" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "language" "ProgrammingLanguage" NOT NULL,
    "description" TEXT NOT NULL,
    "code" TEXT NOT NULL,

    CONSTRAINT "Snippet_pkey" PRIMARY KEY ("id")
);
