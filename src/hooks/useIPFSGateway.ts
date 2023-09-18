import { useEffect, useState } from "react";

export const useIPFSGateway = () => {
  const [gateway, setGateway] = useState<string>();
  useEffect(() => {
    if (!window.ipfs) {
      // Use Public gateway
      setGateway("https://ipfs.io/ipfs/");
      return;
    }
  }, []);
};
