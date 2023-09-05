import { Protocols, Waku, createLightNode, waitForRemotePeer } from "@waku/sdk";
import { useEffect, useState } from "react";

export const useWaku = () => {
  const [waku, setWaku] = useState<Waku>();
  const [wakuStatus, setWakuStatus] = useState("starting");

  useEffect(() => {
    setWakuStatus("starting");
    createLightNode({ defaultBootstrap: true }).then((_waku) => {
      _waku.start().then(() => {
        setWaku(_waku);
        setWakuStatus("loading");
      });
    });
  }, []);

  useEffect(() => {
    if (!waku || wakuStatus !== "loading") return;

    waitForRemotePeer(waku, [Protocols.Store, Protocols.Filter]).then(() => {
      setWakuStatus("connected");
    });
  }, [waku, wakuStatus]);

  return { waku, wakuStatus };
};
