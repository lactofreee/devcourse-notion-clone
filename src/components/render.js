import { getRootDocuments } from "../api/api.js";
const renderList = async () => {
  const documentList = document.getElementById("document-list");
  const docsJSON = await getRootDocuments();
  console.log(docsJSON);
};

export const render = () => {
  renderList();
};
