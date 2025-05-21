
import React from "react";

interface RecyclingGuideInfo {
  type: string;
  method: string;
  tips: string[];
}

interface RecyclingGuideProps {
  className: string;
}

const RecyclingGuide: React.FC<RecyclingGuideProps> = ({ className }) => {
  // 분리수거 가이드 정보 (실제로는 DB나 API에서 가져올 수 있음)
  const recyclingGuides: {
    [key: string]: RecyclingGuideInfo;
  } = {
    "커피컵": {
      type: "일반쓰레기",
      method: "음식물 잔여물 제거 필수",
      tips: [
        "커피컵은 내부에 알루미늄 코팅이 되어 있어 재활용이 어렵습니다", 
        "깨끗이 씻어서 버리면 환경오염을 줄일 수 있습니다"
      ]
    },
    "종이컵": {
      type: "종이류",
      method: "깨끗이 씻어서 분리수거함에 배출",
      tips: [
        "내용물을 비우고 물로 헹궈 배출하세요", 
        "종이컵 안에 이물질이 없어야 재활용이 가능합니다"
      ]
    },
    "볼펜": {
      type: "플라스틱 및 금속 혼합",
      method: "분해하여 재질별로 분리배출",
      tips: [
        "플라스틱 외부는 플라스틱류로, 금속 부품은 고철류로 분리해주세요", 
        "잉크는 완전히 제거한 후 배출하는 것이 좋습니다", 
        "볼펜 전용 수거함이 있는 경우 이용하면 더욱 효과적입니다"
      ]
    }
  };

  // 기본 가이드 정보
  const defaultGuide = {
    type: "알 수 없음",
    method: "지역 분리수거 지침을 확인하세요",
    tips: ["정확한 분리배출 방법은 지자체 홈페이지에서 확인할 수 있습니다"]
  };

  // 현재 항목에 대한 가이드 정보 가져오기
  const guide = recyclingGuides[className] || defaultGuide;

  return (
    <div className="p-4 bg-green-50 dark:bg-green-900/20 border-t border-green-100 dark:border-green-800/30">
      <h3 className="font-semibold text-green-800 dark:text-green-400 mb-2">분리배출 가이드</h3>
      
      <div className="space-y-2">
        <div>
          <span className="font-medium text-gray-700 dark:text-gray-300">분류: </span>
          <span className="text-gray-800 dark:text-gray-200">{guide.type}</span>
        </div>
        
        <div>
          <span className="font-medium text-gray-700 dark:text-gray-300">방법: </span>
          <span className="text-gray-800 dark:text-gray-200">{guide.method}</span>
        </div>
        
        {guide.tips.length > 0 && (
          <div>
            <span className="font-medium text-gray-700 dark:text-gray-300">팁: </span>
            <ul className="list-disc list-inside text-gray-800 dark:text-gray-200 pl-1 space-y-1">
              {guide.tips.map((tip, index) => (
                <li key={index} className="text-sm">{tip}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecyclingGuide;
