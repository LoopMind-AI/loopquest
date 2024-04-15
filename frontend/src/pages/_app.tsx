import "@/styles/globals.css";
import Layout from "@/components/layout";
import { EvalProvider } from "@/context/eval_context";
import { DatasetProvider } from "@/context/dataset_context";
import type { AppProps } from "next/app";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";

config.autoAddCss = false;

const App = ({ Component, pageProps }: AppProps): JSX.Element => {
  return (
    <EvalProvider>
      <DatasetProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </DatasetProvider>
    </EvalProvider>
  );
};

export default App;
