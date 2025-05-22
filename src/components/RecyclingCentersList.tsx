
import React from "react";
import { Building } from "lucide-react";
import RecyclingCenterInfo from "./RecyclingCenterInfo";

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

interface RecyclingCentersListProps {
  recyclingCenters: RecyclingCenter[];
  isLoading: boolean;
  selectedObjID: string | null;
  predictedClassName: string;
  openGoogleMaps: (address: string) => void;
  makePhoneCall: (phoneNumber: string) => void;
}

const RecyclingCentersList: React.FC<RecyclingCentersListProps> = ({
  recyclingCenters,
  isLoading,
  selectedObjID,
  predictedClassName,
  openGoogleMaps,
  makePhoneCall
}) => {
  return (
    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border-t border-blue-100 dark:border-blue-800/30">
      <div className="flex items-center gap-2 mb-2">
        <Building className="text-blue-600 dark:text-blue-400 w-5 h-5" />
        <h3 className="font-semibold">
          {predictedClassName === "볼펜" ? "볼펜 수거 가능 재활용 센터" : "인근 재활용 센터"}
        </h3>
      </div>
      
      {isLoading ? (
        <p className="text-gray-600 dark:text-gray-400 text-center py-2">재활용 센터 정보를 불러오는 중...</p>
      ) : recyclingCenters.length > 0 ? (
        <ul className="space-y-3">
          {recyclingCenters.map(center => (
            <RecyclingCenterInfo
              key={center.objID + center.positnNm}
              center={center}
              selectedObjID={selectedObjID}
              predictedClassName={predictedClassName}
              openGoogleMaps={openGoogleMaps}
              makePhoneCall={makePhoneCall}
            />
          ))}
        </ul>
      ) : (
        <p className="text-gray-600 dark:text-gray-400 text-center py-2">
          '{predictedClassName}'에 대한 재활용 센터 정보가 없습니다.
        </p>
      )}
    </div>
  );
};

export default RecyclingCentersList;
