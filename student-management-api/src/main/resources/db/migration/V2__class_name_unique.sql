-- V2: tên lớp (vd: 10A1) phải duy nhất, vì giao diện xác định lớp của học sinh theo tên lớp
ALTER TABLE classes ADD CONSTRAINT uq_classes_class_name UNIQUE (class_name);
