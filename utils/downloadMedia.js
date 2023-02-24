export const downloadMedia = (e, mediaUrl) => {
  e.preventDefault();
  try {
    fetch(mediaUrl)
      .then((resp) => resp.blob())
      .then((blob) => {
        const Url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.style.display = "none";
        a.href = Url;

        const namesplit = mediaUrl.split("/");
        const duplicatename = namesplit.pop();
        a.download = "" + duplicatename + "";
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      })
      .catch((error) => {
        console.log("error while downloading ", error);
      });
  } catch (err) {
    console.log(err.message);
  }
};
