import axios from "axios";
import { getIPFSAPI } from "./storage";

const defaultEnvUrl: string = import.meta.env.REACT_APP_IPFS_API;

export const uploadFile = async (file: File) => {
  const uploadURL = getIPFSAPI() ? getIPFSAPI() : defaultEnvUrl;
  if (!uploadURL) {
    throw new Error("No IPFS upload URL provided");
  }
  const formData = new FormData();

  formData.append("file", file);

  try {
    const { data } = await axios.post(`${uploadURL}/api/v0/add`, formData, {
      headers: {
        "Content-Type": "application/octet-stream",
      },
    });
    return data;
  } catch (e) {
    return { error: "Failed to upload image" };
  }
};
