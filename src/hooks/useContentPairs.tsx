import { createDecoder, createEncoder } from "@waku/sdk";

export const useContentPairs = () => {
  const decoder = createDecoder(import.meta.env.REACT_APP_MEME_CONTENT_TOP);
  const encoder = createEncoder({
    contentTopic: import.meta.env.REACT_APP_MEME_CONTENT_TOP,
    ephemeral: true,
  });

  return { decoder, encoder };
};
