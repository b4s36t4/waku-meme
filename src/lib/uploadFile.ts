import axios from "axios";

const url: string = import.meta.env.REACT_APP_IPFS_API;

export const uploadFile = async (file: File, options: string) => {
  if (!url) {
    throw new Error("No IPFS upload URL provided");
  }
  const formData = new FormData();

  formData.append("file", file);
  formData.append("fileName", options);

  try {
    const { data } = await axios.post(url, formData, {
      headers: {
        "Content-Type": "application/octet-stream",
      },
    });
    return data;
  } catch (e) {
    return { error: "Failed to upload image" };
  }
};
