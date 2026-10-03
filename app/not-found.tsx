import Link from "next/link";
export default function NotFound() {
  return (
    <main id="main" className="document-page not-found">
      <p className="eyebrow">404 / OUTSIDE THE EXPERIMENT</p>
      <h1>
        This path
        <br />
        has no specimen.
      </h1>
      <p>The project may have moved. The workbench is a good place to start.</p>
      <Link href="/work" className="primary-link">
        Return to selected work ↗
      </Link>
    </main>
  );
}
