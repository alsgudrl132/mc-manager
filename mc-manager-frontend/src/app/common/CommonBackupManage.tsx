import { useQuery } from "@tanstack/react-query";
import { ArrowDown } from "lucide-react";
import React, { useState } from "react";
import { downloadBackup, getBackupList } from "../store/store";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { bytesToSize } from "@/utils/util";

interface IBackup {
  id: number;
  timestamp: number;
  name: string;
  size: number;
  userId: number;
  description: string;
}

function BackupManage() {
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

  const {
    data: backupListResponse,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["getBackupList"],
    queryFn: getBackupList,
  });

  // 백업 목록 데이터 접근
  const backupList = backupListResponse?.data?.data || [];

  // 페이지네이션을 위한 계산
  const totalItems = backupList.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  // 현재 페이지에 표시할 항목들
  const currentItems = backupList.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // 페이지 변경 핸들러
  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // 백업 파일 다운로드 핸들러
  const handleDownload = async (backup: IBackup) => {
    try {
      const response = await downloadBackup(backup.id);

      // Blob 객체 생성 및 다운로드 링크 만들기
      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = backup.name;
      document.body.appendChild(a);
      a.click();

      // 객체 정리
      window.URL.revokeObjectURL(url);
      a.remove();

      alert(`${backup.name} 다운로드가 시작되었습니다`);
    } catch (error) {
      console.error("다운로드 실패:", error);
      alert("파일 다운로드에 실패했습니다");
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>백업 관리</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">로딩 중...</div>
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>백업 관리</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4 text-red-500">
            백업 목록을 불러오는데 실패했습니다.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>백업 관리</CardTitle>
      </CardHeader>
      <CardContent>
        {currentItems.length === 0 ? (
          <div className="text-center py-4">백업 목록이 없습니다.</div>
        ) : (
          <>
            {/* 백업 목록 */}
            {currentItems.map((backup: IBackup) => (
              <div key={backup.id} className="border-b pb-3 mb-3">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{backup.name}</p>
                    <div className="flex gap-4 text-sm text-gray-500">
                      <p>{new Date(backup.timestamp).toLocaleString()}</p>
                      <p>{bytesToSize(backup.size)}</p>
                    </div>
                    {backup.description && (
                      <p className="text-sm text-gray-600 mt-1">
                        {backup.description}
                      </p>
                    )}
                  </div>
                  <div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownload(backup)}
                      className="flex items-center gap-1"
                    >
                      <ArrowDown size={16} />
                      <span>다운로드</span>
                    </Button>
                  </div>
                </div>
              </div>
            ))}

            {/* 페이지네이션 */}
            {totalPages > 1 && (
              <Pagination className="mt-4">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => handlePageChange(currentPage - 1)}
                      className={
                        currentPage === 1
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>

                  {/* 첫 페이지 */}
                  {currentPage > 2 && (
                    <PaginationItem>
                      <PaginationLink onClick={() => handlePageChange(1)}>
                        1
                      </PaginationLink>
                    </PaginationItem>
                  )}

                  {/* 생략 부호 */}
                  {currentPage > 3 && (
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                  )}

                  {/* 이전 페이지 */}
                  {currentPage > 1 && (
                    <PaginationItem>
                      <PaginationLink
                        onClick={() => handlePageChange(currentPage - 1)}
                      >
                        {currentPage - 1}
                      </PaginationLink>
                    </PaginationItem>
                  )}

                  {/* 현재 페이지 */}
                  <PaginationItem>
                    <PaginationLink isActive>{currentPage}</PaginationLink>
                  </PaginationItem>

                  {/* 다음 페이지 */}
                  {currentPage < totalPages && (
                    <PaginationItem>
                      <PaginationLink
                        onClick={() => handlePageChange(currentPage + 1)}
                      >
                        {currentPage + 1}
                      </PaginationLink>
                    </PaginationItem>
                  )}

                  {/* 생략 부호 */}
                  {currentPage < totalPages - 2 && (
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                  )}

                  {/* 마지막 페이지 */}
                  {currentPage < totalPages - 1 && (
                    <PaginationItem>
                      <PaginationLink
                        onClick={() => handlePageChange(totalPages)}
                      >
                        {totalPages}
                      </PaginationLink>
                    </PaginationItem>
                  )}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() => handlePageChange(currentPage + 1)}
                      className={
                        currentPage === totalPages
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}

export default BackupManage;
