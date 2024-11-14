export const onDeleteButtonClick = () => {
  const deleteDocButton = document.getElementById("breadCrumb__deleteButton");
  console.log("cliked");
  deleteDocButton.addEventListener("click", onDeleteButtonClick);
};
