-- CreateEnum
CREATE TYPE "CourseType" AS ENUM ('OBRIGATORIA', 'ELETIVA');

-- CreateEnum
CREATE TYPE "UserCourseStatus" AS ENUM ('CURSADA', 'CURSANDO');

-- CreateTable
CREATE TABLE "majors" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "majors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "major_id" INTEGER NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "courses" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "workload_hours" INTEGER NOT NULL,
    "credits" INTEGER NOT NULL,
    "syllabus" TEXT,

    CONSTRAINT "courses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "major_courses" (
    "major_id" INTEGER NOT NULL,
    "course_id" INTEGER NOT NULL,
    "type" "CourseType" NOT NULL,
    "recommended_term" INTEGER,

    CONSTRAINT "major_courses_pkey" PRIMARY KEY ("major_id","course_id")
);

-- CreateTable
CREATE TABLE "course_prerequisites" (
    "course_id" INTEGER NOT NULL,
    "required_course_id" INTEGER NOT NULL,

    CONSTRAINT "course_prerequisites_pkey" PRIMARY KEY ("course_id","required_course_id")
);

-- CreateTable
CREATE TABLE "user_courses" (
    "user_id" INTEGER NOT NULL,
    "course_id" INTEGER NOT NULL,
    "status" "UserCourseStatus" NOT NULL,
    "term_label" TEXT NOT NULL,
    "grade" DECIMAL(4,2),

    CONSTRAINT "user_courses_pkey" PRIMARY KEY ("user_id","course_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "majors_code_key" ON "majors"("code");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "courses_code_key" ON "courses"("code");

-- CreateIndex
CREATE INDEX "course_prerequisites_required_course_id_idx" ON "course_prerequisites"("required_course_id");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_major_id_fkey" FOREIGN KEY ("major_id") REFERENCES "majors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "major_courses" ADD CONSTRAINT "major_courses_major_id_fkey" FOREIGN KEY ("major_id") REFERENCES "majors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "major_courses" ADD CONSTRAINT "major_courses_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_prerequisites" ADD CONSTRAINT "course_prerequisites_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_prerequisites" ADD CONSTRAINT "course_prerequisites_required_course_id_fkey" FOREIGN KEY ("required_course_id") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_courses" ADD CONSTRAINT "user_courses_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_courses" ADD CONSTRAINT "user_courses_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- A course cannot be its own prerequisite. Prisma cannot express CHECK constraints in the schema.
ALTER TABLE "course_prerequisites"
  ADD CONSTRAINT "course_prerequisites_no_self_reference" CHECK ("course_id" <> "required_course_id");
