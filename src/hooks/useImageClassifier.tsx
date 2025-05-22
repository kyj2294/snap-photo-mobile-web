
import { useState, useEffect, useRef } from "react";
import * as tmImage from "@teachablemachine/image";
import { useToast } from "@/hooks/use-toast";

export interface Prediction {
  className: string;
  probability: number;
}

export function useImageClassifier() {
  const [model, setModel] = useState<tmImage.CustomMobileNet | null>(null);
  const [modelLoading, setModelLoading] = useState(false);
  const [predicting, setPredicting] = useState(false);
  const [prediction, setPrediction] = useState<Prediction[] | null>(null);
  const { toast } = useToast();
  const modelLoadAttempted = useRef(false);

  // Load the TeacherMachine model
  useEffect(() => {
    // 모델 로드가 이미 시도되었는지 확인
    if (modelLoadAttempted.current) return;
    
    modelLoadAttempted.current = true;
    
    const loadModel = async () => {
      try {
        setModelLoading(true);
        
        // 모델 URL 설정 (public/model 폴더의 모델 파일 경로)
        const modelURL = "model/model.json";
        const metadataURL = "model/metadata.json";

        console.log("모델 로드 시도:", modelURL, metadataURL);
        
        // 메타데이터 먼저 로드하여 검증
        const metadataResponse = await fetch(metadataURL);
        if (!metadataResponse.ok) {
          throw new Error(`메타데이터 파일을 로드할 수 없습니다: ${metadataResponse.status}`);
        }
        const metadata = await metadataResponse.json();
        console.log("메타데이터 로드 완료:", metadata);
        
        // 모델 로드 시도 - 최대 2번까지만 시도
        let loadedModel = null;
        let attempts = 0;
        
        while (!loadedModel && attempts < 2) {
          try {
            attempts++;
            loadedModel = await tmImage.load(modelURL, metadataURL);
          } catch (err) {
            if (attempts >= 2) throw err;
            // 잠시 대기 후 재시도
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        }
        
        console.log("모델 로드 완료!");
        
        setModel(loadedModel);
        
        toast({
          title: "모델 로드 완료",
          description: "이미지 분류 모델이 성공적으로 로드되었습니다.",
        });
      } catch (error) {
        console.error("Error loading model:", error);
        toast({
          title: "모델 로드 오류",
          description: "이미지 분류 모델을 불러오는데 실패했습니다. 콘솔을 확인하세요.",
          variant: "destructive",
        });
      } finally {
        setModelLoading(false);
      }
    };
    
    // 1초 후에 모델 로드 시작 (초기 렌더링이 안정화된 후)
    const timer = setTimeout(() => {
      loadModel();
    }, 1000);
    
    // Clean up function
    return () => {
      clearTimeout(timer);
      if (model) {
        // Clean up model if needed
      }
    };
  }, []);

  const classifyImage = async (canvas: HTMLCanvasElement) => {
    if (!model || !canvas) {
      toast({
        title: "분류 오류",
        description: "이미지 또는 모델을 찾을 수 없습니다.",
        variant: "destructive",
      });
      return;
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
    predicting,
    prediction,
    setPrediction,
    classifyImage
  };
}
