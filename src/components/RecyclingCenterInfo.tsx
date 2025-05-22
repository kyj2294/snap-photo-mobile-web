
import React from "react";
import { MapPin, Phone, Coins } from "lucide-react";
import BusinessHours from "./BusinessHours";

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

interface RecyclingCenterInfoProps {
  center: RecyclingCenter;
  selectedObjID: string | null;
  predictedClassName: string;
  openGoogleMaps: (address: string) => void;
  makePhoneCall: (phoneNumber: string) => void;
}

const RecyclingCenterInfo: React.FC<RecyclingCenterInfoProps> = ({
  center,
  selectedObjID,
  predictedClassName,
  openGoogleMaps,
  makePhoneCall
}) => {
  return (
    <li className="border-b border-gray-200 dark:border-gray-700 pb-2 last:border-0">
      <div className="font-semibold text-lg text-green-700 dark:text-green-500 cursor-pointer hover:text-green-600 hover:underline" onClick={() => center.positnRdnmAddr && openGoogleMaps(center.positnNm + ' ' + center.positnRdnmAddr)}>
        {center.positnNm || "이름 없는 센터"} 
        {center.objID === selectedObjID && <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">정확히 일치</span>}
        {predictedClassName === "볼펜" && <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">볼펜 전문 수거</span>}
      </div>
      
      {/* 센터 포인트 정보 표시 */}
      {center.point !== null && center.point > 0 && (
        <div className="text-sm text-blue-600 dark:text-blue-400 mt-0.5 flex items-center">
          <Coins className="w-3.5 h-3.5 mr-1 flex-shrink-0" />
          <span>포인트: {center.point}</span>
        </div>
      )}
      
      {/* 나머지 센터 정보 표시 */}
      {center.positnRdnmAddr && <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center mt-1">
          <MapPin className="w-3.5 h-3.5 mr-1 flex-shrink-0 cursor-pointer hover:text-blue-500" onClick={() => openGoogleMaps(center.positnRdnmAddr || '')} />
          <span className="cursor-pointer hover:text-blue-500 hover:underline" onClick={() => openGoogleMaps(center.positnRdnmAddr || '')}>
            {center.positnRdnmAddr}
          </span>
        </div>}
      
      {center.bscTelnoCn && <div className="text-sm text-gray-600 dark:text-gray-400 mt-0.5 flex items-center">
          <Phone className="w-3.5 h-3.5 mr-1 flex-shrink-0 text-blue-600" />
          <span className="cursor-pointer hover:text-blue-600 hover:underline" onClick={() => makePhoneCall(center.bscTelnoCn || '')}>
            {center.bscTelnoCn}
          </span>
        </div>}
      
      {center.prkMthdExpln && <div className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">
          🚗 <span className="font-medium">주차:</span> {center.prkMthdExpln}
        </div>}
      
      <BusinessHours 
        monHours={center.monSalsHrExplnCn}
        tuesHours={center.tuesSalsHrExplnCn}
        wedHours={center.wedSalsHrExplnCn}
        thurHours={center.thurSalsHrExplnCn}
        friHours={center.friSalsHrExplnCn}
        satHours={center.satSalsHrExplnCn}
        sunHours={center.sunSalsHrExplnCn}
      />
    </li>
  );
};

export default RecyclingCenterInfo;
