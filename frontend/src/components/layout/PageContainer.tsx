import type { ReactNode } from "react";

type PageContainerProps = {
  title: string;
  description?: string;
  children?: ReactNode;
};

function PageContainer({ title, description, children }: PageContainerProps) {
  return (
    <main className="page-shell">
      <section className="page-card">
        <span className="page-badge">Frontend structure ready</span>
        <h1>{title}</h1>
        {description ? <p className="page-description">{description}</p> : null}
        {children}
      </section>
    </main>
  );
}

export default PageContainer;
