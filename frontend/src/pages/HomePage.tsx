import PageContainer from "../components/layout/PageContainer.tsx";
import { useAppContext } from "../hooks/useAppContext";

const sections = [
  {
    title: "pages",
    description:
      "Simpan file halaman per route, misalnya HomePage, LoginPage, dan DashboardPage.",
  },
  {
    title: "components",
    description:
      "Isi komponen UI yang reusable seperti Button, Navbar, Card, dan Modal.",
  },
  {
    title: "context",
    description:
      "Tempat React Context untuk state global seperti auth, theme, atau user.",
  },
  {
    title: "hooks / services / utils",
    description:
      "Untuk custom hook, API service, dan helper function supaya kode tetap rapi.",
  },
];

function HomePage() {
  const { appName } = useAppContext();

  return (
    <PageContainer
      title={`Selamat datang di ${appName}`}
      description="Struktur `src` sudah dipisah agar scaling project lebih enak ke depannya."
    >
      <div className="info-grid">
        {sections.map((section) => (
          <article key={section.title} className="info-card">
            <h2>{section.title}</h2>
            <p>{section.description}</p>
          </article>
        ))}
      </div>
    </PageContainer>
  );
}

export default HomePage;
