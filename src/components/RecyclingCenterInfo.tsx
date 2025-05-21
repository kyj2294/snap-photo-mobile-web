
import React from "react";
import { MapPin, Phone, Building } from "lucide-react";

// 재활용 센터 정보를 위한 타입 정의
export interface RecyclingCenter {
  objID: string;
  positnNm: string;
  positnRdnmAddr?: string;
  bscTelnoCn?: string;
  clctItemCn?: string;
  prkMthdExpln?: string; // 주차 방법 정보 추가
}

interface RecyclingCenterInfoProps {
  centers: RecyclingCenter[];
  isLoading: boolean;
  selectedObjID: string | null;
  isItemPen: boolean;
}

const RecyclingCenterInfo: React.FC<RecyclingCenterInfoProps> = ({
  centers,
  isLoading,
  selectedObjID,
  isItemPen
}) => {
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

  return (
    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border-t border-blue-100 dark:border-blue-800/30">
      <div className="flex items-center gap-2 mb-2">
        <Building className="text-blue-600 dark:text-blue-400 w-5 h-5" />
        <h3 className="font-semibold">
          {isItemPen ? "볼펜 수거 가능 재활용 센터" : "인근 재활용 센터"}
        </h3>
      </div>
      
      {isLoading ? (
        <p className="text-gray-600 dark:text-gray-400 text-center py-2">재활용 센터 정보를 불러오는 중...</p>
      ) : centers.length > 0 ? (
        <ul className="space-y-3">
          {centers.map(center => (
            <li key={center.objID} className="border-b border-gray-200 dark:border-gray-700 pb-2 last:border-0">
              <div 
                className="font-semibold text-lg text-green-700 dark:text-green-500 cursor-pointer hover:text-green-600 hover:underline" 
                onClick={() => center.positnRdnmAddr && openGoogleMaps(center.positnNm + ' ' + center.positnRdnmAddr)}
              >
                {center.positnNm || "이름 없는 센터"} 
                {center.objID === selectedObjID && (
                  <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">정확히 일치</span>
                )}
                {isItemPen && (
                  <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">볼펜 전문 수거</span>
                )}
              </div>
              
              {center.positnRdnmAddr && (
                <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center mt-1">
                  <MapPin 
                    className="w-3.5 h-3.5 mr-1 flex-shrink-0 cursor-pointer hover:text-blue-500" 
                    onClick={() => openGoogleMaps(center.positnRdnmAddr || '')} 
                  />
                  <span 
                    className="cursor-pointer hover:text-blue-500 hover:underline" 
                    onClick={() => openGoogleMaps(center.positnRdnmAddr || '')}
                  >
                    {center.positnRdnmAddr}
                  </span>
                </div>
              )}
              
              {center.bscTelnoCn && (
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-0.5 flex items-center">
                  <Phone className="w-3.5 h-3.5 mr-1 flex-shrink-0 text-blue-600" />
                  <span 
                    className="cursor-pointer hover:text-blue-600 hover:underline" 
                    onClick={() => makePhoneCall(center.bscTelnoCn || '')}
                  >
                    {center.bscTelnoCn}
                  </span>
                </div>
              )}
              
              {center.prkMthdExpln && (
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">
                  🚗 <span className="font-medium">주차:</span> {center.prkMthdExpln}
                </div>
              )}
              
              <div className="mt-2"></div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-600 dark:text-gray-400 text-center py-2">
          재활용 센터 정보가 없습니다.
        </p>
      )}
    </div>
  );
};

export default RecyclingCenterInfo;
