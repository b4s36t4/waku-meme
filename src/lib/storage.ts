const IPFS_KEY = "ipfs_url";

const IPFS_API = "ipfs_api";

export const getIPFSGateway = () => {
  return localStorage.getItem(IPFS_KEY);
};

export const saveIPFSGateway = (value: string) => {
  localStorage.setItem(IPFS_KEY, value);
};

export const getIPFSAPI = () => {
  return localStorage.getItem(IPFS_API);
};

export const saveIPFSAPI = (value: string) => {
  localStorage.setItem(IPFS_API, value);
};
