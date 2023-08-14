import { maskGet } from "@/utils/mask_api";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { experiment_id } = req.query;
  if (req.method === "GET") {
    return maskGet(
      req,
      res,
      process.env.BACKEND_URL as string,
      `/step/exp/${experiment_id}/eps/max`
    );
  } else {
    return res.status(405).json({ message: "Method not allowed" });
  }
}
