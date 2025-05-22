
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface PointInfoProps {
  objName: string;
  amount: number | null;
  centerPoint: number | null;
  totalPoint: number;
  hasPoint: boolean;
}

const PointInfoTable: React.FC<PointInfoProps> = ({
  objName,
  amount,
  centerPoint,
  totalPoint,
  hasPoint
}) => {
  return (
    <div className="p-4 border-t border-gray-200 dark:border-gray-700">
      <Table className="w-full">
        <TableHeader>
          <TableRow>
            <TableHead>항목</TableHead>
            <TableHead className="text-right">수거 수수료 (포인트)</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium">{objName}</TableCell>
            <TableCell className="text-right">
              {hasPoint ? (
                <div>
                  {amount !== null && (
                    <div>기본 수수료: {amount}</div>
                  )}
                  {centerPoint !== null && centerPoint > 0 && (
                    <div>센터 추가 수수료: {centerPoint}</div>
                  )}
                  <div className="font-bold mt-1 pt-1 border-t">합계: {totalPoint}</div>
                </div>
              ) : "수수료 없음"}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};

export default PointInfoTable;
