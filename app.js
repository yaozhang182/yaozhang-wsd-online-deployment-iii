import { serve } from "./deps.js";
import { configure, renderFile } from "./deps.js";
import * as messagesService from "./services/messagesService.js";

configure({
  views: `${Deno.cwd()}/views/`,
});

const responseDetails = {
  headers: { "Content-Type": "text/html;charset=UTF-8" },
};

const redirectTo = (path) => {
  return new Response(`Redirecting to ${path}.`, {
    status: 303,
    headers: {
      "Location": path,
    },
  });
};

const addmassage = async (request) => {
  const formData = await request.formData();
  const sender = formData.get("sender");
  const message = formData.get("message");

  await messagesService.create(sender, message);
  return redirectTo("/");
};

const listMessage = async (request) => {
  const data = {
    messages: await messagesService.findAll(),
  };

  return new Response(await renderFile("count.eta", data), responseDetails);
};

const handleRequest = async (request) => {
  if (request.method === "POST") {
    return await addmassage(request);
  } else {
    return await listMessage(request);
  }
};

serve(handleRequest, { port: 7777 });