import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Camera, Image, User, BarChart, Gift } from "lucide-react";
const NavigationBar = () => {
  const location = useLocation();

  // 현재 경로에 따라 활성화된 아이콘 스타일 설정
  const getActiveClass = (path: string) => {
    return location.pathname === path ? "text-green-500" : "text-gray-500 dark:text-gray-400";
  };
  return;
};
export default NavigationBar;