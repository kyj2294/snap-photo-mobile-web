import React, { useState, useEffect } from "react";
import { Prediction } from "@/hooks/useImageClassifier";
import { MapPin, AlertCircle, Recycle, Building } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
interface PredictionResultsProps {
  prediction: Prediction[] | null;
}

// 재활용 센터 정보를 위한 타입 정의
interface RecyclingCenter {
  objID: string;
  positnNm: string;
  positnRdnmAddr?: string;
  bscTelnoCn?: string;
  clctItemCn?: string; // 수거 가능 품목 정보 추가
}
const PredictionResults: React.FC<PredictionResultsProps> = ({
  prediction
}) => {
  const [recyclingCenters, setRecyclingCenters] = useState<RecyclingCenter[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const {
    toast
  } = useToast();
  useEffect(() => {
    if (prediction && prediction.length > 0) {
      const fetchRecyclingCenters = async () => {
        setIsLoading(true);
        try {
          // 최상위 예측 결과 가져오기
          const sortedPredictions = [...prediction].sort((a, b) => b.probability - a.probability);
          const topPrediction = sortedPredictions[0];

          // 예측 결과에 따라 필터링 조건 설정
          let query = supabase.from('renewalcenter').select('objID, positnNm, positnRdnmAddr, bscTelnoCn, clctItemCn');

          // 분석 결과에 따라 필터링
          if (topPrediction.className === "볼펜") {
            // 볼펜인 경우 특정 ObjID를 가진 센터 또는 clctItemCn에 '볼펜' 또는 '필기구'가 포함된 센터 찾기
            query = query.or(`clctItemCn.ilike.%볼펜%,clctItemCn.ilike.%필기구%`);
          } else if (topPrediction.className === "커피컵") {
            query = query.or(`clctItemCn.ilike.%커피컵%,clctItemCn.ilike.%종이컵%,clctItemCn.ilike.%일회용컵%`);
          } else if (topPrediction.className === "종이컵") {
            query = query.or(`clctItemCn.ilike.%종이컵%,clctItemCn.ilike.%일회용컵%,clctItemCn.ilike.%종이%`);
          }

          // 최대 결과 개수 제한
          const limit = topPrediction.className === "볼펜" ? 5 : 3;
          query = query.limit(limit);
          const {
            data,
            error
          } = await query;
          if (error) {
            console.error('재활용 센터 정보 조회 오류:', error);
            toast({
              title: "데이터 조회 오류",
              description: "재활용 센터 정보를 불러올 수 없습니다.",
              variant: "destructive"
            });
          } else if (data) {
            setRecyclingCenters(data);

            // 검색 결과가 없으면 토스트 메시지 표시
            if (data.length === 0) {
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
  }, [prediction]);
  if (!prediction) return null;

  // 확률 기준으로 내림차순 정렬
  const sortedPredictions = [...prediction].sort((a, b) => b.probability - a.probability);

  // 가장 높은 확률의 예측 결과
  const topPrediction = sortedPredictions[0];

  // 분리수거 가이드 정보 (실제로는 DB나 API에서 가져올 수 있음)
  const recyclingGuides: {
    [key: string]: {
      type: string;
      method: string;
      tips: string[];
    };
  } = {
    "커피컵": {
      type: "일반쓰레기",
      method: "음식물 잔여물 제거 필수",
      tips: ["커피컵은 내부에 알루미늄 코팅이 되어 있어 재활용이 어렵습니다", "깨끗이 씻어서 버리면 환경오염을 줄일 수 있습니다"]
    },
    "종이컵": {
      type: "종이류",
      method: "깨끗이 씻어서 분리수거함에 배출",
      tips: ["내용물을 비우고 물로 헹궈 배출하세요", "종이컵 안에 이물질이 없어야 재활용이 가능합니다"]
    },
    "볼펜": {
      type: "플라스틱 및 금속 혼합",
      method: "분해하여 재질별로 분리배출",
      tips: ["플라스틱 외부는 플라스틱류로, 금속 부품은 고철류로 분리해주세요", "잉크는 완전히 제거한 후 배출하는 것이 좋습니다", "볼펜 전용 수거함이 있는 경우 이용하면 더욱 효과적입니다"]
    }
  };

  // 기본 가이드 정보
  const defaultGuide = {
    type: "알 수 없음",
    method: "지역 분리수거 지침을 확인하세요",
    tips: ["정확한 분리배출 방법은 지자체 홈페이지에서 확인할 수 있습니다"]
  };

  // 분석된 물체에 대한 분리수거 가이드 정보
  const guide = recyclingGuides[topPrediction.className] || defaultGuide;

  // 현재 예측 결과가 "볼펜"인지 확인
  const isItemPen = topPrediction.className === "볼펜";
  return <div className="absolute inset-0 bg-black/50 backdrop-blur-sm p-4 flex flex-col justify-end">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div className="p-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white">
          <h2 className="text-xl font-bold text-center mb-2">분석 결과</h2>
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold">{topPrediction.className}</div>
            <div className="text-xl font-semibold">{Math.round(topPrediction.probability * 100)}%</div>
          </div>
          
          {/* 위치 정보 */}
          <div className="flex items-center mt-1 text-sm opacity-85">
            
            
          </div>
        </div>
        
        {/* 분리수거 방법 안내 */}
        <div className="p-4 bg-green-50 dark:bg-green-900/20 border-t border-b border-green-100 dark:border-green-800/30">
          <div className="flex items-center gap-2">
            <Recycle className="text-green-600 dark:text-green-400 w-5 h-5" />
            <div className="font-semibold text-lg">{guide.type}</div>
          </div>
          <p className="text-gray-700 dark:text-gray-300 mt-1">{guide.method}</p>
        </div>
        
        {/* 알아두면 좋은 팁 */}
        
        
        {/* 재활용 센터 정보 추가 */}
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border-t border-blue-100 dark:border-blue-800/30">
          <div className="flex items-center gap-2 mb-2">
            <Building className="text-blue-600 dark:text-blue-400 w-5 h-5" />
            <h3 className="font-semibold">
              {isItemPen ? "볼펜 수거 가능 재활용 센터" : "인근 재활용 센터"}
            </h3>
          </div>
          
          {isLoading ? <p className="text-gray-600 dark:text-gray-400 text-center py-2">재활용 센터 정보를 불러오는 중...</p> : recyclingCenters.length > 0 ? <ul className="space-y-3">
              {recyclingCenters.map(center => <li key={center.objID} className="border-b border-gray-200 dark:border-gray-700 pb-2 last:border-0">
                  <div className="font-semibold text-lg text-green-700 dark:text-green-500">
                    {center.positnNm || "이름 없는 센터"} 
                    {isItemPen && <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">볼펜 전문 수거</span>}
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">ID: {center.objID}</div>
                  {center.clctItemCn && <div className="text-sm text-gray-600 dark:text-gray-400 mt-1 italic">
                      <span className="font-medium">수거품목:</span> {center.clctItemCn}
                    </div>}
                  {center.positnRdnmAddr && <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center mt-1">
                      <MapPin className="w-3.5 h-3.5 mr-1 flex-shrink-0" />
                      <span>{center.positnRdnmAddr}</span>
                    </div>}
                  {center.bscTelnoCn && <div className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">
                      ☎️ {center.bscTelnoCn}
                    </div>}
                </li>)}
            </ul> : <p className="text-gray-600 dark:text-gray-400 text-center py-2">
              '{topPrediction.className}'에 대한 재활용 센터 정보가 없습니다.
            </p>}
        </div>
        
        {/* 다른 예측 결과들 */}
        <div className="p-4 bg-gray-50 dark:bg-gray-700/30 border-t border-gray-100 dark:border-gray-700">
          <h3 className="text-gray-700 dark:text-gray-300 text-sm font-medium mb-2">다른 가능성</h3>
          <ul className="space-y-2">
            {sortedPredictions.slice(1, 3).map((pred, index) => <li key={index} className="flex justify-between items-center">
                <span className="text-gray-800 dark:text-gray-200">{pred.className}</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full" style={{
                  width: `${Math.round(pred.probability * 100)}%`
                }}></div>
                  </div>
                  <span className="text-gray-700 dark:text-gray-300 text-sm w-10 text-right">
                    {Math.round(pred.probability * 100)}%
                  </span>
                </div>
              </li>)}
          </ul>
        </div>
      </div>
    </div>;
};
export default PredictionResults;