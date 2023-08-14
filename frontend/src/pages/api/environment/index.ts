import { maskGet } from "@/utils/mask_api";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const { query } = req;
    return maskGet(
      req,
      res,
      process.env.BACKEND_URL as string,
      `/env?id=${query.id}`
    );
  } else {
    return res.status(405).json({ message: "Method not allowed" });
  }
}
