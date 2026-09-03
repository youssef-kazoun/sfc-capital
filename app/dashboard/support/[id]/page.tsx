import TicketThread from "@/components/site/ticket-thread";

export default async function DashboardTicketPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <TicketThread ticketId={id} />;
}
