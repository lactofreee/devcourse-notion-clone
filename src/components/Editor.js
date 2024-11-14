<<<<<<< HEAD
// API 관련 함수들 가져오기
import { getTargetContent, AutoSave } from "../api/api.js";
=======
import { getTargetContent, AutoSave, editF } from "../api/api.js";
>>>>>>> develop

// 디바운스 타이머 변수
let debounceTimeout = null;

// 디바운스 저장 함수 - 마지막 입력 2초 후에 저장되도록
const debounceSave = async (docId, title, content) => {
  // 이전 타이머 있으면 취소
  if (debounceTimeout) {
    clearTimeout(debounceTimeout);
  }

  // 2초 후에 저장
  debounceTimeout = setTimeout(async () => {
    await AutoSave(docId, title, content);
  }, 2000);
};

// 에디터 초기화하는 함수
export const initializeEditor = async () => {
  // URL에서 문서 ID 가져오기
  const documentId = window.location.pathname.split("/documents/")[1];
  if (!documentId) return;

  // 제목, 내용 입력하는 곳 가져오기
  const titleElement = document.getElementById("editor__title-input");
  const contentElement = document.getElementById("editor__content-input");
  if (!titleElement || !contentElement) return;

  // 서버에서 문서 내용 가져와서
  const document = await getTargetContent(documentId);

  // 제목, 내용 채우기
  titleElement.value = document?.title || "";
  contentElement.value = document?.content || "";

  // 제목 수정하면 자동저장
  titleElement.addEventListener("input", () => {
    debounceSave(documentId, titleElement.value, contentElement.value);
  });

  // 내용 수정하면 자동저장
  contentElement.addEventListener("input", () => {
    debounceSave(documentId, titleElement.value, contentElement.value);
  });
};

// 11.14 수정
export const tempF = async () => {
  const documentList1 = document.querySelectorAll("#document-list li");
  documentList1.forEach((item) => {
    item.addEventListener("click", async () => {
      console.log(item.dataset.id);
      const temp = await getTargetContent(item.dataset.id);
      const title = document.querySelector(
        `#editor__title-input[data-id="${item.dataset.id}"]`
      );
      console.log(title);
      const content = document.querySelector(
        `#editor__content-input[data-id="${item.dataset.id}"]`
      );
      // 제목그리기
      title.addEventListener("keyup", async (e) => {
        console.log(e.currentTarget.value);
        await editF(item.dataset.id, e.currentTarget.value, temp.content);
        // const titleSide = document.querySelector(
        //   `#document-container-${item.dataset.id} div a`
        // );
        // console.log("title", titleSide);
      });
      content.addEventListener("keyup", async (e) => {
        await editF(item.dataset.id, temp.title, e.currentTarget.value);
      });
    });
  });
};
