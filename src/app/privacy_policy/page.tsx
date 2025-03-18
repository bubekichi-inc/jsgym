import React from "react";
import { Footer } from "../(lp)/_components/footer";

export const metadata = {
  title: "プライバシーポリシー | JS Gym",
  description: "JS Gymのプライバシーポリシーについて説明します。",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-8 text-center text-3xl font-bold">
        プライバシーポリシー
      </h1>

      <div className="prose max-w-none">
        <p className="mb-6">
          JS
          gym（以下、「当サイト」といいます。）は、個人情報の取り扱いについて以下のプライバシーポリシーを定め、個人情報保護法を遵守するとともに、適切な情報保護に努めます。
        </p>

        <h2 className="mb-4 mt-8 text-2xl font-semibold">
          第1条（収集する情報および収集方法）
        </h2>
        <p className="mb-6">
          当サイトは、ユーザーが利用登録をする際に、氏名、メールアドレス等の個人情報をお尋ねする場合があります。また、ユーザーと提携先などとの間でなされた取引記録や決済に関する情報を収集する場合があります。
        </p>

        <h2 className="mb-4 mt-8 text-2xl font-semibold">
          第2条（個人情報の利用目的）
        </h2>
        <p className="mb-4">
          当サイトは、収集した個人情報を以下の目的で利用します。
        </p>
        <ul className="mb-6 list-disc space-y-2 pl-6">
          <li>当サイトの提供・運営のため</li>
          <li>ユーザーからのお問い合わせに回答するため（本人確認を含む）</li>
          <li>
            ユーザーが利用中のサービスに関する更新情報や新機能、キャンペーンなどの案内をメールで送付するため
          </li>
          <li>メンテナンス、重要なお知らせ等、必要に応じた連絡を行うため</li>
          <li>
            利用規約違反や不正利用を行ったユーザーを特定し、利用をお断りするため
          </li>
          <li>
            ユーザーに自身の登録情報の閲覧や変更、削除、ご利用状況の確認を行っていただくため
          </li>
          <li>有料サービスにおいて、利用料金を請求するため</li>
          <li>上記に付随する目的</li>
        </ul>

        <h2 className="mb-4 mt-8 text-2xl font-semibold">
          第3条（アクセス解析ツールについて）
        </h2>
        <p className="mb-4">
          当サイトは以下のアクセス解析ツールを利用しています。
        </p>
        <ul className="mb-6 list-disc space-y-2 pl-6">
          <li>
            <strong>Google アナリティクス</strong>：Google
            Inc.が提供するアクセス解析ツールで、トラフィックデータ収集のためにCookieを使用しています。このデータは匿名で収集され、個人を特定するものではありません。詳細は「
            <a
              href="https://policies.google.com/technologies/partner-sites?hl=ja"
              className="text-blue-600 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Googleのサービスを使用するサイトやアプリから収集した情報のGoogleによる使用
            </a>
            」をご参照ください。
          </li>
          <li>
            <strong>Microsoft Clarity</strong>：Microsoft
            Corporationが提供するユーザー行動分析ツールで、訪問したページ、サイトの滞在時間、訪問経路、クリックの対象等に関する情報を匿名で収集します。詳細は
            <a
              href="https://privacy.microsoft.com/ja-jp/privacystatement"
              className="text-blue-600 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Microsoftのプライバシーに関する声明
            </a>
            をご参照ください。
          </li>
        </ul>
        <p className="mb-6">
          これらの収集を拒否したい場合は、お使いのブラウザでCookieを無効にしてください。
        </p>

        <h2 className="mb-4 mt-8 text-2xl font-semibold">
          第4条（個人情報の第三者提供）
        </h2>
        <p className="mb-4">
          当サイトは、ユーザーの同意を得ることなく、第三者に個人情報を提供することはありません。ただし、以下の場合は除きます。
        </p>
        <ul className="mb-6 list-disc space-y-2 pl-6">
          <li>法令に基づき開示が必要な場合</li>
          <li>
            人の生命、身体または財産の保護のために必要であり、本人の同意を得ることが困難な場合
          </li>
          <li>
            公衆衛生の向上または児童の健全な育成の推進のために特に必要であり、本人の同意を得ることが困難な場合
          </li>
          <li>
            国や地方公共団体が法令に定める事務を遂行するために必要であり、本人の同意を得ることで事務の遂行に支障がある場合
          </li>
        </ul>

        <h2 className="mb-4 mt-8 text-2xl font-semibold">
          第5条（個人情報の安全管理措置）
        </h2>
        <p className="mb-6">
          当サイトは、収集した個人情報を正確かつ安全に管理し、漏洩、滅失、き損等の防止に必要な措置を講じます。
        </p>

        <h2 className="mb-4 mt-8 text-2xl font-semibold">
          第6条（プライバシーポリシーの変更）
        </h2>
        <p className="mb-6">
          本プライバシーポリシーの内容は、ユーザーに通知することなく変更されることがあります。変更後のプライバシーポリシーは、当サイトに掲載された時点で効力を生じるものとします。
        </p>

        <h2 className="mb-4 mt-8 text-2xl font-semibold">お問い合わせ</h2>
        <p className="mb-6">
          本プライバシーポリシーに関するお問い合わせは、以下の窓口までお願いいたします。
        </p>
        <p className="mb-6">株式会社bubekichi</p>

        <h2 className="mb-4 mt-8 text-2xl font-semibold">参考資料</h2>
        <ul className="mb-6 list-disc space-y-2 pl-6">
          <li>
            <a
              href="https://marketingplatform.google.com/about/analytics/terms/jp/"
              className="text-blue-600 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Google アナリティクス利用規約
            </a>
          </li>
          <li>
            <a
              href="https://clarity.microsoft.com/terms"
              className="text-blue-600 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Microsoft Clarity 利用規約
            </a>
          </li>
          <li>
            <a
              href="https://policies.google.com/technologies/partner-sites?hl=ja"
              className="text-blue-600 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Googleによるデータ使用方法
            </a>
          </li>
          <li>
            <a
              href="https://privacy.microsoft.com/ja-jp/privacystatement"
              className="text-blue-600 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Microsoftのプライバシーに関する声明
            </a>
          </li>
        </ul>
      </div>
      <Footer />
    </div>
  );
}
