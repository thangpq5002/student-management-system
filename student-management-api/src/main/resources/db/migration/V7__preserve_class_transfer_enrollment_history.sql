-- Allow a student to transfer classes during an academic year without
-- replacing the enrollment referenced by existing grades and attendance.
ALTER TABLE enrollments
    DROP CONSTRAINT uq_enrollments_student_year;

CREATE UNIQUE INDEX uq_enrollments_active_student_year
    ON enrollments (student_id, academic_year)
    WHERE status = 'ACTIVE';
