-- Opt-in sample data for a dedicated local/demo database.
-- Set SAMPLE_DATA_ENABLED=true before this migration is first applied.
-- The flag defaults to false so normal deployments do not receive demo data.

INSERT INTO teachers (
    teacher_code, full_name, gender, date_of_birth, email, phone,
    department, degree, title_role, subject_taught, status, notes
)
SELECT *
FROM (VALUES
    ('SAMPLE-GV01', 'Nguyễn Minh Anh', 'FEMALE', DATE '1982-03-14', 'sample.gv01@example.com', '0905000001', 'Toán - Tin học', 'Thạc sĩ', 'Tổ trưởng Toán', 'Toán', 'ACTIVE', 'Tài khoản giáo viên dữ liệu mẫu'),
    ('SAMPLE-GV02', 'Trần Quốc Bảo', 'MALE', DATE '1980-07-22', 'sample.gv02@example.com', '0905000002', 'Ngữ văn', 'Thạc sĩ', 'Giáo viên Ngữ văn', 'Ngữ văn', 'ACTIVE', 'Tài khoản giáo viên dữ liệu mẫu'),
    ('SAMPLE-GV03', 'Lê Thu Hà', 'FEMALE', DATE '1985-11-08', 'sample.gv03@example.com', '0905000003', 'Tiếng Anh', 'Cử nhân', 'Giáo viên Tiếng Anh', 'Tiếng Anh', 'ACTIVE', 'Tài khoản giáo viên dữ liệu mẫu'),
    ('SAMPLE-GV04', 'Phạm Đức Long', 'MALE', DATE '1979-01-30', 'sample.gv04@example.com', '0905000004', 'Vật lý', 'Thạc sĩ', 'Tổ trưởng Khoa học tự nhiên', 'Vật lý', 'ACTIVE', 'Tài khoản giáo viên dữ liệu mẫu'),
    ('SAMPLE-GV05', 'Võ Ngọc Lan', 'FEMALE', DATE '1987-05-19', 'sample.gv05@example.com', '0905000005', 'Hóa học', 'Thạc sĩ', 'Giáo viên Hóa học', 'Hóa học', 'ACTIVE', 'Tài khoản giáo viên dữ liệu mẫu'),
    ('SAMPLE-GV06', 'Đặng Hoàng Nam', 'MALE', DATE '1983-09-02', 'sample.gv06@example.com', '0905000006', 'Sinh học', 'Cử nhân', 'Giáo viên Sinh học', 'Sinh học', 'ACTIVE', 'Tài khoản giáo viên dữ liệu mẫu'),
    ('SAMPLE-GV07', 'Bùi Thanh Hương', 'FEMALE', DATE '1981-12-11', 'sample.gv07@example.com', '0905000007', 'Lịch sử', 'Thạc sĩ', 'Giáo viên Lịch sử', 'Lịch sử', 'ACTIVE', 'Tài khoản giáo viên dữ liệu mẫu'),
    ('SAMPLE-GV08', 'Đỗ Mạnh Cường', 'MALE', DATE '1986-04-27', 'sample.gv08@example.com', '0905000008', 'Địa lý', 'Cử nhân', 'Giáo viên Địa lý', 'Địa lý', 'ACTIVE', 'Tài khoản giáo viên dữ liệu mẫu'),
    ('SAMPLE-GV09', 'Ngô Thị Mai', 'FEMALE', DATE '1984-08-16', 'sample.gv09@example.com', '0905000009', 'Toán - Tin học', 'Thạc sĩ', 'Giáo viên Tin học', 'Tin học', 'ACTIVE', 'Tài khoản giáo viên dữ liệu mẫu'),
    ('SAMPLE-GV10', 'Hoàng Văn Phúc', 'MALE', DATE '1978-10-05', 'sample.gv10@example.com', '0905000010', 'Ngữ văn', 'Thạc sĩ', 'Giáo viên Ngữ văn', 'Ngữ văn', 'ACTIVE', 'Tài khoản giáo viên dữ liệu mẫu')
) AS seed(
    teacher_code, full_name, gender, date_of_birth, email, phone,
    department, degree, title_role, subject_taught, status, notes
)
WHERE '${sampleDataEnabled}'::boolean
ON CONFLICT DO NOTHING;

INSERT INTO classes (
    class_code, class_name, grade_level, room, stream, max_students, status, homeroom_teacher_id
)
SELECT seed.class_code, seed.class_name, seed.grade_level, seed.room, seed.stream,
       35, 'ACTIVE', teacher.id
FROM (VALUES
    ('SAMPLE-10A1', '10A1 (Mẫu)', 10, 'A301', 'KHTN', 'SAMPLE-GV01'),
    ('SAMPLE-10A2', '10A2 (Mẫu)', 10, 'A302', 'KHXH', 'SAMPLE-GV02'),
    ('SAMPLE-10A3', '10A3 (Mẫu)', 10, 'A303', 'KHTN', 'SAMPLE-GV03'),
    ('SAMPLE-11A1', '11A1 (Mẫu)', 11, 'A401', 'KHTN', 'SAMPLE-GV04'),
    ('SAMPLE-11A2', '11A2 (Mẫu)', 11, 'A402', 'KHXH', 'SAMPLE-GV05'),
    ('SAMPLE-11A3', '11A3 (Mẫu)', 11, 'A403', 'KHTN', 'SAMPLE-GV06'),
    ('SAMPLE-12A1', '12A1 (Mẫu)', 12, 'A501', 'KHTN', 'SAMPLE-GV07'),
    ('SAMPLE-12A2', '12A2 (Mẫu)', 12, 'A502', 'KHXH', 'SAMPLE-GV08'),
    ('SAMPLE-12A3', '12A3 (Mẫu)', 12, 'A503', 'KHTN', 'SAMPLE-GV09'),
    ('SAMPLE-12A4', '12A4 (Mẫu)', 12, 'A504', 'KHXH', 'SAMPLE-GV10')
) AS seed(class_code, class_name, grade_level, room, stream, teacher_code)
JOIN teachers teacher ON teacher.teacher_code = seed.teacher_code
WHERE '${sampleDataEnabled}'::boolean
ON CONFLICT DO NOTHING;

INSERT INTO subjects (
    subject_code, name, department, evaluation_type,
    periods_grade10, periods_grade11, periods_grade12, head_teacher_id, description, status
)
SELECT seed.subject_code, seed.name, seed.department, 'SCORE',
       seed.periods_grade10, seed.periods_grade11, seed.periods_grade12,
       teacher.id, seed.description, 'ACTIVE'
FROM (VALUES
    ('SAMPLE-TOAN', 'Toán', 'Toán - Tin học', 4, 4, 3, 'SAMPLE-GV01', 'Môn Toán dữ liệu mẫu'),
    ('SAMPLE-VAN', 'Ngữ văn', 'Ngữ văn', 4, 4, 3, 'SAMPLE-GV02', 'Môn Ngữ văn dữ liệu mẫu'),
    ('SAMPLE-ANH', 'Tiếng Anh', 'Tiếng Anh', 3, 3, 3, 'SAMPLE-GV03', 'Môn Tiếng Anh dữ liệu mẫu'),
    ('SAMPLE-LY', 'Vật lý', 'Vật lý', 2, 2, 2, 'SAMPLE-GV04', 'Môn Vật lý dữ liệu mẫu'),
    ('SAMPLE-HOA', 'Hóa học', 'Hóa học', 2, 2, 2, 'SAMPLE-GV05', 'Môn Hóa học dữ liệu mẫu'),
    ('SAMPLE-SINH', 'Sinh học', 'Sinh học', 2, 2, 2, 'SAMPLE-GV06', 'Môn Sinh học dữ liệu mẫu'),
    ('SAMPLE-SU', 'Lịch sử', 'Lịch sử', 2, 2, 2, 'SAMPLE-GV07', 'Môn Lịch sử dữ liệu mẫu'),
    ('SAMPLE-DIA', 'Địa lý', 'Địa lý', 2, 2, 2, 'SAMPLE-GV08', 'Môn Địa lý dữ liệu mẫu'),
    ('SAMPLE-TIN', 'Tin học', 'Toán - Tin học', 1, 1, 1, 'SAMPLE-GV09', 'Môn Tin học dữ liệu mẫu')
) AS seed(subject_code, name, department, periods_grade10, periods_grade11,
          periods_grade12, teacher_code, description)
JOIN teachers teacher ON teacher.teacher_code = seed.teacher_code
WHERE '${sampleDataEnabled}'::boolean
ON CONFLICT DO NOTHING;

INSERT INTO students (
    student_code, full_name, date_of_birth, gender, class_id,
    parent_email, phone, notes, status
)
SELECT format('SAMPLE-HS-%s-%s',
              lpad(class_no::text, 2, '0'),
              lpad(student_no::text, 3, '0')),
       names.full_name,
       make_date(2011 - (school_class.grade_level - 10),
                 1 + ((student_no * 7) % 12),
                 1 + ((student_no * 11) % 27)),
       CASE WHEN student_no % 2 = 0 THEN 'FEMALE' ELSE 'MALE' END,
       school_class.id,
       format('ph.sample.hs%s%s@example.com',
              lpad(class_no::text, 2, '0'),
              lpad(student_no::text, 3, '0')),
       format('090%s%s', lpad(class_no::text, 2, '0'), lpad(student_no::text, 5, '0')),
       'Học sinh dữ liệu mẫu',
       'ACTIVE'
FROM (
    SELECT c.id, c.class_code, c.grade_level,
           row_number() OVER (ORDER BY c.class_code)::integer AS class_no
    FROM classes c
    WHERE c.class_code LIKE 'SAMPLE-%'
) school_class
CROSS JOIN generate_series(1, 30) AS generated(student_no)
CROSS JOIN LATERAL (
    SELECT (ARRAY[
        'Nguyễn Minh Châu', 'Trần Gia Bảo', 'Lê Khánh Linh', 'Phạm Tuấn Kiệt',
        'Võ Ngọc Ánh', 'Đặng Hoàng Sơn', 'Bùi Thảo My', 'Đỗ Nhật Nam',
        'Ngô Phương Thảo', 'Hoàng Anh Dũng', 'Phan Hà My', 'Vũ Đức Anh',
        'Đinh Quỳnh Trang', 'Hồ Thành Đạt', 'Dương Bảo Ngọc', 'Mai Quốc Huy',
        'Trương Thu Uyên', 'Lý Hải Đăng', 'Cao Ngọc Diệp', 'Đào Minh Quân',
        'Tạ Thanh Tâm', 'Lương Anh Tuấn', 'Châu Mỹ Linh', 'Tô Hoàng Phong',
        'Chu Thùy Dương', 'Đoàn Đức Thịnh', 'Lâm Ngọc Hân', 'Vương Nhật Minh',
        'Hà Khánh Vy', 'Tăng Quốc Việt'
    ])[student_no] AS full_name
) names
WHERE '${sampleDataEnabled}'::boolean
ON CONFLICT DO NOTHING;

INSERT INTO enrollments (student_id, class_id, academic_year, enrollment_date, status)
SELECT student.id, school_class.id, '2026-2027', DATE '2026-09-05', 'ACTIVE'
FROM students student
JOIN classes school_class ON school_class.id = student.class_id
WHERE student.student_code LIKE 'SAMPLE-HS-%'
  AND school_class.class_code LIKE 'SAMPLE-%'
  AND '${sampleDataEnabled}'::boolean
  AND NOT EXISTS (
      SELECT 1
      FROM enrollments existing
      WHERE existing.student_id = student.id
        AND existing.academic_year = '2026-2027'
        AND existing.status = 'ACTIVE'
  )
ON CONFLICT DO NOTHING;

INSERT INTO class_leaders (class_id, student_id, title)
SELECT school_class.id, student.id, leader.title
FROM classes school_class
JOIN students student ON student.class_id = school_class.id
JOIN LATERAL (
    SELECT CASE
        WHEN right(student.student_code, 3)::integer = 1 THEN 'Lớp trưởng'
        WHEN right(student.student_code, 3)::integer = 2 THEN 'Lớp phó học tập'
    END AS title
) leader ON leader.title IS NOT NULL
WHERE school_class.class_code LIKE 'SAMPLE-%'
  AND student.student_code LIKE 'SAMPLE-HS-%'
  AND '${sampleDataEnabled}'::boolean
ON CONFLICT DO NOTHING;

INSERT INTO class_subjects (class_id, subject_id, academic_year, semester)
SELECT school_class.id, subject.id, '2026-2027', semester.semester
FROM classes school_class
CROSS JOIN subjects subject
CROSS JOIN (VALUES ('SEMESTER_1'), ('SEMESTER_2')) semester(semester)
WHERE school_class.class_code LIKE 'SAMPLE-%'
  AND subject.subject_code LIKE 'SAMPLE-%'
  AND '${sampleDataEnabled}'::boolean
ON CONFLICT DO NOTHING;

WITH sample_classes AS (
    SELECT id, class_code,
           row_number() OVER (ORDER BY class_code)::integer AS class_number
    FROM classes
    WHERE class_code LIKE 'SAMPLE-10%'
       OR class_code LIKE 'SAMPLE-11%'
       OR class_code LIKE 'SAMPLE-12%'
),
sample_subjects AS (
    SELECT id, subject_code
    FROM subjects
    WHERE subject_code LIKE 'SAMPLE-%'
)
INSERT INTO class_teachers (class_subject_id, teacher_id)
SELECT class_subject.id, teacher.id
FROM class_subjects class_subject
JOIN sample_classes school_class ON school_class.id = class_subject.class_id
JOIN sample_subjects subject ON subject.id = class_subject.subject_id
JOIN LATERAL (
    SELECT CASE subject.subject_code
        WHEN 'SAMPLE-TOAN' THEN 1
        WHEN 'SAMPLE-VAN' THEN CASE WHEN school_class.class_number % 2 = 0 THEN 10 ELSE 2 END
        WHEN 'SAMPLE-ANH' THEN 3
        WHEN 'SAMPLE-LY' THEN 4
        WHEN 'SAMPLE-HOA' THEN 5
        WHEN 'SAMPLE-SINH' THEN 6
        WHEN 'SAMPLE-SU' THEN 7
        WHEN 'SAMPLE-DIA' THEN 8
        WHEN 'SAMPLE-TIN' THEN 9
    END AS teacher_number
) assignment_map ON TRUE
JOIN teachers teacher ON teacher.teacher_code =
    format('SAMPLE-GV%s', lpad(assignment_map.teacher_number::text, 2, '0'))
WHERE school_class.class_code LIKE 'SAMPLE-%'
  AND subject.subject_code LIKE 'SAMPLE-%'
  AND class_subject.academic_year = '2026-2027'
  AND '${sampleDataEnabled}'::boolean
ON CONFLICT DO NOTHING;

INSERT INTO users (email, password_hash, full_name, title, role, teacher_id, enabled)
SELECT lower(teacher.email),
       '$2a$10$ibaEx8sB5IAegM169yxPqupcwCKN0dIfT.vfCgmuXGR2PzgwDvfJm',
       teacher.full_name,
       'Giáo viên',
       'TEACHER',
       teacher.id,
       TRUE
FROM teachers teacher
WHERE teacher.teacher_code LIKE 'SAMPLE-GV%'
  AND '${sampleDataEnabled}'::boolean
  AND NOT EXISTS (
      SELECT 1 FROM users existing
      WHERE existing.teacher_id = teacher.id OR lower(existing.email) = lower(teacher.email)
  )
ON CONFLICT DO NOTHING;

INSERT INTO grades (
    enrollment_id, class_id, class_subject_id, class_teacher_id,
    assessment_type_id, semester, assessment_number, score, note
)
SELECT enrollment.id,
       school_class.id,
       class_subject.id,
       class_teacher.id,
       assessment_type.id,
       CASE WHEN generated.assessment_index < 2 THEN 'SEMESTER_1' ELSE 'SEMESTER_2' END,
       1,
       (5.00 + ((student_no * 13 + generated.assessment_index * 17) % 51) / 10.0)::numeric(4, 2),
       'Điểm dữ liệu mẫu'
FROM students student
JOIN LATERAL (
    SELECT right(student.student_code, 3)::integer AS student_no,
           CASE right(student.student_code, 3)::integer % 3
               WHEN 0 THEN 'SAMPLE-TOAN'
               WHEN 1 THEN 'SAMPLE-VAN'
               ELSE 'SAMPLE-ANH'
           END AS subject_code
) student_map ON TRUE
JOIN classes school_class ON school_class.id = student.class_id
JOIN enrollments enrollment
  ON enrollment.student_id = student.id
 AND enrollment.class_id = school_class.id
 AND enrollment.academic_year = '2026-2027'
 AND enrollment.status = 'ACTIVE'
JOIN LATERAL generate_series(0, 3) AS generated(assessment_index) ON TRUE
JOIN class_subjects class_subject
  ON class_subject.class_id = school_class.id
 AND class_subject.academic_year = enrollment.academic_year
 AND class_subject.semester = CASE
       WHEN generated.assessment_index < 2 THEN 'SEMESTER_1'
       ELSE 'SEMESTER_2'
     END
JOIN subjects subject
  ON subject.id = class_subject.subject_id
 AND subject.subject_code = student_map.subject_code
JOIN class_teachers class_teacher
  ON class_teacher.class_subject_id = class_subject.id
 AND class_teacher.active
JOIN assessment_types assessment_type
  ON assessment_type.code = (ARRAY['ORAL', 'QUIZ', 'MIDTERM', 'FINAL', 'OTHER'])
       [((student_map.student_no + generated.assessment_index) % 5) + 1]
WHERE student.student_code LIKE 'SAMPLE-HS-%'
  AND school_class.class_code LIKE 'SAMPLE-%'
  AND '${sampleDataEnabled}'::boolean
ON CONFLICT DO NOTHING;

INSERT INTO attendance_sessions (
    class_id, attendance_type, class_subject_id, class_teacher_id,
    attendance_date, period, note
)
SELECT school_class.id,
       'SUBJECT',
       class_subject.id,
       class_teacher.id,
       sample_day.attendance_date,
       CASE WHEN sample_day.day_number = 2 THEN 6 ELSE 1 END,
       'Phiên điểm danh dữ liệu mẫu'
FROM classes school_class
CROSS JOIN (VALUES
    (1, DATE '2026-09-07'),
    (2, DATE '2026-09-14'),
    (3, DATE '2026-09-21')
) sample_day(day_number, attendance_date)
JOIN subjects subject ON subject.subject_code = CASE sample_day.day_number
    WHEN 1 THEN 'SAMPLE-TOAN'
    WHEN 2 THEN 'SAMPLE-VAN'
    ELSE 'SAMPLE-ANH'
END
JOIN class_subjects class_subject
  ON class_subject.class_id = school_class.id
 AND class_subject.subject_id = subject.id
 AND class_subject.academic_year = '2026-2027'
 AND class_subject.semester = 'SEMESTER_1'
JOIN class_teachers class_teacher
  ON class_teacher.class_subject_id = class_subject.id
 AND class_teacher.active
WHERE school_class.class_code LIKE 'SAMPLE-%'
  AND '${sampleDataEnabled}'::boolean
ON CONFLICT ON CONSTRAINT uq_attendance_sessions_identity DO NOTHING;

INSERT INTO attendance_records (session_id, enrollment_id, class_id, status, note)
SELECT attendance_session.id,
       enrollment.id,
       school_class.id,
       CASE ((right(student.student_code, 3)::integer + day_map.day_number) % 4)
           WHEN 0 THEN 'PRESENT'
           WHEN 1 THEN 'EXCUSED'
           WHEN 2 THEN 'ABSENT'
           ELSE 'LATE'
       END,
       'Điểm danh dữ liệu mẫu'
FROM students student
JOIN classes school_class ON school_class.id = student.class_id
JOIN enrollments enrollment
  ON enrollment.student_id = student.id
 AND enrollment.class_id = school_class.id
 AND enrollment.academic_year = '2026-2027'
 AND enrollment.status = 'ACTIVE'
CROSS JOIN (VALUES
    (1, DATE '2026-09-07', 1),
    (2, DATE '2026-09-14', 6),
    (3, DATE '2026-09-21', 1)
) day_map(day_number, attendance_date, period)
JOIN attendance_sessions attendance_session
  ON attendance_session.class_id = school_class.id
 AND attendance_session.attendance_date = day_map.attendance_date
 AND attendance_session.period = day_map.period
 AND attendance_session.attendance_type = 'SUBJECT'
WHERE student.student_code LIKE 'SAMPLE-HS-%'
  AND school_class.class_code LIKE 'SAMPLE-%'
  AND '${sampleDataEnabled}'::boolean
ON CONFLICT (session_id, enrollment_id) DO NOTHING;

DO $$
DECLARE
    sample_data_enabled boolean := '${sampleDataEnabled}'::boolean;
    actual_count bigint;
BEGIN
    IF NOT sample_data_enabled THEN
        RETURN;
    END IF;

    SELECT count(*) INTO actual_count
    FROM teachers WHERE teacher_code LIKE 'SAMPLE-GV%';
    IF actual_count <> 10 THEN
        RAISE EXCEPTION 'Expected 10 sample teachers, found %', actual_count;
    END IF;

    SELECT count(*) INTO actual_count
    FROM classes WHERE class_code LIKE 'SAMPLE-%' AND status = 'ACTIVE';
    IF actual_count <> 10 THEN
        RAISE EXCEPTION 'Expected 10 active sample classes, found %', actual_count;
    END IF;

    IF EXISTS (
        SELECT 1 FROM classes
        WHERE class_code LIKE 'SAMPLE-%'
          AND (homeroom_teacher_id IS NULL OR max_students < 30)
    ) THEN
        RAISE EXCEPTION 'Every sample class needs a homeroom teacher and capacity for 30 students';
    END IF;

    IF EXISTS (
        SELECT 1
        FROM classes school_class
        LEFT JOIN students student
          ON student.class_id = school_class.id
         AND student.student_code LIKE 'SAMPLE-HS-%'
        WHERE school_class.class_code LIKE 'SAMPLE-%'
        GROUP BY school_class.id
        HAVING count(student.id) <> 30
    ) THEN
        RAISE EXCEPTION 'Each sample class must have exactly 30 sample students';
    END IF;

    SELECT count(*) INTO actual_count
    FROM students
    WHERE student_code LIKE 'SAMPLE-HS-%';
    IF actual_count <> 300 THEN
        RAISE EXCEPTION 'Expected 300 sample students, found %', actual_count;
    END IF;

    SELECT count(*) INTO actual_count
    FROM enrollments enrollment
    JOIN students student ON student.id = enrollment.student_id
    WHERE student.student_code LIKE 'SAMPLE-HS-%'
      AND enrollment.academic_year = '2026-2027'
      AND enrollment.status = 'ACTIVE';
    IF actual_count <> 300 THEN
        RAISE EXCEPTION 'Expected 300 active sample enrollments for 2026-2027, found %', actual_count;
    END IF;

    SELECT count(*) INTO actual_count
    FROM subjects WHERE subject_code LIKE 'SAMPLE-%' AND status = 'ACTIVE';
    IF actual_count <> 9 THEN
        RAISE EXCEPTION 'Expected 9 active sample subjects, found %', actual_count;
    END IF;

    SELECT count(*) INTO actual_count
    FROM class_leaders leader
    JOIN classes school_class ON school_class.id = leader.class_id
    WHERE school_class.class_code LIKE 'SAMPLE-%';
    IF actual_count <> 20 THEN
        RAISE EXCEPTION 'Expected 20 sample class leader records, found %', actual_count;
    END IF;

    SELECT count(*) INTO actual_count
    FROM class_teachers assignment
    JOIN class_subjects class_subject ON class_subject.id = assignment.class_subject_id
    JOIN classes school_class ON school_class.id = class_subject.class_id
    WHERE school_class.class_code LIKE 'SAMPLE-%'
      AND class_subject.academic_year = '2026-2027'
      AND assignment.active;
    IF actual_count <> 180 THEN
        RAISE EXCEPTION 'Expected 180 active class-subject assignments, found %', actual_count;
    END IF;

    SELECT count(*) INTO actual_count
    FROM users account
    JOIN teachers teacher ON teacher.id = account.teacher_id
    WHERE teacher.teacher_code LIKE 'SAMPLE-GV%';
    IF actual_count <> 10 THEN
        RAISE EXCEPTION 'Expected 10 sample teacher accounts, found %', actual_count;
    END IF;

    SELECT count(*) INTO actual_count
    FROM grades grade
    JOIN classes school_class ON school_class.id = grade.class_id
    WHERE school_class.class_code LIKE 'SAMPLE-%';
    IF actual_count <> 1200 THEN
        RAISE EXCEPTION 'Expected 1200 sample grades, found %', actual_count;
    END IF;

    SELECT count(DISTINCT assessment_type.code) INTO actual_count
    FROM grades grade
    JOIN classes school_class ON school_class.id = grade.class_id
    JOIN assessment_types assessment_type ON assessment_type.id = grade.assessment_type_id
    WHERE school_class.class_code LIKE 'SAMPLE-%';
    IF actual_count <> 5 THEN
        RAISE EXCEPTION 'Sample grades must cover all 5 assessment types, found %', actual_count;
    END IF;

    SELECT count(*) INTO actual_count
    FROM attendance_records record
    JOIN classes school_class ON school_class.id = record.class_id
    WHERE school_class.class_code LIKE 'SAMPLE-%';
    IF actual_count <> 900 THEN
        RAISE EXCEPTION 'Expected 900 sample attendance records, found %', actual_count;
    END IF;

    SELECT count(DISTINCT record.status) INTO actual_count
    FROM attendance_records record
    JOIN classes school_class ON school_class.id = record.class_id
    WHERE school_class.class_code LIKE 'SAMPLE-%';
    IF actual_count <> 4 THEN
        RAISE EXCEPTION 'Sample attendance must cover all 4 valid statuses, found %', actual_count;
    END IF;

    SELECT count(DISTINCT session.period) INTO actual_count
    FROM attendance_sessions session
    JOIN classes school_class ON school_class.id = session.class_id
    WHERE school_class.class_code LIKE 'SAMPLE-%'
      AND session.attendance_type = 'SUBJECT';
    IF actual_count <> 2 THEN
        RAISE EXCEPTION 'Sample attendance must cover both configured periods, found %', actual_count;
    END IF;

    IF EXISTS (
        SELECT 1
        FROM grades grade
        JOIN classes school_class ON school_class.id = grade.class_id
        JOIN enrollments enrollment ON enrollment.id = grade.enrollment_id
        JOIN class_subjects class_subject ON class_subject.id = grade.class_subject_id
        JOIN class_teachers assignment
          ON assignment.id = grade.class_teacher_id
         AND assignment.class_subject_id = grade.class_subject_id
        WHERE school_class.class_code LIKE 'SAMPLE-%'
          AND (
              enrollment.class_id <> grade.class_id
              OR enrollment.academic_year <> class_subject.academic_year
              OR class_subject.class_id <> grade.class_id
              OR grade.semester <> class_subject.semester
              OR grade.score < 0 OR grade.score > 10
          )
    ) THEN
        RAISE EXCEPTION 'Sample grade references or values are inconsistent';
    END IF;

    IF EXISTS (
        SELECT 1
        FROM attendance_records record
        JOIN classes school_class ON school_class.id = record.class_id
        JOIN enrollments enrollment ON enrollment.id = record.enrollment_id
        JOIN attendance_sessions session
          ON session.id = record.session_id
         AND session.class_id = record.class_id
        WHERE school_class.class_code LIKE 'SAMPLE-%'
          AND enrollment.class_id <> record.class_id
    ) THEN
        RAISE EXCEPTION 'Sample attendance references are inconsistent';
    END IF;
END $$;
