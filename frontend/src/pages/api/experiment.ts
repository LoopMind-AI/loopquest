import { NextApiRequest, NextApiResponse } from "next";
import { maskPost } from "@/utils/mask_api";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    return maskPost(req, res, process.env.BACKEND_URL as string, "/experiment");
  } else {
    return res.status(405).json({ message: "Method not allowed" });
  }
}
