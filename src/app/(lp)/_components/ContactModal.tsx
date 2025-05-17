"use client";

import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { Button } from "@/app/_components/Button";
import { Modal } from "@/app/_components/Modal";
import { TextInput } from "@/app/_components/TextInput";
import { useContact } from "@/app/_hooks/useContact";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const ContactModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState("");
  const [body, setBody] = useState("");
  const [state, setState] = useState<"form" | "confirm" | "complete">("form");
  const [loading, setLoading] = useState(false);
  const { sendContact } = useContact();

  const reset = () => {
    setEmail("");
    setBody("");
    setState("form");
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await sendContact({ email, body });
      setState("complete");
    } catch (e) {
      console.error(e);
      alert("送信に失敗しました");
      setState("form");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} maxWidth="600px">
      {state === "form" && (
        <form className="space-y-4">
          <h2 className="text-xl font-bold">お問い合わせ</h2>
          <TextInput
            label="メールアドレス"
            id="contact-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <div>
            <label
              htmlFor="contact-body"
              className="mb-1 block text-lg font-bold"
            >
              お問い合わせ内容
            </label>
            <textarea
              id="contact-body"
              className="w-full rounded border px-4 py-2"
              rows={6}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              required
            />
          </div>
          <div className="flex justify-end">
            <Button
              variant="bg-blue"
              type="button"
              onClick={() => setState("confirm")}
              disabled={!email || !body}
            >
              確認
            </Button>
          </div>
        </form>
      )}

      {state === "confirm" && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold">内容確認</h2>
          <div>
            <div className="mb-1 text-lg font-bold">メールアドレス</div>
            <p className="break-all">{email}</p>
          </div>
          <div>
            <div className="mb-1 text-lg font-bold">お問い合わせ内容</div>
            <p className="whitespace-pre-wrap break-words">{body}</p>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="bg-gray"
              type="button"
              onClick={() => setState("form")}
            >
              戻る
            </Button>
            <Button
              variant="bg-blue"
              type="button"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "送信中..." : "送信"}
            </Button>
          </div>
        </div>
      )}

      {state === "complete" && (
        <div className="space-y-6 text-center">
          <FontAwesomeIcon
            icon={faCheck}
            className="mx-auto size-8 text-green-500"
          />
          <p>送信が完了しました。2営業日以内にご返信いたします。</p>
          <div className="flex justify-center">
            <Button variant="bg-blue" type="button" onClick={handleClose}>
              閉じる
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
};
