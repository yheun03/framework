/**
 * 파일 업로드 값 변환과 파일 정보 처리에 사용하는 공통 유틸 함수 파일입니다.
 */
export function createUploadId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function formatBytes(bytes: number) {
  if (!bytes && bytes !== 0) return "-";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function buildUploadHelperText(options: {
  accept?: string;
  maxSizeBytes?: number;
  multiple?: boolean;
  maxCount?: number;
}) {
  const rules: string[] = [];

  if (options.accept) {
    rules.push(`허용 형식: ${options.accept}`);
  }

  if (options.maxSizeBytes) {
    rules.push(`최대 용량: ${formatBytes(options.maxSizeBytes)}`);
  }

  if (options.multiple && options.maxCount) {
    rules.push(`최대 ${options.maxCount}개`);
  }

  return rules.join(" / ");
}

export function isAcceptedUploadType(file: File, accept?: string) {
  if (!accept || accept === "*/*") return true;

  const acceptList = accept
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  if (!acceptList.length) return true;

  return acceptList.some((acceptItem) => {
    if (acceptItem.endsWith("/*")) {
      const baseType = acceptItem.replace("/*", "");
      return file.type.startsWith(`${baseType}/`);
    }

    if (acceptItem.startsWith(".")) {
      return file.name.toLowerCase().endsWith(acceptItem.toLowerCase());
    }

    return file.type === acceptItem;
  });
}
