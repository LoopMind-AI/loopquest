import Link from "next/link";
import { GetStaticProps } from "next";
import { getTimeDelta } from "@/utils/time";
import { Environment } from "@/types/environment";
import Image from "next/image";

interface Props {
  envs: Environment[];
}

export default function Environments({ envs }: { envs: Environment[] }) {
  return (
    <div className="card">
      <div className="card-body">
        <h1 className="card-title text-2xl font-bold">Environments</h1>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-10 ml-20 mr-10">
          {envs.map((env) => (
            <Link key={env.id} href={`/env/${env.id}`}>
              <div className="card h-full bg-base-100 shadow-xl mb-4">
                <figure>
                  <Image
                    src={env.profile_image ? env.profile_image : "/favicon.svg"}
                    alt="Env"
                    width={300}
                    height={300}
                  />
                </figure>
                <div className="card-body">
                  <h2 className="card-title">{env.name}</h2>
                  <p>{env.description}</p>
                  <p>Updated {getTimeDelta(env.creation_time)}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  const url = process.env.BACKEND_URL + "/envs/all";
  try {
    const res = await fetch(url);
    if (!res.ok) {
      return {
        props: {
          envs: [],
        },
      };
    }
    const envs: Environment[] = await res.json();
    return {
      props: {
        envs,
      },
      // Next.js will attempt to re-generate the page:
      // - When a request comes in
      // - At most once every 10 seconds
      revalidate: 60, // In seconds
    };
  } catch (error) {
    console.error(error);
    return {
      props: {
        envs: [],
      },
      // Next.js will attempt to re-generate the page:
      // - When a request comes in
      // - At most once every 10 seconds
      revalidate: 60, // In seconds
    };
  }
};
