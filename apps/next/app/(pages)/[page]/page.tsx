export default function Page({
  params,
}: {
  params: Promise<{ page: string }>;
}) {
  // Will get some specific pages: Contact, About, Downloads and Supporters

  return (
    <div>
      <h1>Fetch specific pages by page param</h1>
      <p>{params.page}</p>
    </div>
  );
}
