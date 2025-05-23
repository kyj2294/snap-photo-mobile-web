
// 재활용 센터 정보를 위한 타입 정의
export interface RecyclingCenter {
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
export interface PointInfo {
  objName: string;
  amount: number | null;
  centerPoint?: number | null;
}

// 예측 결과를 위한 타입 (기존 useImageClassifier에서 가져옴)
export interface Prediction {
  className: string;
  probability: number;
}
