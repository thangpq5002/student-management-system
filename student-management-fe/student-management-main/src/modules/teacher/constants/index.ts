import { TeacherStatus } from "../types";

export const TEACHER_STATUS_MAP: Record<
  TeacherStatus,
  { label: string; badgeVariant: "success" | "warning" | "error" | "neutral" }
> = {
  active: {
    label: "Đang giảng dạy",
    badgeVariant: "success",
  },
  leave: {
    label: "Nghỉ phép",
    badgeVariant: "warning",
  },
  transferred: {
    label: "Chuyển trường",
    badgeVariant: "neutral",
  },
};

export const DEPARTMENTS = [
  "Toán - Tin học",
  "Ngữ văn",
  "Khoa học Tự nhiên",
  "Khoa học Xã hội",
  "Ngoại ngữ",
  "Thể chất - Quốc phòng",
  "Nghệ thuật",
];
