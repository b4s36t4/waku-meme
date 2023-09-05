import { IDecodedMessage } from "@waku/sdk";
import { forwardRef, memo, useMemo } from "react";

import { useDecodePayload } from "@/hooks/useGeneratePayload";

interface Props {
  message: IDecodedMessage;
}

export const RenderMeme = memo(
  forwardRef<HTMLDivElement, Props>(({ message }, ref) => {
    const decodePayload = useDecodePayload();

    const meme = useMemo(() => {
      return decodePayload(message.payload);
    }, [decodePayload, message.payload]);

    const url = `https://olive-prominent-asp-641.mypinata.cloud/ipfs/${meme.hash}`;

    const openMeme = () => {
      window.open(url);
    };

    console.log(ref, "ref");

    return (
      <div
        ref={ref}
        onClick={openMeme}
        className="w-[500px] mb-4 mr-4 cursor-pointer group group-hover:border-0 rounded-xl px-4 py-2 h-full transition-all duration-150 ease-in-out flex flex-col space-y-2 relative border-2 border-gray-300"
      >
        <img src={url} alt={meme.description} />

        <div>
          <p className="text-xs">Posted On: {meme.timestamp}</p>
          <p className="text-sm font-bold">{meme.description}</p>
        </div>
        <div className="absolute bg-black hidden group-hover:block w-full rounded-xl !m-0 h-full inset-0 opacity-40">
          <span>Download</span>
        </div>
      </div>
    );
  })
);
