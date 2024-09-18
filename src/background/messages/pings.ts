import type { PlasmoMessaging } from "@plasmohq/messaging";

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  console.log("req", req);
  const message = "hello";
  res.send({
    message
  });
};

export default handler;
