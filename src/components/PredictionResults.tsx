
import React from "react";
import { Prediction } from "@/hooks/useImageClassifier";

interface PredictionResultsProps {
  prediction: Prediction[] | null;
}

const PredictionResults: React.FC<PredictionResultsProps> = ({ prediction }) => {
  if (!prediction) return null;
  
  // Sort predictions by probability in descending order
  const sortedPredictions = [...prediction].sort((a, b) => b.probability - a.probability);
  
  // Get the highest probability prediction
  const topPrediction = sortedPredictions[0];
  
  return (
    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm p-4 flex flex-col justify-end">
      <div className="bg-black/60 rounded-lg p-4 border border-white/10">
        {/* Highlight the top result */}
        <div className="mb-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-3 shadow-lg">
          <h3 className="text-white text-xl font-bold">최고 확률 결과</h3>
          <div className="flex items-center justify-between mt-2">
            <span className="text-white text-lg font-semibold">{topPrediction.className}</span>
            <span className="text-white text-xl font-bold">{Math.round(topPrediction.probability * 100)}%</span>
          </div>
        </div>
        
        <h3 className="text-white text-lg font-bold mb-2">전체 결과</h3>
        <ul className="space-y-2">
          {sortedPredictions.slice(0, 3).map((pred, index) => (
            <li key={index} className="flex justify-between items-center">
              <span className="text-white">{pred.className}</span>
              <div className="w-full max-w-32 bg-gray-700 rounded-full h-2.5 ml-2">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-2.5 rounded-full" 
                  style={{ width: `${Math.round(pred.probability * 100)}%` }}
                ></div>
              </div>
              <span className="text-white ml-2 text-sm">{Math.round(pred.probability * 100)}%</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PredictionResults;
