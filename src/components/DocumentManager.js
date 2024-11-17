import {
  getRootDocuments,
  postNewDocument,
  initializeDocumentContent,
  editF,
  getTargetContent,
  editContent,
} from "../api/api.js";
import { navigate, routes } from "../router/router.js";
// 추가 : breadcrumb 업데이트 기능 추가
import { updateBreadcrumb } from "./breadcrumb.js";

export const createDocumentsList = async () => {
  const documentList = document.getElementById("document-list");
  const docsJSON = await getRootDocuments();
  for (const doc of docsJSON) {
    await createDocumentItem(doc, documentList);
  }
};

// export const createDocumentsListCopy = async () => {
//   try {
//     // 추가 : DOM 요소 존재 여부 검증 로직
//     const documentList = document.getElementById("document-list");
//     if (!documentList) {
//       console.error("document-list 요소를 찾을 수 없습니다.");
//       return;
//     }

//     const docsJSON = await getRootDocuments();
//     console.log(docsJSON);
//     // 11.14 강수영수정
//     for (const doc of docsJSON) {
//       await createDocumentItem(doc, documentList);
//     }
//   } catch (error) {
//     console.error("문서 목록 가져오기 실패:", error);
//   }
// };

export const createDocumentItem = async (doc, parentElement = null) => {
  const path = `/documents/${doc.id}`;
  const getTitleContent = await getTargetContent(doc.id);
  const initialDocData = await editF(
    doc.id,
    getTitleContent.title,
    getTitleContent.content
  );

  routes.set(path, {
    id: initialDocData.id,
    title: initialDocData.title,
    content: initialDocData.content,
    parent: initialDocData.parent,
  });

  const newDocumentItem = document.createElement("li");
  newDocumentItem.id = `document-container-${doc.id}`;
  newDocumentItem.innerHTML = `
       <div class="document-content" id="document-${doc.id}">
            <div class="document-content--wrap">
              <button class="subDoc__button" id='subDocument-btn-${doc.id}'>
                <img
                  src="./src/asset/folder-open.svg"
                  alt=""
                />
              </button>
              <a href="#" class="document-link" data-url="doc${doc.id}">
                ${doc.title}
              </a>
            </div>
            <button class="add-subdoc-btn" data-parent-id="${doc.id}">+</button>
          </div>
    <ul class="sub-document-list" style="display: none;"></ul>
  `;

  // 수정 : 부모 요소 처리 로직 강화
  if (parentElement) {
    parentElement.appendChild(newDocumentItem);
  } else {
    const documentList = document.getElementById("document-list");
    if (documentList) {
      documentList.appendChild(newDocumentItem);
    } else {
      console.error("document-list 요소를 찾을 수 없습니다.");
    }
  }
  const subDocList = newDocumentItem.querySelector(".sub-document-list");
  if (doc.documents && doc.documents.length > 0) {
    for (const subdoc of doc.documents) {
      await createDocumentItem(subdoc, subDocList);
    }
  } else {
    const emptyBox = document.createElement("li");
    emptyBox.innerHTML = `
    <div class='emptyBox'>하위 페이지 없음</div>
    `;
    subDocList.append(emptyBox);
  }

  // // 추가 : hover 이벤트 추가
  // newDocumentItem.addEventListener("mouseenter", () => {
  //   newDocumentItem.classList.add("hover__document-item");
  // });

  // newDocumentItem.addEventListener("mouseleave", () => {
  //   newDocumentItem.classList.remove("hover__document-item");
  // });

  // 하위 문서 리스트 토글
  const subDocumentButton = document.querySelector(
    `#subDocument-btn-${doc.id}`
  );
  subDocumentButton.addEventListener("click", (event) => {
    event.stopPropagation();
    subDocumentButton.classList.toggle("subDoc__button--rotate");
    const subDocumentList = newDocumentItem.querySelector(".sub-document-list");
    subDocumentList.style.display =
      subDocumentList.style.display === "none" ? "block" : "none";
  });

  // 문서를 클릭했을 때의 로직
  newDocumentItem.addEventListener("click", async (e) => {
    e.stopPropagation();
    console.log("부모");
    // url 설정
    navigate(path);

    // breadcrumb 그리기
    await updateBreadcrumb(doc.id);

    //editor 그리기
    const documentData = await getTargetContent(doc.id);
    const editorTitle = document.querySelector("#editor__title-input");
    const editorContent = document.querySelector("#editor__content-input");
    editorTitle.value = documentData.title;
    editorContent.value = documentData.content;

    // 추가 : active 클래스 관리
    removeAllActiveClasses();
    document
      .querySelector(`#document-${doc.id}`)
      .classList.add("acitve__document-item");

    // // // 추가 : 하위 문서 클릭 시 이벤트 전파 중단
    // if (event.target.closest(".sub-document-list")) {
    //   event.stopPropagation(); // 버블링은 막되
    //   // 필요한 네비게이션과 문서 로드는 실행되도록
    //   const clickedLink = event.target.closest(".document-link");
    //   if (clickedLink) {
    //     const docId = clickedLink.dataset.url.replace("doc", "");
    //     navigate(`/documents/${docId}`);

    //     // 문서 내용 가져오기
    //     const docData = await getTargetContent(docId);
    //     // 편집기에 내용 표시
    //     const titleElement = document.getElementById("editor__title-input");
    //     const contentElement = document.getElementById("editor__content-input");

    //     titleElement.value = docData.title || "";
    //     contentElement.value = docData.content || "";

    //     // // breadcrumb 업데이트도 필요하다면
    //     // await updateBreadcrumb(docId);
    //   }
    //   return;
    // }
    // // 추가 : + 버튼 클릭 시 이벤트 중단
    // if (event.target.closest(".add-subdoc-btn")) return;

    const docData = await getTargetContent(doc.id);

    // titleElement.value = docData.title || "";
    // contentElement.value = docData.content || "";

    // titleElement.addEventListener("keyup", async (e) => {
    //   console.log(e.currentTarget.value);
    //   await editContent(doc.id, e.currentTarget.value, contentElement.value);
    // });
    // contentElement.addEventListener("keyup", async (e) => {
    //   console.log(e.currentTarget.value);
    //   await editContent(doc.id, titleElement.value, e.currentTarget.value);
    // });

    // titleElement.disabled = false;
    // contentElement.disabled = false;

    // // 추가 : breadcrumb 업데이트
    // await updateBreadcrumb(doc.id);
  });

  // 수정 : document 추가 버튼 이벤트 개선
  const addButton = newDocumentItem.querySelector(".add-subdoc-btn");
  if (addButton) {
    addButton.addEventListener("click", async (event) => {
      event.stopPropagation(); // 추가 : 이벤트 버블링 방지
      const parentId = event.target.dataset.parentId;
      if (parentId) {
        await addDoc(parentId);
      }
    });
  }
};

// 수정 : Root Document 생성 함수 개선
export const addRootDoc = async (e) => {
  try {
    e.stopPropagation();
    const newDocument = await postNewDocument("제목 없음");
    const documentList = document.getElementById("document-list");
    if (documentList) {
      await createDocumentItem(newDocument, documentList);
      navigate(`/documents/${newDocument.id}`);
    }
  } catch (error) {
    console.error("새 페이지 생성 실패:", error);
  }
};

// 수정 : 하위 페이지 생성 함수 개선
export const addDoc = async (parentId) => {
  // 추가 : 부모 요소 검증 강화
  const parentElement = document.getElementById(
    `document-container-${parentId}`
  );
  if (!parentElement) {
    console.error("부모 요소를 찾을 수 없습니다.");
    return;
  }

  const subDocumentList = parentElement.querySelector(".sub-document-list");
  console.log(subDocumentList);
  if (!subDocumentList) {
    console.error("하위 문서 목록 요소를 찾을 수 없습니다.");
    return;
  }

  try {
    const newDocument = await postNewDocument("제목 없음", parentId);
    await createDocumentItem(newDocument, subDocumentList);
    navigate(`/documents/${newDocument.id}`);

    // 추가 : 하위 문서 목록 표시 처리
    if (subDocumentList.style.display === "none") {
      subDocumentList.style.display = "block";
    }
  } catch (error) {
    console.error("하위 페이지 생성 실패:", error);
  }
};

// 추가 : 주석 처리된 이벤트 리스너
document.addEventListener("DOMContentLoaded", () => {
  const createButton = document.getElementById(
    "sidebar__createDocument--button"
  );
  if (createButton) {
    createButton.addEventListener("click", addRootDoc);
  }
});

// 추가 : active 클래스 관리를 위한 새로운 함수
const removeAllActiveClasses = () => {
  document.querySelectorAll(".document-content").forEach((container) => {
    container.classList.remove("acitve__document-item");
  });
};
// 홈으로 돌아가는 함수
export const goToHome = () => {
  navigate("");
  const editorTitle = document.querySelector("#editor__title-input");
  const editorContent = document.querySelector("#editor__content-input");
  editorTitle.value = "🧀 도시쥐와 시골쥐의 space";
  editorContent.value = `1. side-bar 숨기기
좌상단의 space-name에 hover할 때 side-bar를 숨길 수 있는 버튼이 표시됩니다. 클릭하면 editor 영역을 확장하여 전체 보기를 제공합니다.

2. 새로운 document 생성
좌상단의 생성 버튼은 root document를, docment-list에서 hover했을 때 나타나는 버튼은 해당 document의 하위 document를 생성합니다.

3. breadcrumb 표시
editor 영역에 표시된 document path를 최상위 document / 상위 document / 현재 document 순으로 표시합니다.

4. document 삭제
tool-bar 내부의 삭제 버튼을 클릭하면 현재 editor 화면에 표시된 document가 삭제됩니다.`;
};

//홈으로 돌아오기
document.querySelector("#sidebar__pageTitle").addEventListener("click", () => {
  goToHome();
});
