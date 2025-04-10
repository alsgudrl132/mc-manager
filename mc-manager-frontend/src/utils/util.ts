// 타임스탬프 포맷팅
export const formatTimestamp = (timestamp: number) => {
  const date = new Date(timestamp);

  // 날짜 부분
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  // 시간 부분
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

// 밀리초를 시간과 분으로 변환하는 함수 (패딩 포함)
export const formatMillisecondsToHoursMinutes = (ms: number) => {
  // 전체 분 계산 (밀리초 -> 초 -> 분)
  const totalMinutes = Math.floor(ms / (1000 * 60));

  // 시간과 분으로 분리
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  // 시간과 분을 문자열로 변환 (2자리로 패딩)
  const hoursStr = String(hours).padStart(2, "0");
  const minutesStr = String(minutes).padStart(2, "0");

  return `${hoursStr}h ${minutesStr}m`;
};

export function bytesToSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";

  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));

  // 소수점 둘째 자리까지 표시
  return parseFloat((bytes / Math.pow(1024, i)).toFixed(2)) + " " + sizes[i];
}
