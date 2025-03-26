"use client";
import { ReviewerForm } from "../_components/ReviewerForm";

export default function NewReviewerPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <ReviewerForm isNew={true} />
    </div>
  );
}
