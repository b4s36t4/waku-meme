const IPFS_KEY = "ipfs_url";
export const getIPFSURL = () => {
  return localStorage.getItem(IPFS_KEY);
};

export const saveIPFSURL = (value: string) => {
  localStorage.setItem(IPFS_KEY, value);
};
