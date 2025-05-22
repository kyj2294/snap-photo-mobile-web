
import React from "react";
import { Coins } from "lucide-react";

// PointInfo 타입을 일관되게 정의 (centerPoint를 선택적으로 변경)
interface PointInfo {
  objName: string;
  amount: number | null;
  centerPoint?: number | null;  // ? 추가하여 선택적으로 변경
}

interface PredictionHeaderProps {
  className: string;
  probability: number;
  pointInfo: PointInfo | null;
  totalPoint: number;
  hasPoint: boolean;
}

const PredictionHeader: React.FC<PredictionHeaderProps> = ({
  className,
  probability,
  pointInfo,
  totalPoint,
  hasPoint
}) => {
  return (
    <div className="p-5 bg-gradient-to-r from-green-500 to-emerald-600 dark:from-green-600 dark:to-emerald-700 text-white rounded-t-xl shadow-lg border-b border-white/10">
      <h2 className="text-2xl font-bold text-center mb-3">분석 결과</h2>
      <div className="flex items-center justify-between mb-2">
        <div className="text-2xl font-bold flex items-center">
          <span className="bg-white/20 px-2 py-1 rounded-md">{className}</span>
        </div>
        <div className="text-xl font-semibold bg-emerald-700/50 px-3 py-1 rounded-full">
          {Math.round(probability * 100)}%
        </div>
      </div>
      
      {/* 포인트 정보 표시 - 모바일 최적화 및 시각적 개선 */}
      {pointInfo && (
        <div className="mt-3 p-3 bg-white/20 rounded-lg shadow-inner flex items-center justify-between">
          <div className="flex items-center">
            <Coins className="w-6 h-6 mr-2 text-yellow-300" />
            <span className="font-medium">수거 수수료:</span>
          </div>
          <div className="font-bold text-lg">
            {hasPoint ? (
              <span className="bg-emerald-700/70 px-3 py-1 rounded-full">{totalPoint} 포인트</span>
            ) : (
              <span className="opacity-75">수수료 없음</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PredictionHeader;
