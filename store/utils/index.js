// External Package Imports
import imageCompression from "browser-image-compression";

export const pending = (state) => {
  state.isLoading = true;
};

export const rejected = (state, { payload }) => {
  state.isLoading = false;
  state.error = payload;
};

export const fulfilled = (state) => {
  state.isLoading = false;
  state.error = "";
};

export const compressImage = (
  dataurl,
  filename = new Date().getTime().toString()
) => {
  const arr = dataurl.split(",");

  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);

  while (n--) u8arr[n] = bstr.charCodeAt(n);

  const blob = new File([u8arr], filename, { type: "image/webp" });

  const compressionOptions = {
    maxSizeMB: 0.5,
    maxWidthOrHeight: 800,
    useWebWorker: true,
  };

  return new Promise((resolve, reject) => {
    imageCompression(blob, compressionOptions)
      .then((f) => resolve(f))
      .catch((error) => reject(error));
  });
};

export const uploadAsPromise = (storageRef, file) => {
  return new Promise((resolve, reject) => {
    resolve("df")
    // compressImage(file).then((result) => {
    //   uploadBytes(storageRef, result, { contentType: "image/webp" })
    //     .then((snapshot) => {
    //       getDownloadURL(snapshot.ref)
    //         .then((url) => resolve(url))
    //         .catch((error) => reject(error));
    //     })
    //     .catch((error) => reject(error));
    // });
  });
};
