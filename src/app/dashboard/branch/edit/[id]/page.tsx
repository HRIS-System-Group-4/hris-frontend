import { Metadata } from "next";
import BranchEditForm from "./_components/BranchEditForm";

export const metadata: Metadata = {
  title: "Edit Branch",
};

export default function EditBranchPage() {
  return <BranchEditForm />;
}