import { BASE_URL, x_username } from "../constants/urls.js";

// 삭제버튼
const docsDeleteButton = document.getElementById("delete__button");

// 삭제 API 요청 함수
async function documentDelete(docId) {
  try {
    const response = await fetch(`${BASE_URL}/${docId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "x-username": x_username,
      },
    });
    if (!response.ok) {
      throw new Error("페이지 삭제 요청이 실패했습니다.");
    }
    const result = await response.json();
    console.log("페이지 삭제 성공", result);
    // 삭제 성공 후 필요한 작업 수행 (예: 페이지 리로드 또는 UI 업데이트)
  } catch (error) {
    console.error("페이지 삭제 중 오류 발생", error);
  }
}

docsDeleteButton.addEventListener("click", function () {
  const documentId = `${docId}`;
  documentDelete(documentId);
});
