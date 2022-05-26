export const downloadObject = (object, filename) => {
  const link = document.createElement("a");
  link.style.display = "none";
  document.body.appendChild(link);

  link.href = URL.createObjectURL(object);
  link.download = filename;
  link.click();
};
