import { StudentGradeRecord } from "../types";

export function calculateAverage(
  tx1: number | null,
  tx2: number | null,
  tx3: number | null,
  gk: number | null,
  ck: number | null,
): { avg: number | null; rank: StudentGradeRecord["rank"] } {
  if (
    tx1 === null ||
    tx2 === null ||
    tx3 === null ||
    gk === null ||
    ck === null
  ) {
    return { avg: null, rank: null };
  }
  const sum = tx1 + tx2 + tx3 + gk * 2 + ck * 3;
  const rawAvg = sum / 8;
  const avg = Math.round(rawAvg * 10) / 10;

  let rank: StudentGradeRecord["rank"] = "Chưa đạt";
  if (avg >= 8.0) rank = "Giỏi";
  else if (avg >= 6.5) rank = "Khá";
  else if (avg >= 5.0) rank = "Đạt";

  return { avg, rank };
}

export const initialGradeRows: StudentGradeRecord[] = [
  {
    id: "g-01",
    studentCode: "HS-100241",
    fullName: "Nguyễn Tuấn Anh",
    avatarInitials: "NA",
    tx1: 8.5,
    tx2: 9.0,
    tx3: 8.0,
    gk: 8.5,
    ck: 9.2,
    avgScore: 8.8,
    rank: "Giỏi",
  },
  {
    id: "g-02",
    studentCode: "HS-100242",
    fullName: "Trần Thị Ngọc Bích",
    avatarInitials: "TB",
    tx1: 7.0,
    tx2: 6.5,
    tx3: 7.5,
    gk: 7.0,
    ck: 6.8,
    avgScore: 6.9,
    rank: "Khá",
  },
  {
    id: "g-03",
    studentCode: "HS-100243",
    fullName: "Lê Quốc Cường",
    avatarInitials: "LC",
    tx1: 9.5,
    tx2: 10.0,
    tx3: 9.0,
    gk: 9.5,
    ck: 9.8,
    avgScore: 9.6,
    rank: "Giỏi",
  },
  {
    id: "g-04",
    studentCode: "HS-100244",
    fullName: "Phạm Thùy Dương",
    avatarInitials: "PD",
    tx1: 5.5,
    tx2: 6.0,
    tx3: 5.0,
    gk: 6.5,
    ck: 6.0,
    avgScore: 5.9,
    rank: "Đạt",
  },
  {
    id: "g-05",
    studentCode: "HS-100245",
    fullName: "Hoàng Gia Huy",
    avatarInitials: "HH",
    tx1: 4.0,
    tx2: 5.0,
    tx3: 4.5,
    gk: 5.0,
    ck: 4.5,
    avgScore: 4.6,
    rank: "Chưa đạt",
  },
  {
    id: "g-06",
    studentCode: "HS-100246",
    fullName: "Đỗ Đăng Khoa",
    avatarInitials: "DK",
    tx1: 8.0,
    tx2: 7.5,
    tx3: 8.5,
    gk: 8.0,
    ck: 8.5,
    avgScore: 8.2,
    rank: "Giỏi",
  },
  {
    id: "g-07",
    studentCode: "HS-100247",
    fullName: "Vũ Khánh Linh",
    avatarInitials: "VL",
    tx1: 9.0,
    tx2: 9.5,
    tx3: 9.0,
    gk: 8.5,
    ck: 9.0,
    avgScore: 8.9,
    rank: "Giỏi",
  },
  {
    id: "g-08",
    studentCode: "HS-100248",
    fullName: "Bùi Hoàng Nam",
    avatarInitials: "BN",
    tx1: 7.5,
    tx2: 7.0,
    tx3: 6.5,
    gk: 7.5,
    ck: 7.2,
    avgScore: 7.2,
    rank: "Khá",
  },
];
