import { createDocumentsList } from "./components/DocumentManager.js";
import { initializeEditor } from "./components/Editor.js";
import { setEventListener } from "./listeners/CreateNewDocListener.js";
import { router } from "./router/router.js";
import { initializeBreadcrumb } from "./components/breadcrumb.js";
import { render } from "./components/render.js";

// 돔이 다시 그려질때 다음 콜백함수 실행
document.addEventListener("DOMContentLoaded", async () => {
  // 문서 목록을 관리할 요소 선택
  // const documentList = document.getElementById("sidebar__menuWrapper");
  // const createDocumentButton = document.getElementById(
  //   "sidebar__createDocument--button"
  // );
  // render();
  // 초기 라우팅 설정
  // router();

  // 이벤트 리스너 설정
  // setEventListener(documentList, createDocumentButton);

  // 문서 목록 생성
  await createDocumentsList();

  //11.14 강수영추가
  // await tempF();

  // 에디터 초기화
  initializeEditor();

  // breadcrumb 초기화
  // await initializeBreadcrumb();
});
