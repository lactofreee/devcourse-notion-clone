export const routes = new Map();

// // 기본 라우트 설정
// routes.set("/", {
//   title: "Home",
//   content: "Welcome to the Home Page",
// });

// 문서 랜딩 페이지 라우트 설정
routes.set("/", {
  title: "🧀 도시쥐와 시골쥐의 space",
  content: `1. side-bar 숨기기
좌상단의 space-name에 hover할 때 side-bar를 숨길 수 있는 버튼이 표시됩니다. 클릭하면 editor 영역을 확장하여 전체 보기를 제공합니다.

2. 새로운 document 생성
좌상단의 생성 버튼은 root document를, docment-list에서 hover했을 때 나타나는 버튼은 해당 document의 하위 document를 생성합니다.

3. breadcrumb 표시
editor 영역에 표시된 document path를 최상위 document / 상위 document / 현재 document 순으로 표시합니다.

4. document 삭제
tool-bar 내부의 삭제 버튼을 클릭하면 현재 editor 화면에 표시된 document가 삭제됩니다.`,
});

export const router = () => {
  const path = window.location.pathname;
  let pageData;

  // 정확한 경로 매칭 먼저 시도
  pageData = routes.get(path);

  // 정확한 매칭이 없을 경우, /documents/로 시작하는 경로인지 확인
  if (!pageData && path.startsWith("/documents/")) {
    return; // 동적 문서 경로는 별도 처리
  }

  // routes에 없는 경로의 경우
  if (!pageData) {
    pageData = {
      title: "404 Not Found",
      content: "The page does not exist.",
      disabled: true,
    };
  }

  const titleElement = document.getElementById("editor__title-input");
  const contentElement = document.getElementById("editor__content-input");

  // if (!titleElement || !contentElement) return;

  // titleElement.disabled = !!pageData.disabled;
  // contentElement.disabled = !!pageData.disabled;

  titleElement.value = pageData.title || "";
  contentElement.value = pageData.content || "";
};

export const navigate = (path) => {
  path = decodeURIComponent(path);
  window.history.pushState({}, path, window.location.origin + path);
  // router();
};

// // popstate 이벤트 리스너
// window.addEventListener("popstate", router);

// // 초기 라우팅
// window.addEventListener("DOMContentLoaded", () => {
//   // 랜딩 페이지 링크에 클릭 이벤트 추가
//   const landingLink = document.querySelector('a[href="/documents"]');
//   if (landingLink) {
//     landingLink.addEventListener("click", (e) => {
//       e.preventDefault();
//       navigate("/documents");
//     });
//   }

//   router();
// });
