-- ============================================================
-- V5: Quản lý phiên điểm danh và kết quả điểm danh
-- Tương thích V1-V4: sử dụng BIGINT và VARCHAR.
-- ============================================================

-- 1. Phiên điểm danh


CREATE TABLE attendance_sessions (
    id                BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    class_id          BIGINT NOT NULL,
    attendance_type   VARCHAR(20) NOT NULL DEFAULT 'CLASS',
    class_subject_id  BIGINT,
    class_teacher_id  BIGINT,
    attendance_date   DATE NOT NULL,
    period             INTEGER,
    note               TEXT,
    created_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at         TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT fk_attendance_sessions_class
        FOREIGN KEY (class_id)
        REFERENCES classes (id)
        ON DELETE CASCADE,

-- Nếu có lớp-môn, lớp-môn phải thuộc chính lớp này.
CONSTRAINT fk_attendance_sessions_class_subject FOREIGN KEY (class_subject_id, class_id) REFERENCES class_subjects (id, class_id) ON DELETE RESTRICT,

-- Giáo viên phải được phân công cho đúng lớp-môn.
CONSTRAINT fk_attendance_sessions_class_teacher FOREIGN KEY (
    class_teacher_id,
    class_subject_id
) REFERENCES class_teachers (id, class_subject_id) ON DELETE RESTRICT,
CONSTRAINT chk_attendance_sessions_type CHECK (
    attendance_type IN ('CLASS', 'SUBJECT')
),
CONSTRAINT chk_attendance_sessions_period CHECK (
    period IS NULL
    OR period > 0
),
CONSTRAINT chk_attendance_sessions_assignment CHECK (
    (
        attendance_type = 'CLASS'
        AND class_subject_id IS NULL
        AND class_teacher_id IS NULL
    )
    OR (
        attendance_type = 'SUBJECT'
        AND class_subject_id IS NOT NULL
        AND class_teacher_id IS NOT NULL
    )
),

-- Cho phép nhiều phiên trong ngày nếu khác tiết hoặc môn.
CONSTRAINT uq_attendance_sessions_identity UNIQUE NULLS NOT DISTINCT (
    class_id,
    attendance_date,
    period,
    attendance_type,
    class_subject_id
),

-- Phục vụ khóa ngoại ghép ở attendance_records.
CONSTRAINT uq_attendance_sessions_id_class
        UNIQUE (id, class_id)
);

CREATE INDEX idx_attendance_sessions_class_date ON attendance_sessions (class_id, attendance_date);

CREATE INDEX idx_attendance_sessions_teacher ON attendance_sessions (class_teacher_id);

CREATE INDEX idx_attendance_sessions_subject ON attendance_sessions (class_subject_id);

-- 2. Kết quả điểm danh
CREATE TABLE attendance_records (
    id             BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    session_id     BIGINT NOT NULL,
    enrollment_id  BIGINT NOT NULL,
    class_id       BIGINT NOT NULL,
    status         VARCHAR(20) NOT NULL,
    note           TEXT,
    created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at     TIMESTAMPTZ NOT NULL DEFAULT now(),

-- Phiên điểm danh và học sinh phải cùng một lớp.


CONSTRAINT fk_attendance_records_session_class
        FOREIGN KEY (session_id, class_id)
        REFERENCES attendance_sessions (id, class_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_attendance_records_enrollment_class
        FOREIGN KEY (enrollment_id, class_id)
        REFERENCES enrollments (id, class_id)
        ON DELETE CASCADE,

    CONSTRAINT chk_attendance_records_status
        CHECK (
            status IN ('PRESENT', 'ABSENT', 'LATE', 'EXCUSED')
        ),

    CONSTRAINT uq_attendance_records_session_enrollment
        UNIQUE (session_id, enrollment_id)
);

CREATE INDEX idx_attendance_records_session ON attendance_records (session_id);

CREATE INDEX idx_attendance_records_enrollment ON attendance_records (enrollment_id);

CREATE INDEX idx_attendance_records_status ON attendance_records (status);

-- 3. Tự động cập nhật updated_at
CREATE TRIGGER trg_attendance_sessions_updated_at
BEFORE UPDATE ON attendance_sessions
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_attendance_records_updated_at
BEFORE UPDATE ON attendance_records
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();