-- ============================================================
-- V3: Phân công giảng dạy và lịch sử học sinh theo năm học
-- Giữ nguyên các bảng và cột hiện có.
-- Sử dụng BIGINT để tương thích với schema V1.
-- ============================================================

-- ============================================================
-- 1. CLASS_SUBJECTS
-- Môn học được mở cho lớp theo năm học và học kỳ.
-- ============================================================

-- Hàm tự động cập nhật updated_at khi bản ghi thay đổi.
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


CREATE TABLE class_subjects (
    id            BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    class_id      BIGINT NOT NULL,
    subject_id    BIGINT NOT NULL,
    academic_year VARCHAR(20) NOT NULL,
    semester      VARCHAR(20) NOT NULL,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT fk_class_subjects_class
        FOREIGN KEY (class_id)
        REFERENCES classes (id)
        ON DELETE CASCADE,

    CONSTRAINT fk_class_subjects_subject
        FOREIGN KEY (subject_id)
        REFERENCES subjects (id)
        ON DELETE CASCADE,

    CONSTRAINT chk_class_subjects_semester
        CHECK (semester IN ('SEMESTER_1', 'SEMESTER_2')),

    CONSTRAINT chk_class_subjects_academic_year
        CHECK (length(trim(academic_year)) > 0),

    CONSTRAINT uq_class_subjects_year_semester
        UNIQUE (class_id, subject_id, academic_year, semester),

-- Phục vụ khóa ngoại ghép ở các migration sau.
CONSTRAINT uq_class_subjects_id_class
        UNIQUE (id, class_id)
);

CREATE INDEX idx_class_subjects_class ON class_subjects (class_id);

CREATE INDEX idx_class_subjects_subject ON class_subjects (subject_id);

CREATE INDEX idx_class_subjects_year_semester ON class_subjects (academic_year, semester);

-- ============================================================
-- 2. CLASS_TEACHERS
-- Phân công giáo viên dạy một lớp-môn cụ thể.
-- ============================================================


CREATE TABLE class_teachers (
    id               BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    class_subject_id BIGINT NOT NULL,
    teacher_id       BIGINT NOT NULL,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT fk_class_teachers_class_subject
        FOREIGN KEY (class_subject_id)
        REFERENCES class_subjects (id)
        ON DELETE CASCADE,

    CONSTRAINT fk_class_teachers_teacher
        FOREIGN KEY (teacher_id)
        REFERENCES teachers (id)
        ON DELETE RESTRICT,

    CONSTRAINT uq_class_subject_teacher
        UNIQUE (class_subject_id, teacher_id),

-- Phục vụ khóa ngoại ghép ở các migration sau.
CONSTRAINT uq_class_teachers_id_class_subject
        UNIQUE (id, class_subject_id)
);

CREATE INDEX idx_class_teachers_class_subject ON class_teachers (class_subject_id);

CREATE INDEX idx_class_teachers_teacher ON class_teachers (teacher_id);

-- ============================================================
-- 3. ENROLLMENTS
-- Lưu lịch sử học sinh theo lớp và năm học.
-- students.class_id vẫn được giữ để tương thích code cũ.
-- ============================================================


CREATE TABLE enrollments (
    id             BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    student_id     BIGINT NOT NULL,
    class_id       BIGINT NOT NULL,
    academic_year  VARCHAR(20) NOT NULL,
    enrollment_date DATE NOT NULL DEFAULT CURRENT_DATE,
    status         VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at     TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT fk_enrollments_student
        FOREIGN KEY (student_id)
        REFERENCES students (id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_enrollments_class
        FOREIGN KEY (class_id)
        REFERENCES classes (id)
        ON DELETE RESTRICT,

    CONSTRAINT chk_enrollments_status
        CHECK (
            status IN (
                'ACTIVE',
                'COMPLETED',
                'TRANSFERRED',
                'DROPPED'
            )
        ),

    CONSTRAINT chk_enrollments_academic_year
        CHECK (length(trim(academic_year)) > 0),

-- Mỗi học sinh chỉ có một bản ghi lớp trong mỗi năm học.
CONSTRAINT uq_enrollments_student_year UNIQUE (student_id, academic_year),

-- Phục vụ khóa ngoại ghép ở migration điểm số/điểm danh.
CONSTRAINT uq_enrollments_id_class UNIQUE (id, class_id) );

CREATE INDEX idx_enrollments_student ON enrollments (student_id);

CREATE INDEX idx_enrollments_class ON enrollments (class_id);

CREATE INDEX idx_enrollments_year ON enrollments (academic_year);

CREATE INDEX idx_enrollments_status ON enrollments (status);

-- ============================================================
-- 4. TRIGGER updated_at CHO ENROLLMENTS
-- Hàm update_updated_at_column() đã được tạo ở V1
-- theo schema hiện tại.
-- ============================================================

CREATE TRIGGER trg_enrollments_updated_at
BEFORE UPDATE ON enrollments
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();