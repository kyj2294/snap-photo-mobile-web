
import { useState, useEffect } from "react";
import * as tmImage from "@teachablemachine/image";
import { useToast } from "@/hooks/use-toast";

export interface Prediction {
  className: string;
  probability: number;
}

// 모델 URL을 상대 경로로 설정 (배포 환경 고려)
const MODEL_URL = "./model/model.json";
const METADATA_URL = "./model/metadata.json";

export function useImageClassifier() {
  const [model, setModel] = useState<tmImage.CustomMobileNet | null>(null);
  const [modelLoading, setModelLoading] = useState(false);
  const [predicting, setPredicting] = useState(false);
  const [prediction, setPrediction] = useState<Prediction[] | null>(null);
  const [modelLoadAttempted, setModelLoadAttempted] = useState(false);
  const [modelLoadAttempts, setModelLoadAttempts] = useState(0);
  const { toast } = useToast();

  // 모델 로드하기
  useEffect(() => {
    const loadModel = async () => {
      // 이미 모델이 로드되었거나 로드 시도 중이면 다시 시도하지 않음
      if (model || modelLoading || modelLoadAttempts >= 3) { // 최대 시도 횟수 3회로 증가
        return;
      }

      try {
        setModelLoading(true);
        setModelLoadAttempted(true);
        
        console.log("모델 로드 시도 #" + (modelLoadAttempts + 1));
        console.log("모델 로드 경로:", MODEL_URL, METADATA_URL);
        
        // 먼저 파일 접근 가능한지 확인
        try {
          const modelResponse = await fetch(MODEL_URL);
          if (!modelResponse.ok) {
            throw new Error(`모델 파일을 로드할 수 없습니다: ${modelResponse.status}`);
          }
          
          const metadataResponse = await fetch(METADATA_URL);
          if (!metadataResponse.ok) {
            throw new Error(`메타데이터 파일을 로드할 수 없습니다: ${metadataResponse.status}`);
          }
          
          // 메타데이터 확인
          const metadata = await metadataResponse.json();
          console.log("메타데이터 로드 완료:", metadata);
        } catch (fetchError) {
          console.error("파일 접근 오류:", fetchError);
          throw fetchError;
        }
        
        // 모델 로드 타임아웃 설정 - 20초 후에 실패로 간주
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error("모델 로드 타임아웃")), 20000);
        });
        
        // 모델 로딩 시도
        const loadPromise = tmImage.load(MODEL_URL, METADATA_URL);
        
        // 타임아웃과 로드 중 먼저 완료되는 작업 처리
        const loadedModel = await Promise.race([loadPromise, timeoutPromise]) as tmImage.CustomMobileNet;
        console.log("모델 로드 완료!");
        
        setModel(loadedModel);
        
        toast({
          title: "모델 로드 완료",
          description: "이미지 분류 모델이 성공적으로 로드되었습니다.",
        });
      } catch (error) {
        console.error("Error loading model:", error);
        
        // 모델 로드 실패 시 사용자에게 알림
        if (modelLoadAttempts < 3) { // 최대 3번까지 시도
          setModelLoadAttempts(prev => prev + 1);
          toast({
            title: "모델 로드 재시도 중",
            description: "모델 로드에 실패했습니다. 다시 시도합니다.",
          });
          
          // 재시도 전 약간의 지연 시간 설정
          setTimeout(loadModel, 2000);
        } else {
          toast({
            title: "모델 로드 오류",
            description: "이미지 분류 모델을 불러오는데 실패했습니다. 모델 없이 진행합니다.",
            variant: "destructive",
          });
        }
      } finally {
        setModelLoading(false);
      }
    };
    
    // 페이지 로드 후 약간의 지연 시간을 두고 모델 로드 시작
    const timer = setTimeout(() => {
      loadModel();
    }, 1000);
    
    // Clean up function
    return () => {
      clearTimeout(timer);
    };
  }, [model, modelLoading, modelLoadAttempts, toast]);

  const classifyImage = async (canvas: HTMLCanvasElement) => {
    if (!model) {
      toast({
        title: "모델이 로드되지 않음",
        description: "이미지 분류 모델이 아직 준비되지 않았습니다. 모델 없이 진행합니다.",
        variant: "warning",
      });
      // 모델이 없어도 기본 UI 흐름은 유지되도록 함
      return null;
    }
    
    if (!canvas) {
      toast({
        title: "분류 오류",
        description: "이미지를 찾을 수 없습니다.",
        variant: "destructive",
      });
      return null;
    }

    try {
      setPredicting(true);
      
      // Classify the image
      const predictions = await model.predict(canvas);
      
      setPrediction(predictions);
      
      toast({
        title: "이미지 분류 완료",
        description: `가장 높은 확률: ${predictions[0].className} (${(predictions[0].probability * 100).toFixed(2)}%)`,
      });
      
      return predictions;
    } catch (error) {
      console.error("Error classifying image:", error);
      toast({
        title: "분류 오류",
        description: "이미지 분류 중 오류가 발생했습니다.",
        variant: "destructive",
      });
      return null;
    } finally {
      setPredicting(false);
    }
  };

  return {
    model,
    modelLoading,
    modelLoadAttempted,
    predicting,
    prediction,
    setPrediction,
    classifyImage
  };
}
