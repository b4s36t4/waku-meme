import { IFilterSubscription, ILightPush, IStore, Waku } from "@waku/sdk";

type WakuStoreNode = Waku & { store: IStore };
type WakuFilterNode = Waku & { filter: IFilterSubscription };
type WakuPushNode = Waku & { lightPush: ILightPush };
