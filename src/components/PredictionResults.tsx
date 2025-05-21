
import React, { useState, useEffect } from "react";
import { Prediction } from "@/hooks/useImageClassifier";
import { MapPin, Building, Phone } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
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
  prkMthdExpln?: string; // 주차 방법 정보 추가
}
const PredictionResults: React.FC<PredictionResultsProps> = ({
  prediction
}) => {
  const [recyclingCenters, setRecyclingCenters] = useState<RecyclingCenter[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedObjID, setSelectedObjID] = useState<string | null>(null);
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

          // 예측 결과를 objID로 간주하여 쿼리
          // 실제 구현에서는 예측 결과를 기반으로 objID를 결정하는 로직이 필요합니다
          const predictedObjID = topPrediction.className;
          setSelectedObjID(predictedObjID);

          // objID가 예측 결과와 일치하는 재활용 센터를 찾습니다
          const {
            data,
            error
          } = await supabase.from('renewalcenter').select('objID, positnNm, positnRdnmAddr, bscTelnoCn, clctItemCn, prkMthdExpln').eq('objID', predictedObjID);
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
            let query = supabase.from('renewalcenter').select('objID, positnNm, positnRdnmAddr, bscTelnoCn, clctItemCn, prkMthdExpln');
            if (topPrediction.className === "볼펜") {
              query = query.or(`clctItemCn.ilike.%볼펜%,clctItemCn.ilike.%필기구%`);
            } else if (topPrediction.className === "커피컵") {
              query = query.or(`clctItemCn.ilike.%커피컵%,clctItemCn.ilike.%종이컵%,clctItemCn.ilike.%일회용컵%`);
            } else if (topPrediction.className === "종이컵") {
              query = query.or(`clctItemCn.ilike.%종이컵%,clctItemCn.ilike.%일회용컵%,clctItemCn.ilike.%종이%`);
            }
            const limit = topPrediction.className === "볼펜" ? 5 : 3;
            query = query.limit(limit);
            const {
              data: fallbackData,
              error: fallbackError
            } = await query;
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

  // 구글 맵에서 위치 보기 기능
  const openGoogleMaps = (address: string) => {
    if (!address) return;

    // 주소를 URL 인코딩하여 구글 맵 URL 생성
    const encodedAddress = encodeURIComponent(address);
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;

    // 새 탭에서 구글 맵 열기
    window.open(googleMapsUrl, '_blank', 'noopener,noreferrer');
  };

  // 전화 걸기 기능 추가
  const makePhoneCall = (phoneNumber: string) => {
    if (!phoneNumber) return;
    
    // 전화번호에서 괄호와 하이픈 등 특수문자 제거
    const cleanPhoneNumber = phoneNumber.replace(/[^\d+]/g, '');
    
    // tel: 프로토콜을 사용하여 전화 걸기
    window.location.href = `tel:${cleanPhoneNumber}`;
  };

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
        </div>
        
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
                  <div className="font-semibold text-lg text-green-700 dark:text-green-500 cursor-pointer hover:text-green-600 hover:underline" onClick={() => center.positnRdnmAddr && openGoogleMaps(center.positnNm + ' ' + center.positnRdnmAddr)}>
                    {center.positnNm || "이름 없는 센터"} 
                    {center.objID === selectedObjID && <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">정확히 일치</span>}
                    {isItemPen && <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">볼펜 전문 수거</span>}
                  </div>
                  
                  {center.positnRdnmAddr && <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center mt-1">
                      <MapPin className="w-3.5 h-3.5 mr-1 flex-shrink-0 cursor-pointer hover:text-blue-500" onClick={() => openGoogleMaps(center.positnRdnmAddr || '')} />
                      <span className="cursor-pointer hover:text-blue-500 hover:underline" onClick={() => openGoogleMaps(center.positnRdnmAddr || '')}>
                        {center.positnRdnmAddr}
                      </span>
                    </div>}
                  
                  {center.bscTelnoCn && <div className="text-sm text-gray-600 dark:text-gray-400 mt-0.5 flex items-center">
                      <Phone className="w-3.5 h-3.5 mr-1 flex-shrink-0 text-blue-600" />
                      <span 
                        className="cursor-pointer hover:text-blue-600 hover:underline" 
                        onClick={() => makePhoneCall(center.bscTelnoCn || '')}
                      >
                        {center.bscTelnoCn}
                      </span>
                    </div>}
                  
                  {center.prkMthdExpln && <div className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">
                      🚗 <span className="font-medium">주차:</span> {center.prkMthdExpln}
                    </div>}
                  
                  <div className="mt-2">
                    
                  </div>
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
