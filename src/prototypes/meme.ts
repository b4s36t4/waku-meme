import protobuf from "protobufjs";

export const Meme = new protobuf.Type("Meme")
  .add(new protobuf.Field("hash", 1, "string"))
  .add(new protobuf.Field("timestamp", 2, "uint64"))
  .add(new protobuf.Field("description", 3, "string"));
