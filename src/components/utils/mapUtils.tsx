
import React from "react";

// 구글 맵에서 위치 보기 기능
export const openGoogleMaps = (address: string) => {
  if (!address) return;

  // 주소를 URL 인코딩하여 구글 맵 URL 생성
  const encodedAddress = encodeURIComponent(address);
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;

  // 새 탭에서 구글 맵 열기
  window.open(googleMapsUrl, '_blank', 'noopener,noreferrer');
};

// 전화 걸기 기능 추가
export const makePhoneCall = (phoneNumber: string) => {
  if (!phoneNumber) return;

  // 전화번호에서 괄호와 하이픈 등 특수문자 제거
  const cleanPhoneNumber = phoneNumber.replace(/[^\d+]/g, '');

  // tel: 프로토콜을 사용하여 전화 걸기
  window.location.href = `tel:${cleanPhoneNumber}`;
};
