import { maskGet } from "@/utils/mask_api";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { experiment_id, episode_id, step_id } = req.query;
  if (req.method === "GET") {
    return maskGet(
      req,
      res,
      process.env.BACKEND_URL as string,
      `/step/${experiment_id}-${episode_id}-${step_id}/image`
    );
  } else {
    return res.status(405).json({ message: "Method not allowed" });
  }
}
