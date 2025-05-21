
import React from "react";
import { Prediction } from "@/hooks/useImageClassifier";

interface PredictionItemProps {
  prediction: Prediction;
  index: number;
}

const PredictionItem: React.FC<PredictionItemProps> = ({ prediction, index }) => {
  return (
    <li className="flex justify-between items-center">
      <span className="text-gray-800 dark:text-gray-200">
        {prediction.className}
      </span>
      <div className="flex items-center gap-2">
        <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full" 
            style={{ width: `${Math.round(prediction.probability * 100)}%` }}
          ></div>
        </div>
        <span className="text-gray-700 dark:text-gray-300 text-sm w-10 text-right">
          {Math.round(prediction.probability * 100)}%
        </span>
      </div>
    </li>
  );
};

export default PredictionItem;
