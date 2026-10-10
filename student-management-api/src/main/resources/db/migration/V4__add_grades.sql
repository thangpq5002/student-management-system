-- ============================================================
-- V4: Danh mục loại đánh giá và quản lý điểm số
-- Tương thích V1-V3: sử dụng BIGINT và VARCHAR.
-- ============================================================

-- 1. Danh mục loại đánh giá
CREATE TABLE assessment_types (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    code VARCHAR(20) NOT NULL,
    name VARCHAR(100) NOT NULL,
    weight NUMERIC(5, 2) NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_assessment_types_code UNIQUE (code),
    CONSTRAINT chk_assessment_types_weight CHECK (weight > 0),
    CONSTRAINT chk_assessment_types_code CHECK (
        code IN (
            'ORAL',
            'QUIZ',
            'MIDTERM',
            'FINAL',
            'OTHER'
        )
    )
);

-- Dữ liệu loại đánh giá mặc định.
INSERT INTO
    assessment_types (code, name, weight)
VALUES ('ORAL', 'Điểm miệng', 1),
    (
        'QUIZ',
        'Kiểm tra thường xuyên',
        1
    ),
    (
        'MIDTERM',
        'Kiểm tra giữa kỳ',
        2
    ),
    (
        'FINAL',
        'Kiểm tra cuối kỳ',
        3
    ),
    ('OTHER', 'Đánh giá khác', 1);

-- 2. Bảng điểm
CREATE TABLE grades (
    id                 BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    enrollment_id      BIGINT NOT NULL,
    class_id           BIGINT NOT NULL,
    class_subject_id   BIGINT NOT NULL,
    class_teacher_id   BIGINT NOT NULL,
    assessment_type_id BIGINT NOT NULL,
    semester           VARCHAR(20) NOT NULL,
    assessment_number  INTEGER NOT NULL DEFAULT 1,
    score              NUMERIC(4, 2) NOT NULL,
    note               TEXT,
    created_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at         TIMESTAMPTZ NOT NULL DEFAULT now(),

-- Học sinh phải thuộc lớp được ghi nhận trong điểm.
CONSTRAINT fk_grades_enrollment_class FOREIGN KEY (enrollment_id, class_id) REFERENCES enrollments (id, class_id) ON DELETE CASCADE,

-- Môn học phải được mở cho chính lớp đó.
CONSTRAINT fk_grades_class_subject FOREIGN KEY (class_subject_id, class_id) REFERENCES class_subjects (id, class_id) ON DELETE CASCADE,

-- Giáo viên phải được phân công cho đúng lớp-môn.
CONSTRAINT fk_grades_class_teacher FOREIGN KEY (
    class_teacher_id,
    class_subject_id
) REFERENCES class_teachers (id, class_subject_id) ON DELETE RESTRICT,
CONSTRAINT fk_grades_assessment_type FOREIGN KEY (assessment_type_id) REFERENCES assessment_types (id) ON DELETE RESTRICT,
CONSTRAINT chk_grades_semester CHECK (
    semester IN ('SEMESTER_1', 'SEMESTER_2')
),
CONSTRAINT chk_grades_assessment_number CHECK (assessment_number > 0),
CONSTRAINT chk_grades_score CHECK (
    score >= 0
    AND score <= 10
),

-- Mỗi học sinh có thể có nhiều bài cùng loại,
-- nhưng số thứ tự của mỗi bài phải khác nhau.
CONSTRAINT uq_grades_assessment
        UNIQUE (
            enrollment_id,
            class_teacher_id,
            semester,
            assessment_type_id,
            assessment_number
        )
);

CREATE INDEX idx_grades_enrollment ON grades (enrollment_id);

CREATE INDEX idx_grades_class ON grades (class_id);

CREATE INDEX idx_grades_class_subject ON grades (class_subject_id);

CREATE INDEX idx_grades_class_teacher ON grades (class_teacher_id);

CREATE INDEX idx_grades_semester ON grades (semester);

CREATE INDEX idx_grades_assessment_type ON grades (assessment_type_id);

-- 3. Tự động cập nhật updated_at
CREATE TRIGGER trg_assessment_types_updated_at
BEFORE UPDATE ON assessment_types
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_grades_updated_at
BEFORE UPDATE ON grades
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();