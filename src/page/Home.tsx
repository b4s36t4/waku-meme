import { toast } from "react-hot-toast";
import uniq from "lodash/uniq";
import {
  ChangeEventHandler,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useInView } from "react-intersection-observer";
import {
  useWaku,
  useContentPair,
  useStoreMessages,
  useFilterMessages,
  useLightPush,
} from "@waku/react";
import { Cursor, IDecodedMessage, PageDirection, waku } from "@waku/sdk";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { uploadFile } from "@/lib/uploadFile";
import { useGeneratePayload } from "@/hooks/useGeneratePayload";
import { WakuFilterNode, WakuPushNode, WakuStoreNode } from "@/type";
import { RenderMeme } from "@/components/Meme";
import sortBy from "lodash/sortBy";
import {
  getIPFSAPI,
  getIPFSGateway,
  saveIPFSGateway,
  saveIPFSAPI,
} from "@/lib/storage";

const PAGE_SIZE = 10;

export const Home = () => {
  // Waku node hook
  const { node } = useWaku();

  const [messages, setMessages] = useState<IDecodedMessage[]>([]);

  const { ref, inView } = useInView({ threshold: 0.5, delay: 500 });

  const [cursor, setCursor] = useState<Cursor>();

  // State to manage the view to upload a meme
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState<File | null>();

  const [description, setDescription] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);

  const [uploadEnabled, setUploadEnabled] = useState(false);

  // Waku hooks to communicate with waku service
  const { decoder, encoder } = useContentPair();

  const [settingsOpen, setSettingsOpen] = useState(false);

  // Default Brave IPFS localnode
  const [ipfsURL, setIPFSURL] = useState("http://127.0.0.1:48080");
  const [ipfsAPI, setIPFSAPI] = useState("http://127.0.0.1:45001");

  const { messages: storedMessages, isLoading: isStoredMessageLoading } =
    useStoreMessages({
      // Casting the type because of type mis-match
      node: node as WakuStoreNode,
      decoder,
      options: {
        pageDirection: PageDirection.BACKWARD,
        pageSize: PAGE_SIZE,
        cursor: cursor,
      },
    });

  const { messages: filteredMessages, isLoading: isFilterLoading } =
    useFilterMessages({
      node: node as WakuFilterNode,
      decoder,
    });

  useEffect(() => {
    // Merge newly receive meme with existing memes
    setMessages((prev) => [...filteredMessages, ...prev]);
    () => {
      setMessages([]);
    };
  }, [filteredMessages]);

  useEffect(() => {
    const gateway = getIPFSGateway();
    const _ipfsAPI = getIPFSAPI();
    if (!gateway || !_ipfsAPI) {
      setSettingsOpen(true);
      return;
    }
    setIPFSURL(gateway);
    setIPFSAPI(_ipfsAPI);
  }, []);

  useEffect(() => {
    // Merge newly created memes at the end.
    setMessages((prev) => uniq([...prev, ...storedMessages]));
    () => {
      setMessages([]);
    };
  }, [storedMessages]);

  const calculateCursor = useCallback(async () => {
    const lastMessage = messages[messages.length - 1];
    const _cursor = await waku.createCursor(lastMessage);
    setCursor(_cursor);
  }, [messages]);

  useEffect(() => {
    if (inView) {
      calculateCursor();
    }
  }, [calculateCursor, inView]);

  const { push } = useLightPush({ encoder, node: node as WakuPushNode });
  const generatePayload = useGeneratePayload();

  const onClickUpload = useCallback(() => {
    setUploadEnabled(true);
  }, []);

  const onUpload = () => {
    inputRef.current?.click();
  };

  const onSelectFile: ChangeEventHandler<HTMLInputElement> = (e) => {
    const files = e.target.files;
    if (files?.length === 0) {
      toast("No file selected");
      return;
    }

    setFile(files?.item(0));
  };

  // Upload Image to IPFS & Return the Generated Hash to process further
  const uploadImage = useCallback(async () => {
    setUploading(true);

    if (!file) return;

    const res = await uploadFile(file);
    setUploading(false);
    if (res["error"]) {
      throw new Error("Failed to upload meme, re-check IPFS API Endpoint");
    }

    return res["Hash"] as string;
  }, [file]);

  // Show loading progress when Message is being generated.
  const onComplete = async () => {
    const hash = await toast.promise(uploadImage(), {
      loading: "Uploading...",
      success: "Meme uploaded",
      error: "Failed to upload your meme",
    });

    if (!hash) {
      setUploading(false);
      return;
    }

    // Convert payload into protobuffers
    const payload = generatePayload({
      hash,
      timestamp: Date.now(),
      description,
    });

    // Send message.
    push?.({ payload });
    setUploadEnabled(false);
  };

  const onSave = async () => {
    if (!ipfsURL || !ipfsAPI) {
      toast.error("Please enter values");
      return;
    }

    saveIPFSGateway(ipfsURL);
    saveIPFSAPI(ipfsAPI);
    setSettingsOpen(false);
    // Take effect of updated IPFS URL
    // window.location.reload();
  };

  const isLoading = isFilterLoading || isStoredMessageLoading || !node;

  if (isLoading) {
    return (
      <p className="flex items-center justify-center h-screen">Loading...</p>
    );
  }

  return (
    <>
      <div className="flex flex-col p-10 relative justify-center">
        <Button
          onClick={onClickUpload}
          className="fixed bottom-10 right-4 mx-auto"
        >
          Upload a Meme
        </Button>
        <Button
          onClick={() => {
            setSettingsOpen(true);
          }}
          className="fixed top-10 right-4 mx-auto"
        >
          &#9881;
        </Button>
        <div className="flex flex-col mt-20 mx-auto justify-center items-start">
          {messages.length > 0 &&
            sortBy(messages, (message) => message.timestamp)
              .reverse()
              .map((message, index) => {
                const isLastMessage = index === messages.length - 1;
                return (
                  <RenderMeme
                    ref={isLastMessage ? ref : null}
                    message={message}
                    key={message.timestamp?.getTime().toString()}
                  />
                );
              })}
          {messages.length === 0 && (
            <span className="flex items-center justify-center">
              No Memes found :(
            </span>
          )}
        </div>
      </div>
      <Dialog
        open={settingsOpen}
        onOpenChange={(open) => {
          setSettingsOpen(open);
        }}
      >
        <DialogContent>
          <div>
            <p>Configure IPFS API & Gateway</p>
            <div className="flex flex-col w-full">
              <p>Enter IPFS API URL</p>
              <input
                className="w-fill mt-2 p-1 px-2 border-[1px] outline-none rounded-md"
                placeholder="http://localhost:45001"
                type="url"
                value={ipfsAPI}
                onChange={(e) => {
                  setIPFSAPI(e.target.value);
                }}
              />
              <p>Enter IPFS Gateway URL</p>
              <input
                className="w-fill mt-2 p-1 px-2 border-[1px] outline-none rounded-md"
                placeholder="ipfs.io"
                type="url"
                value={ipfsURL}
                onChange={(e) => {
                  setIPFSURL(e.target.value);
                }}
              />
              <Button className="mt-2" onClick={onSave}>
                Save
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog
        open={uploadEnabled}
        onOpenChange={(open) => {
          setUploadEnabled(open);
          setUploading(false);
        }}
      >
        <DialogContent>
          <p>Upload your favorite meme</p>
          {file && (
            <p>
              <b>Selected :</b> {file.name}
            </p>
          )}
          <div
            onClick={onUpload}
            className="flex mt-4 border-[1px] border-dashed py-6 cursor-pointer items-center justify-center"
          >
            Click here to {file ? "Replace" : "upload"}
          </div>
          <input
            onChange={onSelectFile}
            max={1}
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
          />
          <textarea
            className="w-fill p-4 border-[1px] outline-none rounded-md"
            placeholder="Enter Description"
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
            }}
          />
          <Button disabled={uploading} onClick={onComplete}>
            Complete
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
};
