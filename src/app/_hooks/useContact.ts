"use client";
import { api } from "../_utils/api";
import type { ContactRequest, ContactResponse } from "../api/contact/route";

export const useContact = () => {
  const sendContact = async (data: ContactRequest) => {
    return await api.post<ContactRequest, ContactResponse>(
      "/api/contact",
      data
    );
  };
  return { sendContact };
};
