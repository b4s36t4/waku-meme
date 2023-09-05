import { Meme } from "@/prototypes";
import { useCallback } from "react";

export const useGeneratePayload = () => {
  return useCallback((message: Record<string, string | number>) => {
    const payload = Meme.encode(message).finish();
    return payload;
  }, []);
};

export const useDecodePayload = () => {
  return useCallback((payload: Uint8Array) => {
    const decodePayload = Meme.decode(payload);
    return decodePayload.toJSON();
  }, []);
};
