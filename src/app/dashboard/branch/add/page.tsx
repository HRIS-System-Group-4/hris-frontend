import { Metadata } from "next";
import BranchForm from "./_components/BranchForm";

export const metadata: Metadata = {
  title: "Add Branch",
};

export default function AddBranchPage() {
  return <BranchForm />;
}