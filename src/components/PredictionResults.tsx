
import React from "react";
import { Prediction } from "@/hooks/useImageClassifier";

interface PredictionResultsProps {
  prediction: Prediction[] | null;
}

const PredictionResults: React.FC<PredictionResultsProps> = ({ prediction }) => {
  if (!prediction) return null;
  
  return (
    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm p-4 flex flex-col justify-end">
      <div className="bg-black/60 rounded-lg p-4 border border-white/10">
        <h3 className="text-white text-lg font-bold mb-2">분류 결과</h3>
        <ul className="space-y-2">
          {prediction.slice(0, 3).map((pred, index) => (
            <li key={index} className="flex justify-between items-center">
              <span className="text-white">{pred.className}</span>
              <div className="w-full max-w-32 bg-gray-700 rounded-full h-2.5 ml-2">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-2.5 rounded-full" 
                  style={{ width: `${pred.probability * 100}%` }}
                ></div>
              </div>
              <span className="text-white ml-2 text-sm">{(pred.probability * 100).toFixed(1)}%</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PredictionResults;
