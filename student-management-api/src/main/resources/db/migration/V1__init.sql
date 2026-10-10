-- =====================================================
-- V1: schema ban đầu
-- Bảng: teachers, users, classes, students, class_leaders, subjects
-- (điểm số và điểm danh sẽ thêm ở các migration sau: V2, V3...)
-- Dùng VARCHAR + CHECK thay cho kiểu enum của PostgreSQL để ánh xạ
-- sang Java enum (EnumType.STRING) đơn giản hơn.
-- =====================================================

-- ---------- teachers ----------
CREATE TABLE teachers (
    id             BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    teacher_code   VARCHAR(20)  NOT NULL UNIQUE,                 -- vd: GV001
    full_name      VARCHAR(100) NOT NULL,
    gender         VARCHAR(10)  NOT NULL CHECK (gender IN ('MALE', 'FEMALE')),
    date_of_birth  DATE,
    email          VARCHAR(255) UNIQUE,
    phone          VARCHAR(20),
    department     VARCHAR(100) NOT NULL,                        -- tổ bộ môn, vd: Toán - Tin học
    degree         VARCHAR(50),                                  -- Cử nhân / Thạc sĩ / Tiến sĩ
    title_role     VARCHAR(100),                                 -- vd: Tổ trưởng môn Toán
    subject_taught VARCHAR(200),                                 -- vd: Toán khối 10 & 12
    status         VARCHAR(20)  NOT NULL DEFAULT 'ACTIVE'
                   CHECK (status IN ('ACTIVE', 'LEAVE', 'TRANSFERRED')),
    notes          TEXT,
    created_at     TIMESTAMPTZ  NOT NULL DEFAULT now(),
    updated_at     TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE INDEX idx_teachers_department ON teachers (department);
CREATE INDEX idx_teachers_status     ON teachers (status);

-- ---------- users (đăng nhập / phân quyền) ----------
CREATE TABLE users (
    id            BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    email         VARCHAR(255) NOT NULL UNIQUE,                  -- luôn lưu chữ thường
    password_hash VARCHAR(100) NOT NULL,                         -- bcrypt, không lưu mật khẩu thô
    full_name     VARCHAR(100) NOT NULL,
    title         VARCHAR(100),                                  -- chức danh hiển thị ở header
    role          VARCHAR(20)  NOT NULL DEFAULT 'TEACHER'
                  CHECK (role IN ('ADMIN', 'TEACHER')),
    teacher_id    BIGINT UNIQUE REFERENCES teachers (id) ON DELETE SET NULL,
    enabled       BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at    TIMESTAMPTZ  NOT NULL DEFAULT now(),
    updated_at    TIMESTAMPTZ  NOT NULL DEFAULT now()
);

-- ---------- classes ----------
CREATE TABLE classes (
    id                  BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    class_code          VARCHAR(20)  NOT NULL UNIQUE,            -- vd: LH-10A1
    class_name          VARCHAR(50)  NOT NULL,                   -- vd: Lớp 10A1
    grade_level         SMALLINT     NOT NULL CHECK (grade_level IN (10, 11, 12)),
    room                VARCHAR(50),                             -- vd: P.301 - Nhà A
    stream              VARCHAR(100),                            -- ban, vd: KHTN (Toán-Lý-Hóa)
    max_students        SMALLINT     NOT NULL DEFAULT 40 CHECK (max_students > 0),
    status              VARCHAR(20)  NOT NULL DEFAULT 'ACTIVE'
                        CHECK (status IN ('ACTIVE', 'ARCHIVED')),
    homeroom_teacher_id BIGINT REFERENCES teachers (id) ON DELETE SET NULL,
    created_at          TIMESTAMPTZ  NOT NULL DEFAULT now(),
    updated_at          TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE INDEX idx_classes_grade_level ON classes (grade_level);
CREATE INDEX idx_classes_homeroom    ON classes (homeroom_teacher_id);

-- ---------- students ----------
-- Khối (grade_level) không lưu riêng, lấy từ lớp để không bao giờ bị lệch.
CREATE TABLE students (
    id            BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    student_code  VARCHAR(20)  NOT NULL UNIQUE,                  -- vd: HS001
    full_name     VARCHAR(100) NOT NULL,
    date_of_birth DATE         NOT NULL,
    gender        VARCHAR(10)  NOT NULL CHECK (gender IN ('MALE', 'FEMALE', 'OTHER')),
    class_id      BIGINT       NOT NULL REFERENCES classes (id) ON DELETE RESTRICT,
    parent_email  VARCHAR(255),
    phone         VARCHAR(20),
    notes         TEXT,
    status        VARCHAR(20)  NOT NULL DEFAULT 'ACTIVE'
                  CHECK (status IN ('ACTIVE', 'SUSPENDED', 'TRANSFERRED')),
    created_at    TIMESTAMPTZ  NOT NULL DEFAULT now(),
    updated_at    TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE INDEX idx_students_class_id   ON students (class_id);
CREATE INDEX idx_students_full_name  ON students (full_name);
CREATE INDEX idx_students_status     ON students (status);
CREATE INDEX idx_students_created_at ON students (created_at DESC);

-- ---------- class_leaders (ban cán sự lớp) ----------
-- vd: Lớp trưởng, Lớp phó Học tập, Bí thư Chi đoàn. Mỗi chức danh một người trong một lớp.
-- Việc "học sinh phải thuộc đúng lớp này" được kiểm tra ở tầng ứng dụng.
CREATE TABLE class_leaders (
    id         BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    class_id   BIGINT      NOT NULL REFERENCES classes (id)  ON DELETE CASCADE,
    student_id BIGINT      NOT NULL REFERENCES students (id) ON DELETE CASCADE,
    title      VARCHAR(50) NOT NULL,
    UNIQUE (class_id, title),
    UNIQUE (class_id, student_id)
);

-- ---------- subjects ----------
CREATE TABLE subjects (
    id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    subject_code    VARCHAR(20)  NOT NULL UNIQUE,                -- vd: TOAN
    name            VARCHAR(100) NOT NULL,
    department      VARCHAR(100) NOT NULL,                       -- tổ bộ môn
    evaluation_type VARCHAR(20)  NOT NULL DEFAULT 'SCORE'
                    CHECK (evaluation_type IN ('SCORE', 'EVALUATION')),  -- chấm điểm / nhận xét (Đ, CĐ)
    periods_grade10 SMALLINT     NOT NULL DEFAULT 0 CHECK (periods_grade10 >= 0),
    periods_grade11 SMALLINT     NOT NULL DEFAULT 0 CHECK (periods_grade11 >= 0),
    periods_grade12 SMALLINT     NOT NULL DEFAULT 0 CHECK (periods_grade12 >= 0),
    head_teacher_id BIGINT REFERENCES teachers (id) ON DELETE SET NULL,  -- tổ trưởng bộ môn
    description     TEXT,
    status          VARCHAR(20)  NOT NULL DEFAULT 'ACTIVE'
                    CHECK (status IN ('ACTIVE', 'INACTIVE')),
    created_at      TIMESTAMPTZ  NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE INDEX idx_subjects_department ON subjects (department);