/**
 * 섹션 구성과 화면 표시 조건 처리에 사용하는 공통 유틸 함수 파일입니다.
 */
import { toCssSize } from "~/utils/css";

export type SectionDirection = "row" | "column";
export type SectionRatio = number[] | string | null;
export type SectionGap = number | string;

export function normalizeSectionGap(value: SectionGap) {
  return toCssSize(value);
}

export function normalizeSectionRatio(value: SectionRatio) {
  if (!value) return undefined;

  if (Array.isArray(value)) {
    return value.map((item) => `${item}fr`).join(" ");
  }

  return value;
}
