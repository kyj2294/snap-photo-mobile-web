
import React, { useState, useEffect } from "react";
import { Prediction } from "@/hooks/useImageClassifier";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import PredictionHeader from "./PredictionHeader";
import RecyclingCentersList from "./RecyclingCentersList";
import PointInfoTable from "./PointInfoTable";
import { openGoogleMaps, makePhoneCall } from "./utils/mapUtils";

interface PredictionResultsProps {
  prediction: Prediction[] | null;
}

// 재활용 센터 정보를 위한 타입 정의
interface RecyclingCenter {
  objID: string;
  positnNm: string;
  positnRdnmAddr?: string;
  bscTelnoCn?: string;
  clctItemCn?: string;
  prkMthdExpln?: string;
  monSalsHrExplnCn?: string;
  tuesSalsHrExplnCn?: string;
  wedSalsHrExplnCn?: string;
  thurSalsHrExplnCn?: string;
  friSalsHrExplnCn?: string;
  satSalsHrExplnCn?: string;
  sunSalsHrExplnCn?: string;
  point?: number | null;
}

// 포인트 정보를 위한 타입 정의
interface PointInfo {
  objName: string;
  amount: number | null;
  centerPoint?: number | null;
}

const PredictionResults: React.FC<PredictionResultsProps> = ({
  prediction
}) => {
  const [recyclingCenters, setRecyclingCenters] = useState<RecyclingCenter[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedObjID, setSelectedObjID] = useState<string | null>(null);
  const [pointInfo, setPointInfo] = useState<PointInfo | null>(null);
  const { toast } = useToast();

  // 예측 결과에 따른 포인트 정보 조회
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

  useEffect(() => {
    if (prediction && prediction.length > 0) {
      const fetchRecyclingCenters = async () => {
        setIsLoading(true);
        try {
          // 최상위 예측 결과 가져오기
          const sortedPredictions = [...prediction].sort((a, b) => b.probability - a.probability);
          const topPrediction = sortedPredictions[0];

          // 예측 결과를 objID로 간주하여 쿼리
          const predictedObjID = topPrediction.className;
          setSelectedObjID(predictedObjID);

          // objID가 예측 결과와 일치하는 재활용 센터를 찾습니다
          const { data, error } = await supabase
            .from('renewalcenter')
            .select('objID, positnNm, positnRdnmAddr, bscTelnoCn, clctItemCn, prkMthdExpln, monSalsHrExplnCn, tuesSalsHrExplnCn, wedSalsHrExplnCn, thurSalsHrExplnCn, friSalsHrExplnCn, satSalsHrExplnCn, sunSalsHrExplnCn, point')
            .eq('objID', predictedObjID);
          
          if (error) {
            console.error('재활용 센터 정보 조회 오류:', error);
            toast({
              title: "데이터 조회 오류",
              description: "재활용 센터 정보를 불러올 수 없습니다.",
              variant: "destructive"
            });
          } else if (data && data.length > 0) {
            setRecyclingCenters(data);
          } else {
            // objID로 정확히 찾을 수 없는 경우 이전 방식으로 검색
            let query = supabase
              .from('renewalcenter')
              .select('objID, positnNm, positnRdnmAddr, bscTelnoCn, clctItemCn, prkMthdExpln, monSalsHrExplnCn, tuesSalsHrExplnCn, wedSalsHrExplnCn, thurSalsHrExplnCn, friSalsHrExplnCn, satSalsHrExplnCn, sunSalsHrExplnCn, point');
            
            if (topPrediction.className === "볼펜") {
              query = query.or(`clctItemCn.ilike.%볼펜%,clctItemCn.ilike.%필기구%`);
            } else if (topPrediction.className === "커피컵") {
              query = query.or(`clctItemCn.ilike.%커피컵%,clctItemCn.ilike.%종이컵%,clctItemCn.ilike.%일회용컵%`);
            } else if (topPrediction.className === "종이컵") {
              query = query.or(`clctItemCn.ilike.%종이컵%,clctItemCn.ilike.%일회용컵%,clctItemCn.ilike.%종이%`);
            }
            
            const limit = topPrediction.className === "볼펜" ? 5 : 3;
            query = query.limit(limit);
            
            const { data: fallbackData, error: fallbackError } = await query;
            
            if (fallbackError) {
              console.error('대체 검색 오류:', fallbackError);
              toast({
                title: "데이터 조회 오류",
                description: "재활용 센터 정보를 불러올 수 없습니다.",
                variant: "destructive"
              });
            } else if (fallbackData) {
              setRecyclingCenters(fallbackData);
            }
            
            if (!fallbackData || fallbackData.length === 0) {
              toast({
                title: "검색 결과 없음",
                description: `'${topPrediction.className}'에 대한 재활용 센터를 찾을 수 없습니다.`,
                variant: "default"
              });
            }
          }
        } catch (error) {
          console.error('재활용 센터 데이터 요청 실패:', error);
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchRecyclingCenters();
    }
  }, [prediction, toast]);

  if (!prediction) return null;

  // 확률 기준으로 내림차순 정렬
  const sortedPredictions = [...prediction].sort((a, b) => b.probability - a.probability);

  // 가장 높은 확률의 예측 결과
  const topPrediction = sortedPredictions[0];

  // 포인트 정보 계산
  const totalPoint = pointInfo ? (pointInfo.amount !== null ? pointInfo.amount : 0) + 
                               (pointInfo.centerPoint !== null ? pointInfo.centerPoint : 0) : 0;
  const hasPoint = totalPoint > 0 || (pointInfo && (pointInfo.amount !== null || pointInfo.centerPoint !== null));

  return (
    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm p-4 flex flex-col justify-end">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <PredictionHeader 
          className={topPrediction.className}
          probability={topPrediction.probability}
          pointInfo={pointInfo}
          totalPoint={totalPoint}
          hasPoint={hasPoint}
        />
        
        <RecyclingCentersList 
          recyclingCenters={recyclingCenters}
          isLoading={isLoading}
          selectedObjID={selectedObjID}
          predictedClassName={topPrediction.className}
          openGoogleMaps={openGoogleMaps}
          makePhoneCall={makePhoneCall}
        />
        
        {/* 포인트 정보 테이블로 표시 (별도 섹션) */}
        {pointInfo && (
          <PointInfoTable 
            objName={pointInfo.objName}
            amount={pointInfo.amount}
            centerPoint={pointInfo.centerPoint || null}
            totalPoint={totalPoint}
            hasPoint={hasPoint}
          />
        )}
      </div>
    </div>
  );
};

export default PredictionResults;
