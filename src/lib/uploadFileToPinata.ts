import axios from "axios";

const url = "https://api.pinata.cloud/pinning/pinFileToIPFS";

const TOKEN = `Bearer ${import.meta.env.REACT_APP_PINATA_JWT}`;

export const uploadFile = async (file: File, options: string) => {
  const formData = new FormData();

  formData.append("file", file);
  formData.append("pinataMetadata", options);

  try {
    const { data } = await axios.post(url, formData, {
      headers: {
        Authorization: TOKEN,
      },
    });
    return data;
  } catch (e) {
    return { error: "Failed to upload image" };
  }
};
