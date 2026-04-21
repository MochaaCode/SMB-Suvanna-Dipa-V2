import { Metadata } from "next";
import { getCardsWithProfiles, getUsersForCards } from "@/actions/admin/cards";
import { CardManagementUI } from "@/components/admin/cards/CardManagementUI";

export const metadata: Metadata = {
  title: "Manajemen Kartu RFID",
  description: "Kelola kartu RFID dan hubungkan dengan profil pengguna",
};

export default async function CardsPage() {
  const [cards, availableUsers] = await Promise.all([
    getCardsWithProfiles(),
    getUsersForCards(),
  ]);

  return (
    <CardManagementUI initialCards={cards} availableUsers={availableUsers} />
  );
}
