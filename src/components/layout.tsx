import type { PropsWithChildren } from "react";

const PageLayout = (props: PropsWithChildren<{}>) => {
  return (
    <main className="flex h-full justify-center">
      <section className="flex min-h-screen h-full w-full flex-col border-x border-slate-400 md:max-w-2xl">
        {props.children}
      </section>
    </main>
  );
};

export default PageLayout;
