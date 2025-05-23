
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Prediction, PointInfo } from "@/types/prediction";
import { useToast } from "@/hooks/use-toast";

export function usePointInfo(prediction: Prediction[] | null) {
  const [pointInfo, setPointInfo] = useState<PointInfo | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (prediction && prediction.length > 0) {
      const fetchPointInfo = async () => {
        try {
          // 최상위 예측 결과 가져오기
          const sortedPredictions = [...prediction].sort((a, b) => b.probability - a.probability);
          const topPrediction = sortedPredictions[0];

          // 예측된 objName으로 포인트 정보 조회 (bigObject 테이블)
          const { data: objData, error: objError } = await supabase
            .from('bigObject')
            .select('objName, amount')
            .eq('objName', topPrediction.className);

          // renewalCenter 테이블에서 포인트 정보 조회
          const { data: centerData, error: centerError } = await supabase
            .from('renewalcenter')
            .select('objID, point')
            .eq('objID', topPrediction.className);

          if (objError && centerError) {
            console.error('포인트 정보 조회 오류:', objError, centerError);
          } else {
            // 포인트 정보 설정
            const pointData = {
              objName: topPrediction.className,
              amount: objData && objData.length > 0 ? objData[0].amount : null,
              centerPoint: centerData && centerData.length > 0 ? centerData[0].point : null
            };
            
            setPointInfo(pointData);
          }
        } catch (error) {
          console.error('포인트 정보 조회 오류:', error);
        }
      };

      fetchPointInfo();
    }
  }, [prediction]);

  // 포인트 정보 계산
  const totalPoint = pointInfo ? (pointInfo.amount !== null ? pointInfo.amount : 0) + 
                            (pointInfo.centerPoint !== null ? pointInfo.centerPoint : 0) : 0;
  const hasPoint = totalPoint > 0 || (pointInfo && (pointInfo.amount !== null || pointInfo.centerPoint !== null));

  return { pointInfo, totalPoint, hasPoint };
}
