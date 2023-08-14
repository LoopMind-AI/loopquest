import { NextApiRequest, NextApiResponse } from "next";

async function maskPost(
  req: NextApiRequest,
  res: NextApiResponse,
  backend_url: string,
  route: string
) {
  if (!backend_url) {
    return res.status(500).json({ message: "Backend url is undefined" });
  }
  const response = await fetch(backend_url + route, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(req.body),
  });

  if (!response.ok) {
    console.log("response not ok");
    console.log(response);
    const errorData = await response.json();
    return res.status(response.status).json(errorData);
  }

  const responseData = await response.json();
  return res.status(200).json(responseData);
}

async function maskGet(
  req: NextApiRequest,
  res: NextApiResponse,
  backend_url: string,
  route: string
) {
  if (!backend_url) {
    return res.status(500).json({ message: "Backend url is undefined" });
  }

  const response = await fetch(`${backend_url}${route}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    console.log("response not ok");
    console.log(response);
    const errorData = await response.json();
    return res.status(response.status).json(errorData);
  }

  const responseData = await response.json();
  return res.status(200).json(responseData);
}

export { maskPost, maskGet };
