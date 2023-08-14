import axios, { AxiosResponse } from "axios";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id, stream_image } = req.query;
  const url = `${process.env.BACKEND_URL}/experiment/${id}/run?stream_image=${stream_image}`;

  try {
    const response: AxiosResponse = await axios.get(url, {
      responseType: "stream",
    });
    res.setHeader("Content-Type", "text/event-stream");
    response.data.pipe(res);
  } catch (error: any) {
    console.log(error);
    res.status(error.response?.status || 500).json({ error: error.message });
  }
}

export const config = {
  api: {
    responseLimit: false,
  },
};
